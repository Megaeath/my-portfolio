import React from 'react';

const Layer = ({ 
  motion, 
  depth = 1, 
  mouseInfluence = 1, 
  floatConfig = { amp: 0, freq: 0, offset: 0 },
  basePosition = { x: 0, y: 0 },
  children 
}) => {
  const { mouse, scroll, time } = motion;

  const scrollEffect = scroll.y * (depth - 1);
  const mouseEffectX = mouse.x * 100 * mouseInfluence * depth;
  const mouseEffectY = mouse.y * 100 * mouseInfluence * depth;

  const floatY = Math.sin(time * floatConfig.freq + floatConfig.offset) * floatConfig.amp;
  const floatX = Math.cos(time * floatConfig.freq * 0.8 + floatConfig.offset) * floatConfig.amp * 0.5;

  const style = {
    transform: `
      translate3d(
        calc(${basePosition.x}px + ${mouseEffectX + floatX}px), 
        calc(${basePosition.y}px - ${scrollEffect - mouseEffectY - floatY}px), 
        0px
      )
    `,
    zIndex: Math.floor(depth * 100),
    opacity: depth > 2 ? 0.3 : 1,
    filter: `blur(${Math.max(0, depth - 1.5) * 2}px)`
  };

  return (
    <div className="bg-layer" style={style}>
      {children}
    </div>
  );
};

export default Layer;
