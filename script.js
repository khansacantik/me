document.addEventListener("DOMContentLoaded", function() {
    var loader = document.getElementById("loader");
    var content = document.querySelector(".content");
    var profileContainer = document.querySelector(".profile-container");
    var profilePic = document.querySelector(".profile-pic");
    var textElements = document.querySelectorAll("h1, p, .social-icons");
    var audioPlayer = document.getElementById('audio-player');
    var canvas = document.getElementById('audio-visualizer');
    var canvasCtx = canvas.getContext('2d');

    // Audio visualizer setup
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioContext.createAnalyser();
    var source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    canvas.width = window.innerWidth;
    canvas.height = 100;

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        var barWidth = (canvas.width / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            
            var r = barHeight + (25 * (i/bufferLength));
            var g = 250 * (i/bufferLength);
            var b = 50;

            canvasCtx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    audioPlayer.onplay = function() {
        audioContext.resume().then(() => {
            draw();
        });
    };

    // Loader and animation
    setTimeout(function() {
        loader.style.display = "none";
        content.style.display = "block";
        profileContainer.style.transform = "scale(1)";
        profileContainer.style.opacity = "1";

        profilePic.style.animationDelay = "0.5s";
        profilePic.style.animationPlayState = "running";

        textElements.forEach(function(element) {
            element.style.animationPlayState = "running";
        });
    }, 2000);
});
