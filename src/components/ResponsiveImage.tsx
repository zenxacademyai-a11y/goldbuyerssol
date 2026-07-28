import React, { useState } from "react";

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

  const hasWebp =
    (srcSm && srcSm.endsWith(".webp")) ||
    (srcMd && srcMd.endsWith(".webp")) ||
    (srcLg && srcLg.endsWith(".webp"));

  const handleError = () => {
    // If image fails to load, try fallback in /images/ folder or gallery-1.jpg
    if (imgSrc.startsWith("/img-") && !imgSrc.includes("/images/")) {
      setImgSrc(`/images/${imgSrc.replace("/", "")}`);
    } else {
      setImgSrc("/images/gallery-1.jpg");
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {hasWebp ? (
        <picture>
          {srcSm && srcSm.endsWith(".webp") && (
            <source media="(max-width: 640px)" srcSet={srcSm} type="image/webp" />
          )}
          {srcMd && srcMd.endsWith(".webp") && (
            <source media="(max-width: 1024px)" srcSet={srcMd} type="image/webp" />
          )}
          {srcLg && srcLg.endsWith(".webp") && (
            <source srcSet={srcLg} type="image/webp" />
          )}
          <img
            src={imgSrc}
            alt={alt}
            className={`w-full h-full object-cover ${imgClassName}`}
            loading={priority ? "eager" : "lazy"}
            onError={handleError}
          />
        </picture>
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover ${imgClassName}`}
          loading={priority ? "eager" : "lazy"}
          onError={handleError}
        />
      )}
    </div>
  );
}

