// Node 18+ has native fetch

(async () => {
  const DB_URL = 'https://sirac-portfolio-default-rtdb.europe-west1.firebasedatabase.app';
  const cutoff = Date.now() - 75000;
  
  try {
    const url = `${DB_URL}/visitors.json?orderBy="lastSeen"&startAt=${cutoff}`;
    console.log('Fetching:', url);
    const res = await fetch(url);
    const status = res.status;
    console.log('Status:', status);
    
    const text = await res.text();
    console.log('Response (first 500 chars):', text.substring(0, 500));
  } catch (err) {
    console.error('Error fetching:', err.message);
  }
})();
