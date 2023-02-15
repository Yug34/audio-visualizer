import * as Styles from "../App.Styles";
import { Flex } from "../../Common/Flex";
import React, { ChangeEvent } from "react";
import { GainStateType } from "../App.types";

interface GainControlsProps {
    gainState:  Record<string, GainStateType>;
    handleGainValueChange: (e: ChangeEvent<HTMLInputElement>, nodeName: string) => void;
}

const GainControls = ({
    gainState,
    handleGainValueChange
}: GainControlsProps): JSX.Element => {
    return (
        <>
            {Object.entries(gainState).map(([gainNodeName, gainNode]) => (
                <Flex key={gainNodeName} flexDirection={'column'}>
                    {gainNode.gainChannel} Channel Gain: {gainNode.gain}
                    <Styles.StyledSlider
                        type="range"
                        step="0.01"
                        min="0"
                        max={1}
                        defaultValue={gainNode.gain}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleGainValueChange(e, gainNodeName)}
                    />
                </Flex>
            ))}
        </>
    );
};

export default GainControls;