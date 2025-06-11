// Listen for messages

//console.log("UPDATED v2.6 /////////////////////////////////////////////////")

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

    var titleElement = document.querySelector('h1.css-1ms30pi')
    if(titleElement) {
        var title = titleElement.textContent.trim();
        sendResponse(title);
    }
});