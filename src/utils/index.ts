import { useState, useEffect } from "react";

export const px2vw = (size: number, width: number = 1920): string => `${(size / width) * 100}vw`;
export const px2vh = (size: number, height: number = 1080): string => `${(size / height) * 100}vh`;

export const resizeCanvasToViewport = (canvas: HTMLCanvasElement): void => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
};

export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
}

export default useMediaQuery;