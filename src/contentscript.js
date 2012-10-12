/*
 * Copyright (c) 2012 Oren Farhi. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

function resizeVideo(isFullScreen, isScrollToVideo) {
	var doc = document,
		videoContainer = doc.getElementById("watch-video-container");
	if (videoContainer) {
		var wv = doc.getElementById('watch-video'),
			wp = doc.getElementById('watch-player'),
			list = doc.getElementById('quicklist'),
			maxClassIndex = (list) ? list.className.indexOf("max") : false;
		if (isFullScreen) {
			doc.getElementById('content').className += ' watch-wide';
			wv.className += ' wide';
			wv.style.width = "auto"
			wp.style.height = (window.innerHeight - 20) + "px";
			wp.style.width = "auto";
			if (list) {
				if (maxClassIndex > -1)
					list.className.replace("max", "min");
			}
		} else {
			var content = doc.getElementById('content');
			content.className = content.className.replace('watch-wide', "");
			wv.className = wv.className.replace('wide', '');
			wv.style.width = "960px";
			wp.style.height = "390px";
			wp.style.width = "640px";
		}
		if (isScrollToVideo)
			videoContainer.scrollIntoView();
	}
}

function handleRequest(response) {
	//- check the localStorage true/false for activating full tube
	if (response.enableAutoFit == "true")
		resizeVideo(true, true);
	else if (response.enableAutoFit == "false")
		resizeVideo(false);
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
	if (request.action == 'toggleAutoFit') {
		if (request.enableAutoFit == "true")
			resizeVideo(true, true);
		else
			resizeVideo(false, true)
	}
	else
	  sendResponse({}); // snub them.
  });
		  
chrome.extension.sendRequest({'action': 'autoFit'}, handleRequest);