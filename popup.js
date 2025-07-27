const toggles = ["Tracklock", "Deadlocktracker", "Statlocker", "Mobalytics"];

toggles.forEach(id => {
    const checkbox = document.getElementById(id);

    checkbox.addEventListener('change', () => {
        const value = checkbox.checked;

        chrome.storage.local.set({ [id]: value });

        chrome.tabs.query({ url: ["https://steamcommunity.com/id/*", "https://steamcommunity.com/profiles/*"] }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'toggle_changed',
                key: id,
                value: value
            });
        });
    });

    chrome.storage.local.get(id, (result) => {
        checkbox.checked = !!result[id];
    });
});

document.querySelectorAll('.container a').forEach(link => {
    link.addEventListener('auxclick', (event) => {
        event.preventDefault();
        chrome.tabs.create({ url: link.href, active: false });
    });
});