import { useMousePosition } from '@/hooks/useMousePosition';

export default function MouseGlow() {
  const { x, y } = useMousePosition();

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(245, 158, 11, 0.12), transparent 40%)`,
      }}
    />
  );
}
