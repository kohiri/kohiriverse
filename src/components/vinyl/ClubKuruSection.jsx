import React, { useEffect, useRef, useState } from 'react';

export default function ClubKuruSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`ck-section ${visible ? 'ck-section--visible' : ''}`}
    >
      <div className={`ck-foreground ${visible ? 'ck-foreground--visible' : ''}`}>
        <img src="/textures/1.jpg" alt="Club Kuru feature layout part 1" className="ck-ref-image" />
        <img src="/textures/radio.jpg" alt="Radio" className="ck-ref-image" />
        <img src="/textures/belgium.jpg" alt="Belgium feature" className="ck-ref-image" />
        <img src="/textures/spiracle.jpg" alt="Spiracle feature" className="ck-ref-image" />
      </div>
    </section>
  );
}
