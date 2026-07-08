const fs = require('fs');
fs.readFile('public/mug.glb', (err, data) => {
  if (err) throw err;
  // GLB has a 12-byte header, then chunks.
  // Chunk 0 is JSON.
  const jsonChunkLength = data.readUInt32LE(12);
  const jsonChunkType = data.readUInt32LE(16);
  if (jsonChunkType === 0x4E4F534A) { // 'JSON'
    const jsonStr = data.toString('utf8', 20, 20 + jsonChunkLength);
    const gltf = JSON.parse(jsonStr);
    console.log("Nodes in GLB:");
    gltf.nodes.forEach(n => console.log(n.name));
  }
});
