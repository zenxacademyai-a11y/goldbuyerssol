import React from "react";

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
  if (url.endsWith(".webp")) return "image/webp";
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
  return undefined;
};

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
  const sm = srcSm || srcFallback;
  const md = srcMd || srcFallback;
  const lg = srcLg || srcFallback;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <picture>
        {sm && <source media="(max-width: 640px)" srcSet={sm} type={getType(sm)} />}
        {md && <source media="(max-width: 1024px)" srcSet={md} type={getType(md)} />}
        {lg && <source srcSet={lg} type={getType(lg)} />}
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
