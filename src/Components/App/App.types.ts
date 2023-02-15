export type VisualizationType = "oscillator" | "file" | "microphone";
export type OutputChannelTypes = "Left" | "Right";

export type CreateNewGainProps = {
    audioCtx: AudioContext;
    gainNodeName: string;
    gainChannel: OutputChannelTypes;
    gain?: number;
}

export type CreateNewOscillatorProps = {
    audioCtx: AudioContext;
    oscillatorName: string;
    oscillatorChannel: OutputChannelTypes;
    frequency?: number;
}

export type CreateNewAnalyserProps = {
    audioCtx: AudioContext;
    fftSize?: number;
}

export type OscillatorStateType = {
    node: OscillatorNode;
    frequency: number;
    oscillatorChannel: OutputChannelTypes;
}

export type GainStateType = {
    node: GainNode;
    gain: number;
    gainChannel: OutputChannelTypes;
}

export type VisualizationData = {
    type: VisualizationType;
    payload?: Promise<ArrayBuffer>;
}