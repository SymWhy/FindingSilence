// JavaScript source code

// Create an AudioContext
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext(); //default sample rate 48000
const offlineContext = new OfflineAudioContext();

//identify each HTML element you want to use
const audioElement = document.querySelector('audio');
const playBtn = document.querySelector('button');
const detailBar = document.querySelector('range');

const analyzer = audioContext.createAnalyser();
analyzer.fftSize = 2048;

const audioSource = audioContext.createMediaElementSource(audioElement);
const offlineSource = offlineContext.createBufferSource(audioElement);

let isPlaying = false;
let detail = 0;

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
let myTime = 0;
let startTime = 0;
let isSilence = false;

function looper() {
    if (isPlaying){
        //requestAnimationFrame(looper); //60x a second
        setTimeout(looper, 10);
        analyzer.getByteFrequencyData(data);
        let mySum = data.reduce((a,b) => a + b);
        if (mySum < 6) {
            if (!isSilence) {
                startTime = myTime;
            }
            isSilence = true;
        }
        else {
            if (isSilence) {
                console.log(startTime, myTime - startTime);
            }
            isSilence = false;
        }
        // let mySlice = [];
        // data.forEach((val, i) => {
        //     mySlice.push(val);
        //     if (i % 1024 === 0) { //change to 6
        //         let mySum = mySlice.reduce((a,b) => a + b);
        //         dataSet.push([mySum, myTime]);
        //         mySlice = []; //empty mySlice for reuse
        //         //myTime = audioElement.currentTime;
        //         //console.log(myTime);
        //     }
        // });
        myTime ++;
    }

}

let silenceSet = [];
let soundSet = [];

function findSilence() {
    //look for chunks of 0s in dataSet
    let silence = false;
    let prevSum = 0;
    let prevTime = -1;
    let myTime = 0;
    //if myTime - 1 === prevTime, add 
    dataSet.forEach((val, i) => {
        let mySum = val[0];
        //let myTime = val[1];
        //console.log(mySum, ', ', myTime); //debug
        if (mySum < 1) {
            silence = true;
            silenceSet.push(i);
            //console.log(myTime); //debug
        }
        //if prev == 0, current time is start time
        //if prev > 0, prev time is stop time
        //return array of [start time, stop time]
    });
    console.log(silenceSet); //debug
    silenceSet.forEach((val, i) => {
        myTime = val[i];
        //if there's a jump...
        if (myTime - prevTime > 1) {
            soundSet.push[prevTime, myTime];
            console.log(prevTime); //debug
        }
        prevTime = myTime;
    }
    );
    console.log(soundSet); //debug
}

audioElement.onplay = () => {
    audioContext.resume();
    isPlaying = true;
    dataSet = [];
    looper();
}

audioElement.onended = () => {
    isPlaying = false;
    myTime = 0;
}