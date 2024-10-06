chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'download' && request.image && request.fileName) {
        chrome.downloads.download({
            url: request.image,
            filename: request.fileName,  // Use the file name passed in the request
            saveAs: true  // Optional: This will trigger the "Save As" dialog for the user to choose location
        });
    }
});
