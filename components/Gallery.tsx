"use client";

import { useRef, useState } from "react";

export default function Gallery({ images, name, badge }: { images: string[]; name: string; badge?: string }) {
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);
  const go = (d: number) => setI((v) => (v + d + images.length) % images.length);

  return (
    <div className="gallery">
      <div
        className="main"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        {badge && <span className="pbadge sale gtag">{badge}</span>}
        <img src={images[i]} alt={i === 0 ? name : `${name} — slika ${i + 1}`} fetchPriority="high" width={800} height={800} />
        {images.length > 1 && (
          <>
            <button className="gnav prev" onClick={() => go(-1)} aria-label="Prethodna slika">
              ‹
            </button>
            <button className="gnav next" onClick={() => go(1)} aria-label="Sledeća slika">
              ›
            </button>
            <span className="gcount">
              {i + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, n) => (
            <button key={src} className={n === i ? "active" : ""} onClick={() => setI(n)} aria-label={`Slika ${n + 1}`}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
