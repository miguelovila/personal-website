import { useEffect, useState, useRef } from "react";

interface SlideshowProps {
  images: string[];
  alt: string;
}

export default function Slideshow({ images, alt }: SlideshowProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = containerRef.current?.closest("article");
    if (!card) return;

    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <div ref={containerRef} className="relative w-full h-[200px] overflow-hidden">
      {/* Images */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={alt}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full shadow transition-colors ${
              i === index ? "bg-primary" : "bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
