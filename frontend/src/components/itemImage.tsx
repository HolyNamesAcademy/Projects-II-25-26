"use client";

import Image from "next/image";

const FALLBACK_CARD = "/images/Tops.png";
const FALLBACK_DETAIL = "/images/white-sweater.jpg";

export type ItemImageVariant = "card" | "detail";

function defaultFallback(variant: ItemImageVariant): string {
  return variant === "detail" ? FALLBACK_DETAIL : FALLBACK_CARD;
}

/**
 * Resolves API/local image values to a usable `next/image` src.
 * Accepts absolute app paths, http(s) URLs, and blob URLs; anything else uses the fallback.
 */
export function resolveItemImageSrc(
  image: string | null | undefined,
  fallback: string
): string {
  if (image == null || !String(image).trim()) return fallback;
  const s = String(image).trim();
  if (s.startsWith("/")) return s;
  if (s.startsWith("blob:")) return s;
  if (/^https?:\/\//i.test(s)) return s;
  return fallback;
}

function needsUnoptimized(src: string): boolean {
  return /^https?:\/\//i.test(src) || src.startsWith("blob:");
}

export type ItemImageProps = {
  image?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  variant?: ItemImageVariant;
  /** Overrides the default placeholder for this variant */
  fallbackSrc?: string;
  priority?: boolean;
};

export default function ItemImage({
  image,
  alt,
  width,
  height,
  className,
  variant = "card",
  fallbackSrc,
  priority,
}: ItemImageProps) {
  const fallback = fallbackSrc ?? defaultFallback(variant);
  const src = resolveItemImageSrc(image, fallback);

  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={needsUnoptimized(src)}
      priority={priority}
    />
  );
}
