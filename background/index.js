// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
        case 'capture':
            // Capture the visible tab
            chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png' }, dataUrl => {
                sendResponse({
                    message: 'image',
                    args: [dataUrl, request.area, request.dpr, true, 'png']
                });
            });
            break;

        case 'active':
            if (request.active) {
                chrome.action.setTitle({ tabId: sender.tab.id, title: 'Crop and Save' });
                chrome.action.setBadgeText({ tabId: sender.tab.id, text: '◩' });
            } else {
                chrome.action.setTitle({ tabId: sender.tab.id, title: 'Screenshot Capture' });
                chrome.action.setBadgeText({ tabId: sender.tab.id, text: '' });
            }
            break;
    }
    return true;
});

// Handle extension icon click
chrome.action.onClicked.addListener(tab => {
    chrome.tabs.sendMessage(tab.id, { message: 'init' });
});

// Set default options
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(options => {
        if (!options.format) {
            chrome.storage.sync.set({ format: 'png' });
        }
    });
});
