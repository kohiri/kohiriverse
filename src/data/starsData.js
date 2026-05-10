import textureKush from '../../public/textures/kush.jpg';
import textureOrb2 from '../../public/textures/orb_02.jpg';
import textureOrb3 from '../../public/textures/orb_03.jpg';
import textureOrb4 from '../../public/textures/orb_04.jpg';
import textureOrb5 from '../../public/textures/orb_5.jpg';
import textureOrb6 from '../../public/textures/orb_6.jpg';
import textureOrb7 from '../../public/textures/orb_7.jpg';
import textureOrb8 from '../../public/textures/orb_8.jpg';
import textureOrb9 from '../../public/textures/orb_9.jpg';
import textureOrb10 from '../../public/textures/orb_10.jpg';
import textureOrb11 from '../../public/textures/orb_11.jpg';
import textureOrb12 from '../../public/textures/orb_12.jpg';
import textureOrb13 from '../../public/textures/orb_13.jpg';
import textureOrb14 from '../../public/textures/orb_14.jpg';

// 14 orbs with random positions in 3D space
// Neon colors for a vibrant aesthetic

// Texture pool — 14 slots, one per orb (in order of creation).
// Add your custom art filenames here as you create them.
const TEXTURE_POOL = [
  textureKush,   // Orb 1 (Kush)
  textureOrb2,   // Orb 2
  textureOrb3,   // Orb 3
  textureOrb4,   // Orb 4
  textureOrb5,   // Orb 5
  textureOrb6,   // Orb 6
  textureOrb7,   // Orb 7
  textureOrb8,   // Orb 8
  textureOrb9,   // Orb 9
  textureOrb10,  // Orb 10
  textureOrb11,  // Orb 11
  textureOrb12,  // Orb 12
  textureOrb13,  // Orb 13
  textureOrb14,  // Orb 14
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

const generateStars = () => {
  const stars = [];
  const allowedIndices = [0, 1, 2, 3, 6, 7, 8, 11, 12, 13];

  // We loop through 14 potential slots but only create the allowed ones
  for (let orbIndex = 0; orbIndex < 14; orbIndex++) {
    if (!allowedIndices.includes(orbIndex)) continue;

    let position;
    let attempts = 0;
    let tooClose = true;

    while (tooClose && attempts < 100) {
      position = [
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 80,
      ];
      
      tooClose = false;
      for (const star of stars) {
        if (distanceSq(position, star.position) < MIN_DIST_SQ) {
          tooClose = true;
          break;
        }
      }
      attempts++;
    }

    const size = 1.8 + Math.random() * 1.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const photos = Array.from({ length: Math.floor(Math.random() * 5) + 4 }).map((_, idx) => (
      `https://picsum.photos/seed/${orbIndex}_${idx}/300/300`
    ));

    stars.push({
      id: `star_${orbIndex}`,
      name: orbIndex === 0 ? 'Kush' : 
            orbIndex === 1 ? 'Scrapbook' : 
            orbIndex === 2 ? 'Playlists' : 
            orbIndex === 6 ? 'Photobooth' : 
            orbIndex === 7 ? 'Headspace' : 
            orbIndex === 8 ? 'Sound Studio' : 
            orbIndex === 11 ? 'Spooky' :
            `Album ${orbIndex + 1}`,
      position,
      color,
      size,
      texture: TEXTURE_POOL[orbIndex] ?? null,
      photos
    });
  }
  return stars;
};

export const starsData = generateStars();
