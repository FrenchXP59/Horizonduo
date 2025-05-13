// src/components/SwipeWrapper.jsx
import React, { useRef } from "react";

export default function SwipeWrapper({ children }) {
  const start = useRef({ x: 0, y: 0 });

  const onTouchStart = (e) => {
    start.current.x = e.touches[0].pageX;
    start.current.y = e.touches[0].pageY;
  };

  const onTouchMove = (e) => {
    const dx = e.touches[0].pageX - start.current.x;
    const dy = e.touches[0].pageY - start.current.y;
    // Si c’est plutôt vertical, ou trop court horizontal (<80px), on stoppe la propagation
    if (Math.abs(dy) > Math.abs(dx) * 1.5 || Math.abs(dx) < 80) {
      e.stopPropagation();
    }
  };

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
      {children}
    </div>
  );
}