import React, { useState, useEffect } from "react";

interface ResponsiveImageProps {
  srcSm: string;
  srcMd: string;
  srcLg: string;
  srcFallback: string;
  blurPlaceholder: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean; // Set to true to disable lazy loading for above-the-fold images
}

export default function ResponsiveImage({
  srcSm,
  srcMd,
  srcLg,
  srcFallback,
  blurPlaceholder,
  alt,
  className = "",
  imgClassName = "",
  priority = false
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);

  useEffect(() => {
    if (priority) return;

    // Use IntersectionObserver to lazy-load the image source only when close to viewport
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: "200px" } // Load 200px before appearing on screen
      );

      // We need a ref or target element
      const element = document.getElementById(`img-wrapper-${alt.replace(/\s+/g, "-").toLowerCase()}`);
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    } else {
      // Fallback for browsers without IntersectionObserver
      setShouldLoad(true);
    }
  }, [priority, alt]);

  const wrapperId = `img-wrapper-${alt.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div
      id={wrapperId}
      className={`relative overflow-hidden bg-neutral-900 ${className}`}
    >
      {/* 1. Low-Resolution Blur-Up Placeholder */}
      <img
        src={blurPlaceholder}
        alt=""
        aria-hidden="true"
        className={`w-full h-full object-cover filter blur-lg scale-110 pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
        referrerPolicy="no-referrer"
      />

      {/* 2. Responsive Responsive WebP/Fallback Image */}
      {shouldLoad && (
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
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-750 ease-out ${
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-102"
            } ${imgClassName}`}
            loading={priority ? "eager" : "lazy"}
            referrerPolicy="no-referrer"
          />
        </picture>
      )}
    </div>
  );
}
