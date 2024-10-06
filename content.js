// Function to inject the screenshot button below the video player
function addScreenshotButton() {
    const videoPlayer = document.querySelector('.ytp-right-controls');
    if (!videoPlayer || document.querySelector('#screenshotButton')) {
        return; // If button already exists or player not found
    }

    const button = document.createElement('button');
    button.id = 'screenshotButton';
    button.innerText = 'Screenshot';
    button.style.width = 'auto';
    button.style.cssFloat = 'left';
    button.style.paddingRight = '20px';
    button.classList.add('ytp-button');

    // Add event listener to capture the screenshot
    button.addEventListener('click', takeScreenshot);

    videoPlayer.prepend(button);  // Add button at the start of controls
}

// Function to capture the screenshot
function takeScreenshot() {
    const video = document.querySelector('video');
    if (!video) {
        alert('Video not found!');
        return;
    }

    // Get the current video title
    const videoTitle = document.title || 'Video';  // Default to 'Video' if title is not found

    // Get the current video time in hh:mm:ss format
    const videoTime = new Date(video.currentTime * 1000).toISOString().substr(11, 8);

    // Create a canvas element to draw the current frame of the video
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to a data URL (base64 encoded image)
    const dataUrl = canvas.toDataURL('image/png');

    // Generate the filename using video title and current time
    const fileName = `${videoTitle} ${videoTime}.png`.replace(/[:\/\\?%*|"<>]/g, '-'); // Clean illegal characters

    // Send the image data and filename to the background script for downloading
    chrome.runtime.sendMessage({ type: 'download', image: dataUrl, fileName: fileName });
}

// Observe changes to the DOM and add the button once the player is available
const observer = new MutationObserver(() => {
    addScreenshotButton();
});

observer.observe(document.body, { childList: true, subtree: true });

// Inject the button when the script first runs
addScreenshotButton();
