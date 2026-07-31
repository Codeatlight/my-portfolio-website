import React from 'react';

interface CometProps {
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'right';
}

const Comet: React.FC<CometProps> = ({ 
  className = '', 
  delay = 0, 
  duration = 3, 
  direction = 'right' 
}) => {
  const isRight = direction === 'right';

  return (
    <div 
      className={`absolute top-0 pointer-events-none overflow-hidden ${isRight ? 'left-0 right-auto' : 'right-0 left-auto'} ${className}`}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <div 
        className="absolute h-0.5 w-[150px] bg-gradient-to-r"
        style={{
          background: isRight 
            ? 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), #fff)' 
            : 'linear-gradient(to left, transparent, rgba(255, 255, 255, 0.4), #fff)',
          boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.3)',
          borderRadius: '999px',
          animation: `comet-${direction} ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          opacity: 0,
        }}
      >
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full ${isRight ? 'right-0' : 'left-0'}`}
          style={{ boxShadow: '0 0 15px 3px rgba(255, 255, 255, 0.8)' }}
        />
      </div>
      <style>{`
        @keyframes comet-right {
          0% {
            transform: translate(-100%, -100%) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translate(200vw, 200vh) rotate(45deg);
            opacity: 0;
          }
        }
        @keyframes comet-left {
          0% {
            transform: translate(100%, -100%) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: translate(-200vw, 200vh) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Comet;
