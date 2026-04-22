# Optimization Audit Report

### 1) Optimization Summary

* **Optimization Health:** The application has a rich, premium interactive UI (Framer Motion, Canvas, Three.JS), but it struggles with severe runtime performance bottlenecks due to aggressive client-side polling, unbounded DB queries, and excessive React re-renders tied to global event listeners. 
* **Top 3 Highest-Impact Improvements:**
  1. Stop unbounded data fetching in `PresencePanel` (currently downloads the entire visitors history every 8 seconds).
  2. Implement native Firebase WebSockets (`onValue`) instead of REST API polling for multiplayer features.
  3. Decouple Canvas & Mouse events from React state (partially fixed, but architectural refactoring is better).
* **Biggest risk if no changes are made:** **Cost & Memory Exhaustion.** As more visitors are recorded in the Firebase DB, the `fetch(DB_URL/visitors.json)` payload will grow indefinitely. 100 idle users downloading a 5MB JSON every 8 seconds will rapidly exceed Firebase Free Tier bandwidth, rate limiting the app, and causing browser Out-of-Memory (OOM) crashes.

---

### 2) Findings (Prioritized)

#### A. Unbounded Firebase Polling (OOM & Cost Risk)
* **Category:** Network / DB / Cost
* **Severity:** Critical
* **Impact:** Bandwidth, Latency, API Cost, Client Memory
* **Evidence:** `PresencePanel.jsx` Line 79: `const res = await fetch(DB_URL/visitors.json);`
* **Why it’s inefficient:** This performs a full table scan over REST. It downloads *every visitor who has ever visited* exactly every 8 seconds, forcing the client to loop through all of them just to filter `now - v.lastSeen < 75000`. As the database grows, payload size grows linearly. 
* **Recommended fix:** Migrate to the official Firebase JS SDK and use `.orderByChild("lastSeen").startAt(Date.now() - 75000)` to query specifically for active users. 
* **Tradeoffs / Risks:** Requires adding `firebase` to `package.json` and changing auth/init logic vs lightweight REST approach.
* **Expected impact estimate:** 99% reduction in network payload sizes over time.
* **Removal Safety:** Safe (Logic update only)
* **Reuse Scope:** Service-wide (Presence Panel)

#### B. Reaction Sync via REST Polling
* **Category:** Network / Architecture
* **Severity:** High
* **Impact:** Latency, CPU
* **Evidence:** `PresencePanel.jsx` Line 91: `fetch(DB_URL/reactions.json)` running every 8 seconds.
* **Why it’s inefficient:** Emojis are meant to be real-time (floating across screens). Catching them via an 8-second polling interval means users will miss most reactions or see them delayed up to 8 seconds. Like visitors, it fetches the *entire* reactions table to filter fresh ones.
* **Recommended fix:** Use Firebase WebSockets (`onChildAdded(ref('reactions'))`) so the client is *pushed* the reaction immediately without polling.
* **Tradeoffs / Risks:** Same as above, requires Firebase SDK.
* **Expected impact estimate:** Zero-delay real-time reactions and 100x fewer HTTP requests.
* **Removal Safety:** Safe
* **Reuse Scope:** Service-wide

#### C. React State Triggers on Window MouseMove
* **Category:** Frontend / CPU
* **Severity:** High (Patched locally, but architecture is risky)
* **Impact:** CPU, Frame Drops, Battery Drain
* **Evidence:** `CompanionDrone.jsx` previously called `setMousePos` on every `mousemove`. 
* **Why it’s inefficient:** Linking `mousemove` directly to a core React `useState` causes the Virtual DOM to recalculate and diff the entire `CompanionDrone` component tree (including heavy SVG/framer-motion wrappers) up to 120 times per second (120Hz displays).
* **Recommended fix:** Use Framer Motion's `useMotionValue` for `mousePos` or throttle the update. *(Note: I have already applied a 50ms throttle to the live code via previous interaction).*
* **Tradeoffs / Risks:** Throttling creates a slightly less responsive eye-tracking feel for the drone.
* **Expected impact estimate:** Fixes the bulk of the "site lagging" complaints.
* **Removal Safety:** Safe
* **Reuse Scope:** Local file

#### D. Object & String Allocation in Canvas Loop
* **Category:** Memory / CPU
* **Severity:** Medium
* **Impact:** Garbage Collection Stutters
* **Evidence:** `App.jsx` (Lines 156-158): `const color = theme === 'dark' ? (isCyan ? 'rgba(...)' : 'rgba(...)') : ...` is executed *inside* the `for (let i = 0; i < drops.length; i++)` loop, which is called every 80ms.
* **Why it’s inefficient:** This creates thousands of new string bindings per second, triggering constant Garbage Collection. 
* **Recommended fix:** Pre-define the 4 color strings outside the `draw` function and reference them.
* **Tradeoffs / Risks:** None.
* **Expected impact estimate:** Fewer micro-stutters.
* **Removal Safety:** Very Safe
* **Reuse Scope:** Local file

---

### 3) Quick Wins (Do First)

1. **Fix Canvas Allocations:** Extract the `rgba(...)` color assignments outside the rendering loop in `App.jsx`.
2. **REST Query Rules:** If you refuse to use the Firebase SDK, at least append query parameters to your REST call: `fetch(DB_URL + '/visitors.json?orderBy="lastSeen"&startAt=' + (Date.now() - 75000))`. (Requires setting `.indexOn: ["lastSeen"]` in Firebase Database Rules).
3. **Throttle `fetch` Intervals:** Change the 8-second `setInterval` in `PresencePanel.jsx` to 15 seconds to halve API load instantly.

---

### 4) Deeper Optimizations (Do Next)

* **Refactor Presence to Firebase SDK:** Replace the raw REST interactions (`fetch()`) with the official `firebase/database` web SDK. This provides WebSocket real-time connections, solving both the payload issue and the reaction delay issue natively.
* **React Three Fiber (Canvas) Culling:** The 3D viewer in `App.jsx` continues to render even when scrolled completely out of view. Implement a component like `IntersectionObserver` or `@react-three/drei`'s `<BakeShadows>` / `performance` tools to pause the render loop when invisible.

---

### 5) Validation Plan

* **Benchmarks & Profiling:**
  1. Open Chrome DevTools -> Performance Tab. 
  2. Record a 10-second trace while moving the mouse rapidly.
  3. **Metric to Compare:** Before optimizations, "Scripting" time will be extremely high. After, "Scripting" should be <10% of total time.
* **Network Throttling Check:**
  1. Open Network Tab -> Filter by `XHR/Fetch`.
  2. Verify payload size of `visitors.json` over 5 minutes. If it stays under 2KB, optimization is successful.
* **Memory Leaks:** Open Chrome Task Manager (`Shift+Esc`) and leave the site open for 1 hour. Watch the JS Memory. If it stabilizes, caching/polling fixes hold.

---

### 6) Optimized Code / Patch

**Fixing the Unbounded Firebase REST Call (PresencePanel.jsx)**
*Requires updating your Firebase Realtime DB Rules to allow indexing on `lastSeen`.*

```javascript
  // OLD (PresencePanel.jsx Line 79):
  // const res = await fetch(`${DB_URL}/visitors.json`);

  // NEW (Optimized):
  const fetchVisitors = async () => {
    try {
      const cutoff = Date.now() - 75000;
      // Using Firebase REST query parameters
      const url = `${DB_URL}/visitors.json?orderBy="lastSeen"&startAt=${cutoff}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data) { setVisitors({}); return; }
      
      setVisitors(data); // No local filtering needed anymore!
    } catch (_) {}
  };
```

**Fixing the Canvas Object Churn (App.jsx Matrix Background)**

```javascript
  // Move this OUTSIDE the draw loop (App.jsx)
  const colorsDark = ['rgba(0, 240, 255, 0.15)', 'rgba(138, 43, 226, 0.15)'];
  const colorsLight = ['rgba(0, 150, 255, 0.1)', 'rgba(100, 43, 200, 0.1)'];

  const draw = () => {
      // ... loop
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        
        // No new string allocations!
        const palette = theme === 'dark' ? colorsDark : colorsLight;
        ctx.fillStyle = palette[Math.random() > 0.5 ? 0 : 1];
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        // ...
      }
  };
```
