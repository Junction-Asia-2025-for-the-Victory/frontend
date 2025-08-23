import React, { useEffect, useRef } from 'react';

interface GlowCanvasProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  colors?: { r: number; g: number; b: number }[];
}

class GlowParticle {
  x: number;
  y: number;
  radius: number;
  rgb: { r: number; g: number; b: number };
  vx: number;
  vy: number;
  sinValue: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    rgb: { r: number; g: number; b: number }
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rgb = rgb;

    this.vx = Math.random() * 4;
    this.vy = Math.random() * 4;

    this.sinValue = Math.random();
  }

  animate(
    ctx: CanvasRenderingContext2D,
    stageWidth: number,
    stageHeight: number
  ) {
    this.sinValue += 0.01;

    this.radius += Math.sin(this.sinValue);

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) {
      this.vx *= -1;
      this.x += 10;
    } else if (this.x > stageWidth) {
      this.vx *= -1;
      this.x -= 10;
    }

    if (this.y < 0) {
      this.vy *= -1;
      this.y += 10;
    } else if (this.y > stageHeight) {
      this.vy *= -1;
      this.y -= 10;
    }

    ctx.beginPath();

    const g = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius * 0.01,
      this.x,
      this.y,
      this.radius
    );

    g.addColorStop(0, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 1)`);
    g.addColorStop(1, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 0)`);

    ctx.fillStyle = g;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
}

const DEFAULT_COLORS = [
    { r: 240, g: 240, b: 240 },
    { r: 205, g: 193, b: 255 },
    { r: 229, g: 217, b: 242 },
    { r: 245, g: 239, b: 255 },
];

const GlowCanvas: React.FC<GlowCanvasProps> = ({ 
  className = '',
  colors = DEFAULT_COLORS 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GlowParticle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 부모 요소의 실제 크기 가져오기
    const rect = canvas.getBoundingClientRect();
    const canvasWidth = rect.width || 400;
    const canvasHeight = rect.height || 300;

    const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    const totalParticles = 12;
    const maxRadius = 560;
    const minRadius = 360;

    // 캔버스 설정
    canvas.width = canvasWidth * pixelRatio;
    canvas.height = canvasHeight * pixelRatio;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(pixelRatio, pixelRatio);

    ctx.globalCompositeOperation = "source-over";

    // 파티클 생성
    let curColor = 0;
    const particles: GlowParticle[] = [];

    for (let i = 0; i < totalParticles; i++) {
      const item = new GlowParticle(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight,
        Math.random() * (maxRadius - minRadius) + minRadius,
        colors[curColor]
      );

      if (++curColor >= colors.length) {
        curColor = 0;
      }

      particles[i] = item;
    }

    particlesRef.current = particles;

    // 애니메이션 함수
    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let i = 0; i < totalParticles; i++) {
        const item = particles[i];
        item.animate(ctx, canvasWidth, canvasHeight);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 컴포넌트 언마운트 시 애니메이션 정리
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors]);

  return (
    <canvas 
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full z-0 ${className}`}
      style={{ backgroundColor: '#e0e0e0' }}
    />
  );
};

export default GlowCanvas;