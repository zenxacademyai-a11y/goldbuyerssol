import React from "react";

interface ResponsiveImageProps {
  srcSm: string;
  srcMd: string;
  srcLg: string;
  srcFallback: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

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
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <picture>
        {/* Mobile Screens: up to 640px wide */}
        <source
          media="(max-width: 640px)"
          srcSet={srcSm}
          type="image/webp"
        />
        {/* Tablet Screens: up to 1024px wide */}
        <source
          media="(max-width: 1024px)"
          srcSet={srcMd}
          type="image/webp"
        />
        {/* Desktop/Large Screens */}
        <source
          srcSet={srcLg}
          type="image/webp"
        />
        {/* Fallback original JPG */}
        <img
          src={srcFallback}
          alt={alt}
          className={`w-full h-full object-cover ${imgClassName}`}
          loading={priority ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
        />
      </picture>
    </div>
  );
}
