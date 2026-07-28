import React, { useState, useEffect } from "react";

interface ResponsiveImageProps {
  srcSm?: string;
  srcMd?: string;
  srcLg?: string;
  srcFallback: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

const getType = (url?: string) => {
  if (!url) return undefined;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  if (clean.endsWith(".webp")) return "image/webp";
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
  if (clean.endsWith(".svg")) return "image/svg+xml";
  if (clean.endsWith(".gif")) return "image/gif";
  if (clean.endsWith(".avif")) return "image/avif";
  return undefined;
};

// Default inline SVG data URI as ultimate fallback if image fails to load
const FALLBACK_SVG = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='100%25' height='100%25' fill='%23171717'/%3E%3Cpath d='M350 250 L450 250 L450 350 L350 350 Z' fill='%23f59e0b' opacity='0.3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f59e0b' font-family='sans-serif' font-size='20' font-weight='bold'%3EGold Buyers Colombo%3C/text%3E%3C/svg%3E";

export default function ResponsiveImage({
  srcSm,
  srcMd,
  srcLg,
  srcFallback,
  alt,
  className = "",
  imgClassName = "",
  priority = false
}: ResponsiveImageProps) {
  const [imgSrc, setImgSrc] = useState(srcFallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(srcFallback);
    setHasError(false);
  }, [srcFallback]);

  const sm = srcSm && srcSm !== srcFallback ? srcSm : undefined;
  const md = srcMd && srcMd !== srcFallback ? srcMd : undefined;
  const lg = srcLg && srcLg !== srcFallback ? srcLg : undefined;

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_SVG);
    }
  };

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      <picture className="block w-full h-full">
        {!hasError && sm && <source media="(max-width: 640px)" srcSet={sm} type={getType(sm)} />}
        {!hasError && md && <source media="(max-width: 1024px)" srcSet={md} type={getType(md)} />}
        {!hasError && lg && <source srcSet={lg} type={getType(lg)} />}
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover ${imgClassName}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={handleError}
        />
      </picture>
    </div>
  );
}

