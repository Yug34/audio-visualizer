import React, {ChangeEvent, useCallback, useRef, useState} from 'react';
import * as Styles from "./App.Styles";
import {Flex} from "./Components/Flex";
import {resizeCanvasToViewport} from "./utils";

const drawCanvas = (
    canvasCtx: CanvasRenderingContext2D | null,
    bufferLength: number,
    dataArrayLeft: Uint8Array,
    dataArrayRight: Uint8Array,
    HEIGHT: number,
    WIDTH: number,
    fftSize: number = 32,
    padding: number = 20,
    gapBetweenBars: number = 3
): void => {
    const barWidth: number = (WIDTH - (fftSize * (gapBetweenBars / 2)) - padding) / bufferLength;
    let barHeightLeft: number;
    let barHeightRight: number;
    let x: number = padding / 2;

    for (let i = 0; i < bufferLength; i++) {
        barHeightLeft = dataArrayLeft[i];
        barHeightRight = dataArrayRight[i];

        canvasCtx!.fillStyle = `rgb(50, ${(barHeightRight + 100)}, 50)`;
        canvasCtx!.fillRect(
            x,
            (HEIGHT - barHeightRight) / 2,
            barWidth,
            barHeightRight / 2
        );

        canvasCtx!.fillStyle = `rgb(50, 50, ${(barHeightLeft + 100)})`;
        canvasCtx!.fillRect(
            x,
            HEIGHT / 2,
            barWidth,
            barHeightLeft / 2
        );

        x += (barWidth + gapBetweenBars);
    }
};

const App = () => {
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);
    const [leftGain, setLeftGain] = useState<number>(1);
    const [rightGain, setRightGain] = useState<number>(1);
    const [oscillatorStarted, setOscillatorStarted] = useState<boolean>(false);
    const [leftOscillatorFrequency, setLeftOscillatorFrequency] = useState<number>(19000);
    const [rightOscillatorFrequency, setRightOscillatorFrequency] = useState<number>(19000);

    const [leftOscillator, setLeftOscillator] = useState<OscillatorNode | null>(null);
    const [rightOscillator, setRightOscillator] = useState<OscillatorNode | null>(null);
    const [leftGainNode, setLeftGainNode] = useState<GainNode | null>(null);
    const [rightGainNode, setRightGainNode] = useState<GainNode | null>(null);

    const handleLeftOscillatorFreqChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const frequency = Number(e.target.value);
        setLeftOscillatorFrequency(frequency);
        leftOscillator?.frequency.setValueAtTime(frequency, 0);
    }, [leftOscillator]);

    const handleRightOscillatorFreqChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const frequency = Number(e.target.value);
        setRightOscillatorFrequency(frequency);
        rightOscillator?.frequency.setValueAtTime(frequency, 0);
    }, [rightOscillator]);

    const handleLeftGainChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const gain = Number(e.target.value);
        setLeftGain(gain);
        leftGainNode?.gain.setValueAtTime(gain, 0);
    }, [leftGainNode]);

    const handleRightGainChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const gain = Number(e.target.value);
        setRightGain(gain);
        rightGainNode?.gain.setValueAtTime(gain, 0);
    }, [rightGainNode]);

    const visualizeAudio = useCallback((canvas: HTMLCanvasElement, visualizationType: "oscillator" | "microphone" | "file") => {
        setIsStarted(true);

        const audioCtx: AudioContext = new AudioContext();

        const fftSize: number = 32;
        const analyserRight: AnalyserNode = audioCtx.createAnalyser();
        analyserRight.fftSize = fftSize;
        const analyserLeft: AnalyserNode = audioCtx.createAnalyser();
        analyserLeft.fftSize = fftSize;
        const splitter: ChannelSplitterNode = audioCtx.createChannelSplitter(2);
        const merger: ChannelMergerNode = audioCtx.createChannelMerger(2);

        const leftOscillator: OscillatorNode = audioCtx.createOscillator();
        leftOscillator.frequency.setValueAtTime(19000, audioCtx.currentTime);
        setLeftOscillator(leftOscillator);
        const rightOscillator: OscillatorNode = audioCtx.createOscillator();
        rightOscillator.frequency.setValueAtTime(19000, audioCtx.currentTime);
        setRightOscillator(rightOscillator);

        const leftGainNode: GainNode = audioCtx.createGain();
        leftGainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        setLeftGainNode(leftGainNode);
        const rightGainNode: GainNode = audioCtx.createGain();
        rightGainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        setRightGainNode(rightGainNode);

        resizeCanvasToViewport(canvas);

        const canvasCtx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        const WIDTH: number = canvas.width;
        const HEIGHT: number = canvas.height;

        leftGainNode.connect(analyserRight, 0);
        rightGainNode.connect(analyserLeft, 0);

        analyserRight.connect(merger, 0, 0);
        analyserLeft.connect(merger, 0, 1);

        merger.connect(audioCtx.destination);

        const bufferLength: number = analyserRight.frequencyBinCount;

        const dataArrayRight: Uint8Array = new Uint8Array(bufferLength);
        const dataArrayLeft: Uint8Array = new Uint8Array(bufferLength);

        switch (visualizationType) {
            case "oscillator":
                setOscillatorStarted(true);

                leftOscillator.connect(leftGainNode);
                rightOscillator.connect(rightGainNode);

                leftOscillator.start();
                rightOscillator.start();

                const visualizeOscillator = (): void => {
                    requestAnimationFrame(visualizeOscillator);

                    analyserRight.getByteFrequencyData(dataArrayRight);
                    analyserLeft.getByteFrequencyData(dataArrayLeft);

                    canvasCtx!.fillStyle = "rgb(0, 0, 0)";
                    canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

                    drawCanvas(canvasCtx, bufferLength, dataArrayRight, dataArrayLeft, HEIGHT, WIDTH);
                };

                visualizeOscillator();
                break;
            case "microphone":
                const constraints = {audio: true};
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then((stream: MediaStream) => {
                        const source = audioCtx.createMediaStreamSource(stream);

                        source.connect(splitter);

                        splitter.connect(leftGainNode, 0);
                        splitter.connect(rightGainNode, 1);

                        const visualizeMicrophone = () => {
                            requestAnimationFrame(visualizeMicrophone);

                            analyserRight.getByteFrequencyData(dataArrayRight);
                            analyserLeft.getByteFrequencyData(dataArrayLeft);

                            canvasCtx!.fillStyle = "rgb(0, 0, 0)";
                            canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

                            drawCanvas(canvasCtx, bufferLength, dataArrayRight, dataArrayLeft, HEIGHT, WIDTH);
                        };

                        visualizeMicrophone();
                    })
                    .catch(err => console.log(err));
                break;
            case "file":
                const file = inputRef!.current!.files![0];

                file.arrayBuffer().then((buffer) => {
                    audioCtx.decodeAudioData(buffer, (audio) => {
                            const audioSource = audioCtx.createBufferSource();
                            audioSource.buffer = audio;

                            audioSource.connect(splitter);

                            splitter.connect(leftGainNode, 0);
                            splitter.connect(rightGainNode, 1);

                            audioSource.start();

                            const visualizeFile = () => {
                                requestAnimationFrame(visualizeFile);

                                analyserRight.getByteFrequencyData(dataArrayRight);
                                analyserLeft.getByteFrequencyData(dataArrayLeft);

                                canvasCtx!.fillStyle = "rgb(0, 0, 0)";
                                canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

                                drawCanvas(canvasCtx, bufferLength, dataArrayRight, dataArrayLeft, HEIGHT, WIDTH);
                            };

                            visualizeFile();
                        },
                        error => console.log(error)
                    );
                })
                break;
        }
    }, []);

    return (
        <Styles.Layout>
            <canvas ref={canvasRef} width="1" height="1"/>
            {!isStarted ? (
                <>
                    <label htmlFor="uploadAudio">
                        <Styles.StyledButton>
                            Upload a file
                            <Styles.AudioFile/>
                        </Styles.StyledButton>
                    </label>
                    <input
                        id="uploadAudio"
                        style={{display: "none"}}
                        ref={inputRef}
                        onChange={() => visualizeAudio(canvasRef.current!, "file")}
                        type="file"
                        accept="audio/*"
                        multiple
                    />
                    <Styles.StyledButton onClick={() => visualizeAudio(canvasRef.current!, "microphone")}>
                        Use Microphone
                        <Styles.Microphone/>
                    </Styles.StyledButton>
                    <Styles.StyledButton onClick={() => visualizeAudio(canvasRef.current!, "oscillator")}>
                        Synthesize sound with Oscillator
                        <Styles.SoundWave/>
                    </Styles.StyledButton>
                </>
            ) : (
                <Styles.GainInputContainer>
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
                                    step="100"
                                    min="1000"
                                    max={22000}
                                    defaultValue={rightOscillatorFrequency}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleRightOscillatorFreqChange(e)}
                                />
                            </Flex>
                            <Flex flexDirection={'column'}>
                                Left Oscillator Frequency {leftOscillatorFrequency}
                                <Styles.StyledSlider
                                    type="range"
                                    step="100"
                                    min="200"
                                    max={22000}
                                    defaultValue={leftOscillatorFrequency}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleLeftOscillatorFreqChange(e)}
                                />
                            </Flex>
                        </>
                    )}
                </Styles.GainInputContainer>
            )}
        </Styles.Layout>
    );
}

export default App;