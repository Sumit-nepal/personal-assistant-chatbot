const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const speakButton = document.querySelector("#speak");

// Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const Recognition = new SpeechRecognition();

// Speech Recognition start
Recognition.onstart = function() {
    console.log("vr active");
};

// Speech recognition result
Recognition.onresult = function(event) {
    let current = event.resultIndex;
    let transcript = event.results[current][0].transcript;
    readOut(transcript);
};

// Speech Recognition stop
Recognition.onend = function() {
    console.log("vr deactive");
};

// Speech recognition continuous
Recognition.continuous = true;

startButton.addEventListener("click", () => {
    Recognition.start();
});

stopButton.addEventListener("click", () => {
    Recognition.stop();
});

// Speech synthesis with fallback to default voice
function readOut(message) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;

    // Check if the Jarvis voice is available
    const voices = window.speechSynthesis.getVoices();
    const jarvisVoice = voices.find(voice => voice.name === 'Jarvis Voice');
  
    if (jarvisVoice) {
        speech.voice = jarvisVoice;
    }

    // Fallback to default voice if Jarvis voice is not available
    speech.onend = function() {
        if (!speech.voice && voices.length > 0) {
            speech.voice = voices[0];
        }
    };

    // Speak the message
    window.speechSynthesis.speak(speech);
    console.log("speaking out");
}

speakButton.addEventListener("click", () => {
    readOut("Jarvis Activated");
});
