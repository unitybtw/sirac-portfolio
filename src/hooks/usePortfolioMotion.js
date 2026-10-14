import { useEffect } from 'react';

// One observer for the page, including lazy-loaded sections. Content is visible
// by default, so a failed/unsupported animation can never leave a blank section.
export function usePortfolioMotion() {
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root || !window.IntersectionObserver) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let seen = new WeakSet();
    const active = new Map();
    let observer;
    const stop = () => {
      observer?.disconnect();
      for (const [element, animation] of active) {
        animation.cancel();
        element.dataset.motionState = 'done';
      }
      active.clear();
    };
    const register = node => {
      if (!(node instanceof Element) || !observer || preference.matches) return;
      const targets = [...node.querySelectorAll('[data-motion]')];
      if (node.matches('[data-motion]')) targets.unshift(node);
      for (const element of targets) {
        if (seen.has(element) || element.dataset.motionState === 'done') continue;
        seen.add(element);
        observer.observe(element);
      }
    };
    const start = () => {
      if (preference.matches) return;
      seen = new WeakSet();
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target;
          observer.unobserve(element);
          if (entry.boundingClientRect.top < -20 || !element.animate) { element.dataset.motionState = 'done'; continue; }
          const compact = window.innerWidth < 769;
          const delay = Math.min(Number(element.dataset.motionOrder) || 0, 3) * (compact ? 45 : 75);
          const animation = element.animate([
            { opacity: 0.15, transform: `translateY(${compact ? 16 : 26}px)` },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: compact ? 480 : 650, delay, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'backwards' });
          element.dataset.motionState = 'playing';
          active.set(element, animation);
          animation.onfinish = () => { active.delete(element); element.dataset.motionState = 'done'; };
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
      register(root);
    };
    const change = () => { stop(); if (!preference.matches) start(); };
    start();
    const mutations = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) register(node);
    });
    mutations.observe(root, { childList: true, subtree: true });
    preference.addEventListener('change', change);
    return () => { stop(); mutations.disconnect(); preference.removeEventListener('change', change); };
  }, []);
}
