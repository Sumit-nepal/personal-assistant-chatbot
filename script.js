const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const speakButton = document.querySelector("#speak");

// weather setup
function weather(location) {
    const weatherCont = document.querySelector(".temp").querySelectorAll("*");
    const apiKey = "48ddfe8c9cf29f95b7d0e54d6e171008";
  
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (this.status === 200) {
        let data = JSON.parse(this.responseText);
        weatherCont[0].textContent = `Location: ${data.name}`;
        weatherCont[1].textContent = `Country: ${data.sys.country}`;
        weatherCont[2].textContent = `Weather Type: ${data.weather[0].main}`;
        weatherCont[3].textContent = `Weather Description: ${data.weather[0].description}`;
        weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        weatherCont[5].textContent = `Original Temperature: ${ktc(data.main.temp)}`;
        weatherCont[6].textContent = `Feels Like: ${ktc(data.main.feels_like)}`;
        weatherCont[7].textContent = `Min Temperature: ${ktc(data.main.temp_min)}`;
        weatherCont[8].textContent = `Max Temperature: ${ktc(data.main.temp_max)}`;
        weatherStatement = `Sir, the weather in ${data.name} is ${data.weather[0].description}, and the temperature feels like ${ktc(data.main.feels_like)}`;
      } else {
        weatherCont[0].textContent = "Weather Info Not Found";
      }
    };
    xhr.send();
  }
  
  // Convert Kelvin to Celsius
  function ktc(k) {
    k = k - 273.15;
    return k.toFixed(2);
  }
  
// jarvis setup
if (localStorage.getItem("jarvis_setup") !== null) {
    weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
  }
  
  // jarvis information setup
  
  const setup = document.querySelector(".jarvis_setup");
  setup.style.display = "none";
  if (localStorage.getItem("jarvis_setup") === null) {
    setup.style.display = "block";
    setup.querySelector("button").addEventListener("click", userInfo);
  }
  
  function userInfo() {
    let setupInfo = {
      name: setup.querySelectorAll("input")[0].value,
      bio: setup.querySelectorAll("input")[1].value,
      location: setup.querySelectorAll("input")[2].value,
      instagram: setup.querySelectorAll("input")[3].value,
      github: setup.querySelectorAll("input")[4].value,
    };
  
    let testArr = [];
  
    setup.querySelectorAll("input").forEach((e) => {
      testArr.push(e.value);
    });
  
    if (testArr.includes("")) {
      readOut("sir enter your complete information");
    } else {
      localStorage.clear();
      localStorage.setItem("jarvis_setup", JSON.stringify(setupInfo));
      setup.style.display = "none";
      weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
    }
  }

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
    let userdata = localStorage.getItem("jarvis_setup")
    console.log(`my commands : ${transcript}`);

    if(transcript.includes("hi")){
        readOut("hello sir");
    }
    if(transcript.includes("open youtube")) {
        readOut("opening youtube sir");
        window.open("https://www.youtube.com/");
    }
    if(transcript.includes("open google")) {
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

    // open github
    if(transcript.includes("open github")) {
        readOut("opening Github")
        window.open("https://www.github.com/")
    }

    if(transcript.includes("open my github")) {
        readOut("opening your Github")
        window.open(`https://www.github.com/${JSON.parse(userdata).github}`)
    }

    // open github
    if(transcript.includes("open instagram")) {
    readOut("opening Instagram")
        window.open("https://www.instagram.com/")
    }
    
    if(transcript.includes("open my instagram")) {
        readOut("opening your Instagram")
        window.open(`https://www.instagram.com/${JSON.parse(userdata).instagram}`)
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
