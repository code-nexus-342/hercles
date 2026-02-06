"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = Omit<ImageProps, "src"> & {
    src?: ImageProps["src"] | null;
    fallbackSrc?: ImageProps["src"];
};

export function SafeImage({
    src,
    fallbackSrc = "/placeholder.svg",
    alt,
    onError,
    ...props
}: SafeImageProps) {
    const [failed, setFailed] = useState(false);

    const effectiveSrc = !src || failed ? fallbackSrc : src;

    return (
        <Image
            {...props}
            src={effectiveSrc}
            alt={alt}
            onError={(event) => {
                setFailed(true);
                onError?.(event);
            }}
        />
    );
}
