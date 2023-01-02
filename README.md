# Audio Visualizer

*Deployed at: https://yug34.github.io/audio-visualizer/*

Works based on the Web Audio API.

### The visualizer has 3 modes of operation/input.
1. Sound generated through JS (Oscillator).
2. Sound from user's microphone.
3. Sound from an audio file that a user can upload.

### The visualizer has 3 visualizations/outputs:
1. The frequency-domain plot of the audio.
2. The time-domain plot of the audio.
3. An "audio-level", which is the average loudness of all the frequencies in the sample.

### File and microphone input:
The audio input received form the microphone/file is split with a SplitterNode and 
connected to two gain nodes, one for the left and right channel each.

### Oscillator input
In the case you are using oscillators to generate sound, there are two oscillators;
one each for the left and right channels, connected to two gain nodes.

### Output
The audio source nodes (audio from microphone/file/oscillators) are connected to two
AnalyserNodes to collect audio data for each audio channel. Finally, these nodes are 
merged with a MergerNode which is connected to the audio context's destination (your speakers).

### Controls
The web app allows you to control the sound by changing the gain of each 
output channel, and in the case of an oscillator, control the gain as well as the
frequencies of the oscillators of each audio channel independently.

#### What would I do differently if I were to remake this?
Got a bit carried away with this project and kept adding unplanned features, so I didn't
focus much on code organization (the main App.tsx component is way too big).