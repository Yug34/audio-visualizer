import * as Styles from "../App.Styles";
import * as Types from "../App.types";
import React, {useRef} from "react";

type VisualizationSelectionProps = {
    setSelectedVisualization(props: Types.VisualizationData): void;
}
const VisualizationSelection = ({setSelectedVisualization}: VisualizationSelectionProps): JSX.Element => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
        <>
            <input
                id="uploadAudio"
                style={{display: "none"}}
                ref={fileInputRef}
                onChange={() => {
                    setSelectedVisualization({type: "file", payload: fileInputRef!.current!.files![0].arrayBuffer()});
                }}
                type="file"
                accept="audio/*"
            />
            <label htmlFor="uploadAudio">
                <Styles.StyledButton>
                    Upload a file
                    <Styles.AudioFile/>
                </Styles.StyledButton>
            </label>
            <Styles.StyledButton onClick={() => setSelectedVisualization({type: "microphone"})}>
                Use Microphone
                <Styles.Microphone/>
            </Styles.StyledButton>
            <Styles.StyledButton onClick={() => setSelectedVisualization({type: "oscillator"})}>
                Synthesize sound with Oscillator
                <Styles.SoundWave/>
            </Styles.StyledButton>
        </>
    );
};

export default VisualizationSelection;