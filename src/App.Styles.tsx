import styled from "styled-components";
import { Flex } from "./Components/Flex";
import { px2vw } from "./utils";

export const StyledButton = styled(Flex)`
    white-space: pre;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    column-gap: 0.5rem;
    padding: 0.5rem 1rem;
    width: fit-content;
    min-width: clamp(220px, ${px2vw(260)}, 260px);
    border-radius: 1rem;
    border: 2px solid white;
    background: #000000;

    color: #ffffff;
    font-size: clamp(13px, ${px2vw(14)}, 14px);
    font-weight: 600;
    cursor: pointer;

    svg {
        width: clamp(14px, ${px2vw(16)}, 16px);
        height: clamp(14px, ${px2vw(16)}, 16px);
    }
    
    &:hover {
        background: #ffffff;
        color: #000000;
    }
    
    &:active {
        background: #f1f1f1;
    }
`;

export const InputContainer = styled(Flex)`
    width: 80vw;
    row-gap: 1rem;
    box-sizing: border-box;
    padding: 2rem 0;
    flex-direction: column;
    position: absolute;
    height: 100%;
    justify-content: flex-end;
`;

export const StyledSlider = styled.input`
    appearance: none;
    background: #000000;
    opacity: 0.5;
    outline: none;
    border: 2px solid #ffffff;
    border-radius: 12px;
    
    &:hover {
        opacity: 1;
    }
    
    &::-webkit-slider-thumb {
        border-radius: 50%;
        appearance: none;
        width: 1rem;
        height: 1rem;
        background: #ffffff;
        cursor: pointer;
    }
`;

export const Layout = styled(Flex)`
    color: #ffffff;
    background: #000000;
    flex-direction: column;
    display: flex;
    position: relative;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    row-gap: 2rem;
`;

type SVGIconProps = {
  height?: string;
  width?: string;
}

export const SoundWave = ({height, width}: SVGIconProps): JSX.Element => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={`${height || "1em"}`} width={`${width || "1em"}`} xmlns="http://www.w3.org/2000/svg">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M21 12h-2c-.894 0 -1.662 -.857 -1.761 -2c-.296 -3.45 -.749 -6 -2.749 -6s-2.5 3.582 -2.5 8s-.5 8 -2.5 8s-2.452 -2.547 -2.749 -6c-.1 -1.147 -.867 -2 -1.763 -2h-2"/>
    </svg>
)

export const AudioFile = ({height, width}: SVGIconProps): JSX.Element => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height={`${height || "1em"}`} width={`${width || "1em"}`} xmlns="http://www.w3.org/2000/svg">
      <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm-64 268c0 10.7-12.9 16-20.5 8.5L104 376H76c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h28l35.5-36.5c7.6-7.6 20.5-2.2 20.5 8.5v136zm33.2-47.6c9.1-9.3 9.1-24.1 0-33.4-22.1-22.8 12.2-56.2 34.4-33.5 27.2 27.9 27.2 72.4 0 100.4-21.8 22.3-56.9-10.4-34.4-33.5zm86-117.1c54.4 55.9 54.4 144.8 0 200.8-21.8 22.4-57-10.3-34.4-33.5 36.2-37.2 36.3-96.5 0-133.8-22.1-22.8 12.3-56.3 34.4-33.5zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"/>
    </svg>
);

export const Microphone = ({height, width}: SVGIconProps): JSX.Element => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height={`${height || "1em"}`} width={`${width || "1em"}`} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 12V6c0-2.217-1.785-4.021-3.979-4.021a.933.933 0 0 0-.209.025A4.006 4.006 0 0 0 8 6v6c0 2.206 1.794 4 4 4s4-1.794 4-4zm-6 0V6c0-1.103.897-2 2-2a.89.89 0 0 0 .163-.015C13.188 4.06 14 4.935 14 6v6c0 1.103-.897 2-2 2s-2-.897-2-2z"/>
      <path d="M6 12H4c0 4.072 3.061 7.436 7 7.931V22h2v-2.069c3.939-.495 7-3.858 7-7.931h-2c0 3.309-2.691 6-6 6s-6-2.691-6-6z"/>
    </svg>
);