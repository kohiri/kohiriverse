import { DragControls } from '@react-three/drei'
import Star from './Star'

export default function StarsField({ onStarClick, galaxyData, setGalaxyData, setIsDragging }) {
  // If we don't have galaxyData yet during mount sync, just return null
  if (!galaxyData) return null;

  return (
    <group>
      {galaxyData.map((star) => (
        <DragControls 
          key={star.id} 
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          <Star
            starData={star}
            position={star.position}
            color={star.color}
            size={star.size}
            name={star.name}
            texture={star.texture}
            // Use onPointerDown/Up to detect a tap if onClick is being swallowed by DragControls
            onClick={() => {
              // Auto fullscreen on mobile when entering a planet
              if (window.innerWidth <= 1024 && !document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
              }
              if (onStarClick) onStarClick(star);
            }}
          />
        </DragControls>
      ))}
    </group>
  )
}
