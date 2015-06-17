chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
		chrome.tabs.update( tabs[0].id, { url: "http://10.219.11.62:3000/?" + tab.url } ); 
	});
});