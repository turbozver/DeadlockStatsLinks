chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.storage.local.set({
            Tracklock: true,
            Deadlocktracker: true,
            Statlocker: true,
            Mobalytics: true
        });
    }
});
