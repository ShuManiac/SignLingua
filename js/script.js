const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        } else{
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));



// Code For Displaying Translation Of A Click Letter

document.addEventListener("DOMContentLoaded", function() {
    // Get the ABC table
    var abcTable = document.querySelector('.abc-table');
    // Get the translation table
    var translationTable = document.querySelector('.translation-table');
    // Get the text section
    var textSection = document.querySelector('.text-section');

    // Hide the translation table and headers initially
    translationTable.classList.add('hidden');
    var translationTableHeaders = translationTable.querySelector('thead');
    if (translationTableHeaders) {
        translationTableHeaders.style.display = 'none';
    }

    // Add click event listener to ABC table
    abcTable.addEventListener('click', function(event) {
        var target = event.target;
        // Check if the clicked element is a table cell (td)
        if (target.tagName === 'TD') {
            var letter = target.textContent.trim();
            showTranslation(letter);
        }
    });

    function showTranslation(letter) {
        // Clear previous content if a different letter is clicked
        translationTable.querySelector('tbody').innerHTML = '';
        // Iterate over the letters and find the corresponding sign language video
        var signLanguageVideoSrc = "/vid/" + letter.toLowerCase() + "-abc.mp4";
        var newRow = translationTable.querySelector('tbody').insertRow();
        newRow.insertCell(0).textContent = letter;
        var cell = newRow.insertCell(1);
        var video = document.createElement('video');
        video.autoplay = true;
        video.loop = true;
        var source = document.createElement('source');
        source.src = signLanguageVideoSrc;
        video.appendChild(source);
        cell.appendChild(video);
    
        // Show the translation table and apply fade-in animation
        translationTable.classList.remove('hidden');
        translationTable.classList.add('fade-in'); // Add the fade-in animation class
        
        textSection.style.display = 'none';
        textSection.classList.add('hidden');
    
        // Show table headers
        if (translationTableHeaders) {
            translationTableHeaders.style.display = 'table-header-group';
        }
    }    
});

// Hamburger Menu
const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');

hamburger.addEventListener('click', ()=>{
    hamburger.classList.toggle('active');
    mobile_menu.classList.toggle('active');
});


document.addEventListener('scroll', () => {
    var scroll_position = window.scrollY;
    if(scroll_position > 250){
        header.style.backgroundColor = "#171717"
    }
    else{
        header.style.backgroundColor = "transparent"
    }
});


function goToPage() {
    window.location.href = "/html/translate.html";
}

// Modal Script - Buisness Inquiries
document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("businessInquiriesModal");

    var btn = document.getElementById("businessInquiries");

    var span = document.getElementsByClassName("close")[0];

    var body = document.body;

    btn.onclick = function() {
        modal.style.display = "block";
        body.classList.add("body-no-scroll");
    }

    span.onclick = function() { // לחיצה על האיקס, תסגור את הפופאפ
        modal.style.display = "none";
        body.classList.remove("body-no-scroll");
    }

    window.onclick = function(event) { // כאשר המשתמש לוחץ על המסך, הפופאפ ייסגר
        if (event.target == modal) {
            modal.style.display = "none";
            body.classList.remove("body-no-scroll");
        }
    }
});


// Send Email Function
function SendMail(event) {
    let email = document.getElementById('email').value;
    let subject = document.getElementById('subject').value;
    let content = document.getElementById('content').value;
    const emailPattern = /.+@.+\..+/; 
    if (!emailPattern.test(email)) {
        showConfirmationModal("Email format is incorrect. Please enter a valid email address.", false);
        return; 
    }
    let params = {
        email: email,
        subject: subject,
        content: content
    };
    console.log(params);
    emailjs.send("service_ija0lfm", "template_9ggmjif", params)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
            showConfirmationModal("Email sent successfully! We will contact you shortly.", true);
            document.getElementById('email').value = '';
            document.getElementById('subject').value = '';
            document.getElementById('content').value = '';
        }, function (error) {
            console.log('FAILED...', error);
            showConfirmationModal("Failed to send the email. Please try again later.", false);
        });
}

function showConfirmationModal(message, isSuccess) {
    var modalContent = document.getElementById("emailConfirmationModal").querySelector('.modal-content');
    modalContent.innerHTML = '<span class="close" onclick="closeConfirmationModal()">&times;</span>' +
        '<h2>' + message + '</h2>';

    if (!isSuccess) {
        modalContent.innerHTML += '<p>Please make sure to use a correct email format.</p>';
    }

    document.getElementById("businessInquiriesModal").style.display = "none";
    document.getElementById("emailConfirmationModal").style.display = "block";
    document.body.classList.add("body-no-scroll");
}

function closeConfirmationModal() {
    document.getElementById("emailConfirmationModal").style.display = "none";
    document.body.classList.remove("body-no-scroll");
}
