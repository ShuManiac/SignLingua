// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBDpeG1VotqvA85uQwOI2kMvT9MsP224j8",
//     authDomain: "signlingua-f821a.firebaseapp.com",
//     databaseURL: "https://signlingua-f821a-default-rtdb.europe-west1.firebasedatabase.app/",
//     projectId: "signlingua-f821a",
//     storageBucket: "signlingua-f821a.appspot.com",
//     messagingSenderId: "842234643572",
//     appId: "1:842234643572:web:a3c0694afeb0e86017bd21"
// };

// // Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);

// var camera = firebase.database().ref("/esp32cam/ip");

// function Camera() {
//     camera.on('value', function(snapshot) {
//     console.log(snapshot.val());
//     document.getElementById("cam").src = snapshot.val();
//     console.log("Connection to camera successful");
// });
// }

// // Function to update video source
// function updateVideoSource(source) {
//     if (source) {
//         videoElement.src = source;
//         videoElement.style.display = "block";
//         placeholderImage.style.display = "none";
//     } else {
//         videoElement.style.display = "none";
//         placeholderImage.style.display = "block";
//     }
// }

// var videoElement = document.getElementById("videoPlayer");
// var placeholderImage = document.getElementById("placeholderImage");

// // Simulate input check every 5 seconds (for demonstration)
// setInterval(function() {
//     // Replace this with your actual logic to check input from ESP32CAM
//     var inputReceived = true; // Change to false to simulate no input
//     console.log("FUNC");
//     if (inputReceived) {
//         updateVideoSource(Camera());
//     } else {
//         updateVideoSource(null);
//     }
// }, 5000);

// LATEST VERSION ----------------------------------------------------------------------------------------------------------------
// document.getElementById('videoPlayer').src = "http://localhost:3000/stream"
// let startButton = document.getElementById('start');
// let stopButton = document.getElementById('stop');

// startButton.addEventListener('click', () => {
//     setInterval(sendFrame, 4000); // Send a frame every 4 seconds
// });

// let classifier;
// let isClassifying = false;
// let intervalID;

// function sendFrame() {
//     var img = document.getElementById('videoPlayer'); // This is your <img> element
//     // Check if the image is loaded by verifying its natural dimensions
//     if (img.naturalWidth === 0 || img.naturalHeight === 0) {
//         console.error('Image is not loaded or has no dimensions');
//         return; // Exit the function if image isn't ready
//     }

//     var canvas = document.createElement('canvas');
//     canvas.width = img.naturalWidth;
//     canvas.height = img.naturalHeight;
//     var ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob(function(blob) {
//         if (!blob) {
//             console.error('Failed to create blob from canvas');
//             return; // Exit the function if blob creation failed
//         }

//         var formData = new FormData();
//         formData.append('image', blob, 'frame.jpg'); // Append the blob with a filename

//         fetch('http://localhost:5000/translate', {
//             method: 'POST',
//             body: formData,
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Letter detected:', data.letter);
//             document.getElementById('textInput').value += data.letter; // Append the detected letter to the textarea
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     }, 'image/jpeg');
// }
// ----------------------------------------------------------------------------------------------------------------------------

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
