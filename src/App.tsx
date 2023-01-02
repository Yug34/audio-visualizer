import React, {ChangeEvent, useCallback, useRef, useState} from 'react';
import * as Styles from "./App.Styles";
import {Flex} from "./Components/Flex";
import {resizeCanvasToViewport} from "./utils";

const App = () => {
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);
    const [leftGain, setLeftGain] = useState<number>(1);
    const [rightGain, setRightGain] = useState<number>(1);
    const [oscillatorStarted, setOscillatorStarted] = useState<boolean>(false);
    const [leftOscillatorFrequency, setLeftOscillatorFrequency] = useState<number>(19000);
    const [rightOscillatorFrequency, setRightOscillatorFrequency] = useState<number>(19000);

    const drawCanvas = (
        canvasCtx: CanvasRenderingContext2D | null,
        bufferLength: number,
        analyserRight: AnalyserNode,
        analyserLeft: AnalyserNode,
        HEIGHT: number,
        WIDTH: number,
        FFTSize: number,
        padding: number = 20,
        gapBetweenBars: number = 3
    ): void => {
        // Width of a single bar
        const barWidth: number = (WIDTH - (FFTSize * (gapBetweenBars / 2)) - padding) / bufferLength;
        let barHeightLeft: number;
        let barHeightRight: number;

        const drawFreqDomainPlot = () => {
            // padding on both (left and right) sides of the bar graph
            let x: number = padding / 2;

            const dataArrayRight: Uint8Array = new Uint8Array(bufferLength);
            const dataArrayLeft: Uint8Array = new Uint8Array(bufferLength);

            analyserRight.getByteFrequencyData(dataArrayRight);
            analyserLeft.getByteFrequencyData(dataArrayLeft);

            for (let i = 0; i < bufferLength; i++) {
                barHeightLeft = dataArrayLeft[i];
                barHeightRight = dataArrayRight[i];

                canvasCtx!.fillStyle = `rgb(255, 255, 255)`;
                canvasCtx!.fillText(
                    "Freq. domain plot",
                    (WIDTH / 2) - 50,
                    (HEIGHT / 4) - 50
                );

                // Green bars for the Right channel
                canvasCtx!.fillStyle = `rgb(50, ${(barHeightRight + 100)}, 50)`;
                canvasCtx!.fillRect(
                    x,
                    (HEIGHT - (barHeightRight / 2)) / 2 - 200,
                    barWidth,
                    barHeightRight / 4
                );

                // Blue bars for the Left channel
                canvasCtx!.fillStyle = `rgb(50, 50, ${(barHeightLeft + 100)})`;
                canvasCtx!.fillRect(
                    x,
                    HEIGHT / 2 - 200,
                    barWidth,
                    barHeightLeft / 4
                );

                canvasCtx!.fillStyle = `rgb(255, 255, 255)`;
                canvasCtx!.fillText(
                    `${barHeightLeft}`,
                    x + (barWidth / 2),
                    (HEIGHT + (barHeightLeft / 2)) / 2 - (200 - 20)
                );
                canvasCtx!.fillText(
                    `${barHeightRight}`,
                    x + (barWidth / 2),
                    (HEIGHT - (barHeightRight / 2)) / 2 - (200 + 20)
                );

                x += (barWidth + gapBetweenBars);
            }
        }

        const drawTimeDomainPlot = () => {
            // padding on both (left and right) sides of the bar graph
            let x: number = padding / 2;

            const dataArrayRight: Uint8Array = new Uint8Array(bufferLength);
            const dataArrayLeft: Uint8Array = new Uint8Array(bufferLength);

            analyserRight.getByteTimeDomainData(dataArrayRight);
            analyserLeft.getByteTimeDomainData(dataArrayLeft);

            for (let i = 0; i < bufferLength; i++) {
                barHeightLeft = dataArrayLeft[i];
                barHeightRight = dataArrayRight[i];

                canvasCtx!.fillStyle = `rgb(255, 255, 255)`;
                canvasCtx!.fillText(
                    "Time domain plot",
                    (WIDTH / 2) - 50,
                    (HEIGHT / 2) + 50
                );

                // Green bars for the Right channel
                canvasCtx!.fillStyle = `rgb(50, ${(barHeightRight + 100)}, 50)`;
                canvasCtx!.fillRect(
                    x,
                    (HEIGHT - (barHeightRight / 2)) / 2 + 150,
                    barWidth,
                    barHeightRight / 4
                );

                // Blue bars for the Left channel
                canvasCtx!.fillStyle = `rgb(50, 50, ${(barHeightLeft + 100)})`;
                canvasCtx!.fillRect(
                    x,
                    HEIGHT / 2 + 150,
                    barWidth,
                    barHeightLeft / 4
                );

                canvasCtx!.fillStyle = `rgb(255, 255, 255)`;
                canvasCtx!.fillText(
                    `${barHeightLeft}`,
                    x + (barWidth / 2),
                    (HEIGHT + (barHeightLeft / 2)) / 2 + (150 + 20)
                );
                canvasCtx!.fillText(
                    `${barHeightRight}`,
                    x + (barWidth / 2),
                    (HEIGHT - (barHeightRight / 2)) / 2 + (150 - 20)
                );

                x += (barWidth + gapBetweenBars);
            }
        };

        const drawAudioLevel = () => {
            const dataArrayRight: Uint8Array = new Uint8Array(bufferLength);
            const dataArrayLeft: Uint8Array = new Uint8Array(bufferLength);

            analyserRight.getByteFrequencyData(dataArrayRight);
            analyserLeft.getByteFrequencyData(dataArrayLeft);

            const leftAverage = dataArrayLeft.reduce((a,b) => (a+b)) / dataArrayLeft.length;
            const rightAverage = dataArrayRight.reduce((a,b) => (a+b)) / dataArrayRight.length;

            canvasCtx!.fillStyle = `rgb(255, 255, 255)`;
            canvasCtx!.fillText(
                "Audio Levels",
                (WIDTH / 2) - 40,
                (HEIGHT / 2) - 100
            );

            canvasCtx!.fillText(
                `${Math.round(rightAverage)}`,
                (WIDTH / 2) - 80,
                (HEIGHT / 2) - (rightAverage / 2) - 20
            );

            canvasCtx!.fillText(
                `${Math.round(leftAverage)}`,
                (WIDTH / 2),
                (HEIGHT / 2) - (leftAverage / 2) - 20
            );

            canvasCtx!.fillStyle = `rgb(255, 255, 255)`;
            canvasCtx!.fillRect(
                (WIDTH / 2) - barWidth - gapBetweenBars,
                (HEIGHT / 2),
                2 * barWidth + gapBetweenBars,
                3
            );

            canvasCtx!.fillStyle = `rgb(50, ${(rightAverage + 100)}, 50)`;
            canvasCtx!.fillRect(
                (WIDTH / 2) - (barWidth + gapBetweenBars),
                (HEIGHT / 2),
                barWidth,
                - rightAverage / 2
            );

            canvasCtx!.fillStyle = `rgb(50, 50, ${(leftAverage + 100)})`;
            canvasCtx!.fillRect(
                (WIDTH / 2),
                (HEIGHT / 2),
                barWidth,
                - leftAverage / 2
            );
        };

        drawFreqDomainPlot();
        drawTimeDomainPlot();
        drawAudioLevel();
    };

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
        canvasCtx!.font = "300 16px Arial";
        const WIDTH: number = canvas.width;
        const HEIGHT: number = canvas.height;

        leftGainNode.connect(analyserRight, 0);
        rightGainNode.connect(analyserLeft, 0);

        analyserRight.connect(merger, 0, 0);
        analyserLeft.connect(merger, 0, 1);

        merger.connect(audioCtx.destination);

        const bufferLength: number = analyserRight.frequencyBinCount;

        switch (visualizationType) {
            case "oscillator":
                setOscillatorStarted(true);

                leftOscillator.connect(leftGainNode);
                rightOscillator.connect(rightGainNode);

                leftOscillator.start();
                rightOscillator.start();

                const visualizeOscillator = (): void => {
                    requestAnimationFrame(visualizeOscillator);

                    canvasCtx!.fillStyle = "rgb(0, 0, 0)";
                    canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

                    drawCanvas(canvasCtx, bufferLength, analyserRight, analyserLeft, HEIGHT, WIDTH, fftSize);
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

                            canvasCtx!.fillStyle = "rgb(0, 0, 0)";
                            canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

                            drawCanvas(canvasCtx, bufferLength, analyserRight, analyserLeft, HEIGHT, WIDTH, fftSize);
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

                                canvasCtx!.fillStyle = "rgb(0, 0, 0)";
                                canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

                                drawCanvas(canvasCtx, bufferLength, analyserRight, analyserLeft, HEIGHT, WIDTH, fftSize);
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
                </Styles.GainInputContainer>
            )}
        </Styles.Layout>
    );
}

export default App;