// JavaScript source code

	// Create an AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    //identify each HTML element you want to use
    const audioElement = document.querySelector('audio');
    const playBtn = document.querySelector('button');
    const volSlider = document.querySelector('.volume');

    const audioSource = audioCtx.createMediaElementSource(audioElement);

    //if the button is clicked, pause or play
    playBtn.addEventListener('click', function() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
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