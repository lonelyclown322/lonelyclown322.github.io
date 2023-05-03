let slideIndex = 1;
let treckIndex = 0;
showSlides(slideIndex);
let timerValue = 1;
let timerButton = document.getElementById("choose-time");
let startButton = document.getElementById("start-timer")
let intervalId;
let trecksSources = ['audio/treck1.mp3', 'audio/treck2.mp3', 'audio/treck3.mp3']

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function plusTrecks(n) {

    treckIndex += n
    if (treckIndex < 0) {
      treckIndex += 3
    }

    showTrecks(treckIndex);
}


// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides fade");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex - 1].style.display = "block";
}

function showTrecks(n) {
    let trecks = document.getElementsByClassName("myTrecks");
    trecks[0].src = trecksSources[n % 3]
}


function startSlideShow() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        startButton.innerText = "start";
        return;
    } else {
        startButton.innerText = "stop";
    }

    intervalId = setInterval(function () {
        plusSlides(1)
    }, 1000 * timerValue);
}


function changeTime() {
    timerValue++;
    timerValue = timerValue % 5 === 0 ? 1 : timerValue

    timerButton.innerText = timerValue + ' sec';

    if (intervalId) {

        clearInterval(intervalId);
        intervalId = setInterval(function () {
            plusSlides(1)
        }, 1000 * timerValue);
    }
}

timerButton.onclick = changeTime;

window.onload = function () {
  let audio = document.getElementById("audio1");
  let context = null

  audio.onplay = function () {
    if (context) {
      return
    }
    context = new AudioContext();
    let src = context.createMediaElementSource(audio);
    let analyser = context.createAnalyser();

    let canvas = document.getElementById("canvas");
    canvas.width = audio.clientWidth;
    canvas.height = audio.clientHeight;

    let ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 512;

    let bufferLength = analyser.frequencyBinCount;

    let dataArray = new Uint8Array(bufferLength);

    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;

    let barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      // ctx.fillStyle = "rgba(100,150,185,0)";
      // ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.clearRect(0, 0, canvas.width, canvas.height);


      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 5;

        // let r = barHeight + 250 * (i / bufferLength);
        // let g = 100 * (i / bufferLength);
        // let b = 25;

        let r = 0;
        let g = 0;
        let b = 0;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
  };
};
