import React, {ChangeEvent} from "react";
import * as Styles from "../App.Styles";
import * as Types from "../App.types";
import GainControls from "../GainControls";
import OscillatorControls from "../OscillatorControls";

type VisualizationProps = {
    gainState: Record<string, Types.GainStateType>;
    handleGainValueChange: (e: ChangeEvent<HTMLInputElement>, nodeName: string) => void;
    oscillatorsState: Record<string, Types.OscillatorStateType>;
    handleOscillatorFrequencyChange: (e: ChangeEvent<HTMLInputElement>, nodeName: string) => void;
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    selectedVisualizationType: Types.VisualizationType;
}
const Visualization = ({
    gainState,
    handleGainValueChange,
    oscillatorsState,
    handleOscillatorFrequencyChange,
    canvasRef,
    selectedVisualizationType
}: VisualizationProps): JSX.Element => {
    return (
        <>
            <canvas style={{position: 'absolute'}} ref={canvasRef} width="1" height="1"/>
            <Styles.InputContainer>
                <GainControls
                    gainState={gainState}
                    handleGainValueChange={handleGainValueChange}
                />
                {selectedVisualizationType === "oscillator" && (
                    <OscillatorControls
                        oscillatorsState={oscillatorsState}
                        handleOscillatorFrequencyChange={handleOscillatorFrequencyChange}
                    />
                )}
            </Styles.InputContainer>
        </>
    )
};

export default Visualization;