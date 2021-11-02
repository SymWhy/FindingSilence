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
let dataArray = [];

function looper() {
    if (isPlaying){
        requestAnimationFrame(looper);
        analyzer.getByteFrequencyData(data);
        data.forEach((val, i) => {
            dataArray.push(val);
        });
    }
}

function findSilence() {
    //create an empty array to hold averages
    let avgs = [];
    //create a series of arrays size 1024
    dataArray.forEach((val, i) => {
        let prev = 0; //previous slice end
        //dynamicVariableName = array + n
        if (i % 1024 === 0) {
            let mySlice = dataArray.slice(prev, i);
            //find the average across given slice
            let myAvg = 0; //placeholder
            avgs.push(myAvg); //pushing as arrays for some reason
            prev = i;
        }
    });
    console.log(avgs);
}

audioElement.onplay = () => {
    audioCtx.resume();
    isPlaying = true;
    looper();
}

audioElement.onended = () => {
    isPlaying = false;
}