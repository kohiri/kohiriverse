// 14 orbs with random positions in 3D space
// Neon colors for a vibrant aesthetic

// Texture pool — 14 slots, one per orb (in order of creation).
// Add your custom art filenames here as you create them.
const TEXTURE_POOL = [
  '/textures/kush.jpg',   // Orb 1 (Kush)
  '/textures/orb_02.jpg', // Orb 2
  '/textures/orb_03.jpg', // Orb 3
  '/textures/orb_04.jpg', // Orb 4
  '/textures/orb_5.jpg',  // Orb 5
  '/textures/orb_6.jpg',  // Orb 6
  '/textures/orb_7.jpg',  // Orb 7
  '/textures/orb_8.jpg',  // Orb 8
  '/textures/orb_9.jpg',  // Orb 9
  '/textures/orb_10.jpg', // Orb 10
  '/textures/orb_11.jpg', // Orb 11
  '/textures/orb_12.jpg', // Orb 12
  '/textures/orb_13.jpg', // Orb 13
  '/textures/orb_14.jpg', // Orb 14
];

const colors = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

const MIN_DISTANCE = 14;
const MIN_DIST_SQ = MIN_DISTANCE * MIN_DISTANCE;

const distanceSq = (p1, p2) => {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  const dz = p1[2] - p2[2];
  return dx * dx + dy * dy + dz * dz;
};

const generateStars = (numStars) => {
  const stars = [];

  let attempts = 0;
  while (stars.length < numStars && attempts < 1000) {
    // Spread across X: ±40, Y: ±30, Z: ±40 for a wider exploratory feel
    const position = [
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 80,
    ];
    
    let tooClose = false;
    for (const star of stars) {
      if (distanceSq(position, star.position) < MIN_DIST_SQ) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      const size = 1.8 + Math.random() * 1.5; // Range: 1.8 – 3.3 (larger, more dramatic orbs)
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const photos = Array.from({ length: Math.floor(Math.random() * 5) + 4 }).map((_, idx) => (
        `https://picsum.photos/seed/${stars.length}_${idx}/300/300`
      ));

      const orbIndex = stars.length;
      stars.push({
        id: `star_${orbIndex}`,
        name: orbIndex === 0 ? 'Kush' : 
              orbIndex === 1 ? 'Scrapbook' : 
              orbIndex === 2 ? 'Playlists' : 
              orbIndex === 6 ? 'Photobooth' : 
              orbIndex === 8 ? 'Cyber Studio' : 
              `Album ${orbIndex + 1}`,
        position,
        color,
        size,
        texture: TEXTURE_POOL[orbIndex] ?? null, // Custom art if available, else emissive glow
        photos
      });
    }
    attempts++;
  }
  return stars;
};

export const starsData = generateStars(14);
