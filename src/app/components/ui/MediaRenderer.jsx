import React from 'react';
import { getImageUrl } from '../../utils/image';

export function MediaRenderer({ src, alt, className, style, ...props }) {
  const url = getImageUrl(src);
  if (!url) return <div className={`bg-[#f5f4f2] ${className}`} style={style} />;

  const isVideo = typeof url === 'string' && (url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || src?.includes('video'));

  if (isVideo) {
    return (
      <video
        src={url}
        className={className}
        style={{ ...style, objectFit: 'cover' }}
        muted
        autoPlay
        loop
        playsInline
        {...props}
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt || "Ameya New York"}
      className={className}
      style={style}
      loading="lazy"
      {...props}
    />
  );
}
