import React, { useEffect, useRef } from 'react';

export default function ShootingStarCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let prevMouse = { x: null, y: null };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx + (Math.random() - 0.5) * 1.8;
        this.vy = vy + (Math.random() - 0.5) * 1.8;
        this.size = Math.random() * 3.5 + 1.8;
        this.maxLife = Math.random() * 35 + 25;
        this.life = this.maxLife;
        this.starSparkle = Math.random() > 0.45;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= 1;
      }

      draw(context) {
        const progress = this.life / this.maxLife;
        const alpha = Math.max(0, progress);
        const currentSize = this.size * progress;

        context.save();
        context.shadowBlur = 18;
        context.shadowColor = '#FF1493';

        if (this.starSparkle) {
          // 4-point star sparkle colored #FF1493
          context.fillStyle = `rgba(255, 20, 147, ${alpha})`;
          context.beginPath();
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const xOffset = Math.cos(angle) * currentSize * 2.8;
            const yOffset = Math.sin(angle) * currentSize * 2.8;
            context.lineTo(this.x + xOffset, this.y + yOffset);
            const innerAngle = angle + Math.PI / 4;
            const innerX = Math.cos(innerAngle) * (currentSize * 0.5);
            const innerY = Math.sin(innerAngle) * (currentSize * 0.5);
            context.lineTo(this.x + innerX, this.y + innerY);
          }
          context.closePath();
          context.fill();

          // Bright white center core
          context.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          context.beginPath();
          context.arc(this.x, this.y, currentSize * 0.5, 0, Math.PI * 2);
          context.fill();
        } else {
          // Soft radial glow in #FF1493
          const grad = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize * 2.5);
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          grad.addColorStop(0.3, `rgba(255, 20, 147, ${alpha * 0.85})`);
          grad.addColorStop(1, `rgba(255, 20, 147, 0)`);

          context.fillStyle = grad;
          context.beginPath();
          context.arc(this.x, this.y, currentSize * 2.5, 0, Math.PI * 2);
          context.fill();
        }

        context.restore();
      }
    }

    const handlePointerMove = (e) => {
      const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);

      if (x === undefined || y === undefined) return;

      let vx = 0;
      let vy = 0;

      if (prevMouse.x !== null) {
        vx = (x - prevMouse.x) * 0.18;
        vy = (y - prevMouse.y) * 0.18;
      }

      prevMouse.x = x;
      prevMouse.y = y;

      const speed = Math.hypot(vx, vy);
      const count = Math.min(Math.floor(speed * 1.5) + 3, 10);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, -vx * 0.35, -vy * 0.35));
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="canvas" ref={canvasRef} />;
}
