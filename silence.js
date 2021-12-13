// JavaScript source code

// Create an AudioContext
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext(); //default sample rate 48000

//identify each HTML element you want to use
const audioElement = document.querySelector('audio');
const playBtn = document.getElementById('play-btn');
const muteBtn = document.getElementById('mute-btn');

const freqSlider = document.getElementById('freq-detail');
const timeSlider = document.getElementById('time-detail');

const analyzer = audioContext.createAnalyser();
analyzer.fftSize = 2048;

const audioSource = audioContext.createMediaElementSource(audioElement);


let isPlaying = false;
let detailFreq = 0;
let detailTime = 0;

freqSlider.addEventListener('input', function() {
    detailFreq = this.value;
});

timeSlider.addEventListener('input', function() {
    detailTime = this.value;
});

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

muteBtn.addEventListener('click', function() {
    if (this.getAttribute('class') === 'unmuted') {
        audioElement.volume = 0;
        this.setAttribute('class', 'muted');
        this.textContent = 'Unmute';
    }
    else if (this.getAttribute('class') === 'muted') {
        audioElement.volume = 1;
        this.setAttribute('class', 'unmuted');
        this.textContent = 'Mute';
    }
});

// detailBar.addEventListener('input', function() {
//     detail = this.value;
// });

//reset audio to beginning
audioElement.addEventListener('ended', function() {
    playBtn.setAttribute('class', 'paused');
    playBtn.textContent = 'Play';
});

audioSource.connect(audioContext.destination);
audioSource.connect(analyzer);

let data = new Uint8Array(analyzer.frequencyBinCount);
let dataSet = [];
let soundSet = [];
let startTime = 0;
let isSilence = true;
let t0 = 0;

function looper() {
    if (isPlaying){
        setTimeout(looper);
        analyzer.getByteFrequencyData(data);
        let mySum = data.reduce((a,b) => a + b); //sum all amplitudes in set data
        //if total amplitude is less than x
        if (mySum <= detailFreq) {
            //if previous chunk was not silence, mark section as ended
            if (!isSilence) {
                soundSet.push([startTime, Date.now() - t0]);
            }
            isSilence = true;
        }
        else {
            //if previous chunk was silence or the audio has ended, 
            //start a new sound section
            if (isSilence || audioElement.ended) {
                startTime = Date.now() - t0;
            }
            isSilence = false;
        }
    }

}

audioElement.onplay = () => {
    audioContext.resume();
    isPlaying = true;
    dataSet = [];
    t0 = Date.now();
    looper();
}

audioElement.onended = () => {
    isPlaying = false;
    myTime = 0;
}