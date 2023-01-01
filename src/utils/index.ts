export const px2vw = (size: number, width: number = 1920): string => `${(size / width) * 100}vw`;
export const px2vh = (size: number, height: number = 1080): string => `${(size / height) * 100}vh`;

export const resizeCanvasToViewport = (canvas: HTMLCanvasElement): void => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    window.addEventListener('resize', () => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    });
};