document.getElementById('videoPlayer').src = "http://localhost:3000/stream";
let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');

let isClassifying = false;
let intervalID;

function sendFrame() {
    if (!isClassifying) return; 
    var img = document.getElementById('videoPlayer'); 
    if (img.readyState < 2) {
        console.error('Video is not ready.');
        return; 
    }
    var canvas = document.createElement('canvas');
    canvas.width = img.videoWidth || img.naturalWidth;
    canvas.height = img.videoHeight || img.naturalHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob) {
        if (!blob) {
            console.error('Failed to create blob from canvas');
            return;
        }
        var formData = new FormData();
        formData.append('image', blob, 'frame.jpg');

        fetch('http://localhost:5000/translate', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if(data.letter === "No hands detected") {
                showPopup(data.letter); 
            } else {
                console.log('Letter detected:', data.letter);
                document.getElementById('textInput').value += data.letter;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, 'image/jpeg');
}

function startClassification() {
    if (!isClassifying) {
        isClassifying = true;
        intervalID = setInterval(sendFrame, 4000);
        startButton.innerText = "Pause";
        stopButton.innerText = "Stop";
    } else {
        // This is to handle Pause action
        stopClassification();
        startButton.innerText = "Resume";
    }
}

function stopClassification() {
    if (isClassifying) {
        clearInterval(intervalID);
        isClassifying = false;
        startButton.innerText = "Start";
        stopButton.innerText = "Reset";
    } else {
        // This is to handle Reset action
        document.getElementById('textInput').value = '';
        startButton.innerText = "Start";
    }
}

startButton.addEventListener('click', startClassification);

stopButton.addEventListener('click', stopClassification);

function showPopup(message) {
    stopClassification();  
    document.body.style.overflow = 'hidden'; // מונע גלילה באתר

    // Create the popup background which covers the entire viewport
    const popupBackground = document.createElement('div');
    popupBackground.id = 'popupBackground';
    popupBackground.style.position = 'fixed';
    popupBackground.style.top = '0';
    popupBackground.style.left = '0';
    popupBackground.style.width = '100%';
    popupBackground.style.height = '100%';
    popupBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    popupBackground.style.display = 'flex';
    popupBackground.style.justifyContent = 'center';
    popupBackground.style.alignItems = 'center';
    popupBackground.style.zIndex = '1000';

    // Create the actual popup box
    const popup = document.createElement('div');
    popup.style.background = 'white';
    popup.style.padding = '20px';
    popup.style.borderRadius = '5px';
    popup.style.textAlign = 'center';
    popup.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.5)';

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;

    const okayButton = document.createElement('button');
    okayButton.textContent = 'Okay';
    okayButton.style.marginTop = '20px'; 
    okayButton.onclick = function() {
        popupBackground.remove(); 
        document.body.style.overflow = ''; // אפשור גלילה באתר
    };

    popup.appendChild(messageParagraph);
    popup.appendChild(okayButton);
    popupBackground.appendChild(popup);
    document.body.appendChild(popupBackground);
}
