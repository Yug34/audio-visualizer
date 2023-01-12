import * as Styles from "../../App.Styles";
import {Flex} from "../Common/Flex";
import React, {ChangeEvent} from "react";

interface ControlsProps {
    rightGain: number;
    leftGain: number;
    handleRightGainChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleLeftGainChange: (e: ChangeEvent<HTMLInputElement>) => void;
    oscillatorStarted: boolean;
    rightOscillatorFrequency: number;
    handleRightOscillatorFreqChange: (e: ChangeEvent<HTMLInputElement>) => void;
    leftOscillatorFrequency: number;
    handleLeftOscillatorFreqChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Controls = ({
    rightGain,
    leftGain,
    handleRightGainChange,
    handleLeftGainChange,
    oscillatorStarted,
    rightOscillatorFrequency,
    handleRightOscillatorFreqChange,
    leftOscillatorFrequency,
    handleLeftOscillatorFreqChange
}: ControlsProps): JSX.Element => {
    return (
        <Styles.InputContainer>
            <Flex flexDirection={'column'}>
                R Channel Gain: {rightGain}
                <Styles.StyledSlider
                    type="range"
                    step="0.01"
                    min="0"
                    max={1}
                    defaultValue={1}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleRightGainChange(e)}
                />
            </Flex>
            <Flex flexDirection={'column'}>
                L Channel Gain: {leftGain}
                <Styles.StyledSlider
                    type="range"
                    step="0.01"
                    min="0"
                    max={1}
                    defaultValue={1}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleLeftGainChange(e)}
                />
            </Flex>
            {oscillatorStarted && (
                <>
                    <Flex flexDirection={'column'}>
                        Right Oscillator Frequency {rightOscillatorFrequency}
                        <Styles.StyledSlider
                            type="range"
                            step={100}
                            min={200}
                            max={22000}
                            defaultValue={rightOscillatorFrequency}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleRightOscillatorFreqChange(e)}
                        />
                    </Flex>
                    <Flex flexDirection={'column'}>
                        Left Oscillator Frequency {leftOscillatorFrequency}
                        <Styles.StyledSlider
                            type="range"
                            step={100}
                            min={200}
                            max={22000}
                            defaultValue={leftOscillatorFrequency}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleLeftOscillatorFreqChange(e)}
                        />
                    </Flex>
                </>
            )}
        </Styles.InputContainer>
    );
};

export default Controls;