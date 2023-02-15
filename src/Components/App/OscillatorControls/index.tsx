import * as Styles from "../App.Styles";
import { Flex } from "../../Common/Flex";
import React, { ChangeEvent } from "react";
import { OscillatorStateType } from "../App.types";

interface OscillatorControlProps {
    oscillatorsState: Record<string, OscillatorStateType>;
    handleOscillatorFrequencyChange: (e: ChangeEvent<HTMLInputElement>, nodeName: string) => void;
}

const OscillatorControls = ({
    oscillatorsState,
    handleOscillatorFrequencyChange
}: OscillatorControlProps): JSX.Element => {
    return (
        <>
            {Object.entries(oscillatorsState).map(([oscillatorName, oscillator]) => (
                <Flex key={oscillatorName} flexDirection={'column'}>
                    {oscillator.oscillatorChannel} Oscillator Frequency {oscillator.frequency}
                    <Styles.StyledSlider
                        type="range"
                        step={100}
                        min={200}
                        max={22000}
                        defaultValue={oscillator.frequency} //It's always initialized to its default freq.
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleOscillatorFrequencyChange(e, oscillatorName)}
                    />
                </Flex>
            ))}
        </>
    );
};

export default OscillatorControls;