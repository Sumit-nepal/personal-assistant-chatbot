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
    transcript = transcript.toLowerCase();
    console.log(`my commands : ${transcript}`);

    if(transcript.includes("hi")){
        readOut("hello sir");
    }
    if(transcript.includes("open youtube")) {
        readOut("opening youtube sir");
        window.open("https://www.youtube.com/");
    }
    if(transcript.includes("open youtube")) {
        readOut("opening google sir");
        window.open("https://www.google.com/");
    }

    // google search
    if(transcript.includes("search for")){
        let input = transcript.split("");
        input.splice(0,11); //remove the search for text
        input=input.join("")
        readOut(`searching ${input} sir`);
        input = input.split(" ").join("+");
        window.open(`https://www.google.com/search?q=${input}`);
    }

    // youtube serach
    if(transcript.includes("play")){
        let input = transcript.split("");
        input.splice(0,5); //remove the search for text
        input=input.join("")
        readOut(`playing ${input} sir`);
        input = input.split(" ").join("+");
        window.open(`https://www.youtube.com/search?q=${input}`);
    }

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
