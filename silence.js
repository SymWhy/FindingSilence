// JavaScript source code

// Create an AudioContext
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

//identify each HTML element you want to use
const audioElement = document.querySelector('audio');
const playBtn = document.querySelector('button');
const volSlider = document.querySelector('.volume');

const analyzer = audioCtx.createAnalyser();
analyzer.fftSize = 2048;

const audioSource = audioCtx.createMediaElementSource(audioElement);

let isPlaying = false;

//if the button is clicked, pause or play
playBtn.addEventListener('click', function() {
    //if the audio is paused, play it
    if (this.getAttribute('class') === 'paused') {
        audioElement.play();
        this.setAttribute('class', 'playing');
        this.textContent = 'Pause';
    }
    //if the audio is playing, pause it
    else if (this.getAttribute('class') === 'playing') {
        audioElement.pause();
        this.setAttribute('class', 'paused');
        this.textContent = 'Play';
    }
});

//reset audio to beginning
audioElement.addEventListener('ended', function() {
    playBtn.setAttribute('class', 'paused');
    playBtn.textContent = 'Play';
});

//gain node (volume)
const gainNode = audioCtx.createGain();

//listen for slider value change
volSlider.addEventListener('input', function() {
    gainNode.gain.value = this.value;
});

audioSource.connect(gainNode).connect(audioCtx.destination);
audioSource.connect(analyzer);

let data = new Uint8Array(analyzer.frequencyBinCount);
let avgs = [];

function looper() {
    if (isPlaying){
        requestAnimationFrame(looper);
        analyzer.getByteFrequencyData(data);
        let mySlice = [];
        let myTime = 0;
        data.forEach((val, i) => {
            mySlice.push(val);
            if (i % 1024 === 0) {
                let mySum = mySlice.reduce((a,b) => a + b);
                let myAvg = mySum / 1024;
                avgs.push([myAvg, myTime]);
                mySlice = []; //empty mySlice for reuse
                myTime = 0; //placeholder
            }
        });
    }
}

audioElement.onplay = () => {
    audioCtx.resume();
    isPlaying = true;
    looper();
}

audioElement.onended = () => {
    isPlaying = false;
}