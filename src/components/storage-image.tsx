import { getStorageUrl } from '@/lib/api';
import { cn } from '@/lib/utils';

type StorageImageProps = {
  path?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

/** Loads Laravel public/storage files without Next.js image optimizer (avoids localhost allowlist issues) */
export function StorageImage({ path, alt, className, fill, width, height }: StorageImageProps) {
  const src = getStorageUrl(path);

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn('absolute inset-0 h-full w-full object-cover', className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
