// Called when a message is passed.  We assume that the content script
// wants to show the page action.
var fullTubeIsEnabled;
var storage = window.localStorage;

function initFullTube() {
	if(storage) {
		if(storage.fullTubeIsEnabled != "") {
			fullTubeIsEnabled = storage.fullTubeIsEnabled;
		} else {
			storage.fullTubeIsEnabled = "true";
			fullTubeIsEnabled = "true";
		}
	}
}

function onRequest(request, sender, sendResponse) {
	// Show the page action for the tab that the sender (content script)
	// was on.
	initFullTube();
	chrome.pageAction.show(sender.tab.id);
	if(storage.fullTubeIsEnabled === "false") {
		chrome.pageAction.setIcon({
			tabId: sender.tab.id,
			path: 'youtube-16-disabled.png'
		});
	}
	// Return nothing to let the connection be cleaned up.
	sendResponse({});
};

function onIconClick(tab) {
	if(fullTubeIsEnabled === "true") {
		chrome.pageAction.setIcon({
			tabId: tab.id,
			path: 'youtube-16-disabled.png'
		});
		storage.fullTubeIsEnabled = "false";
		fullTubeIsEnabled = "false";
	} else {
		chrome.pageAction.setIcon({
			tabId: tab.id,
			path: 'youtube-16.png'
		});
		storage.fullTubeIsEnabled = "true";
		fullTubeIsEnabled = "true";
	}
	chrome.tabs.sendRequest(tab.id, {
		'action': 'toggleAutoFit',
		'enableAutoFit': fullTubeIsEnabled
	});
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.action === 'autoFit') sendResponse({
		'enableAutoFit': storage.fullTubeIsEnabled
	});
	else sendResponse({}); // snub them.
});

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
chrome.pageAction.onClicked.addListener(onIconClick);