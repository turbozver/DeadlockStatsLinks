async function getSteamID() {
    let profileURL = window.location.pathname;
    let match = profileURL.match(/\/profiles\/(\d+)/);
    return match ? match[1] : null;
}

async function getSteamIDFromXML() {
    let response = await fetch(window.location.href + '?xml=1');
    let text = await response.text();
    let match = text.match(/<steamID64>(\d+)<\/steamID64>/);
    return match ? match[1] : null;
}

async function steamID64ToAccountID(steamID64) {
    return BigInt(steamID64) - BigInt('76561197960265728');
}

function updateLastWidth() {
    const container = document.getElementById('deadlockStatsLinks');
    const allButtons = Array.from(container.querySelectorAll('.btnDeadlockStatsLinks'));
    buttons = allButtons.filter(btn => btn.style.display !== 'none')

    buttons.forEach(btn => btn.style.width = '40%');

    if (buttons.length % 2 === 1) {
        buttons[buttons.length - 1].style.width = 'calc(80% + 30px)';
    }
}

async function createButtons() {
    let steamID = await getSteamID();
    
    if (!steamID || isNaN(steamID)) {
        steamID = await getSteamIDFromXML();
    }

    if (!steamID) return;
    
    let accountID = await steamID64ToAccountID(steamID);
    let profileRightCol = document.querySelector('.profile_rightcol');
    if (!profileRightCol) return;

    let container = document.createElement('div');
    container.id = "deadlockStatsLinks"

    let btnTracklock = document.createElement('a');
    btnTracklock.id = "btnTracklock";
    btnTracklock.href = `https://tracklock.gg/players/${accountID}`;
    btnTracklock.textContent = 'tracklock';
    btnTracklock.classList.add("btnDeadlockStatsLinks");
    container.appendChild(btnTracklock);

    let btnDeadlocktracker = document.createElement('a');
    btnDeadlocktracker.id = "btnDeadlocktracker";
    btnDeadlocktracker.href = `https://deadlocktracker.gg/player/${accountID}`;
    btnDeadlocktracker.textContent = 'ddlk tracker';
    btnDeadlocktracker.classList.add("btnDeadlockStatsLinks");
    container.appendChild(btnDeadlocktracker);

    let btnStatlocker = document.createElement('a');
    btnStatlocker.id = "btnStatlocker";
    btnStatlocker.href = `https://statlocker.gg/profile/${accountID}`;
    btnStatlocker.textContent = 'statlocker';
    btnStatlocker.classList.add("btnDeadlockStatsLinks");
    container.appendChild(btnStatlocker);

    let btnMobalytics = document.createElement('a');
    btnMobalytics.id = "btnMobalytics";
    btnMobalytics.href = `https://mobalytics.gg/deadlock/player-profile/${steamID}`;
    btnMobalytics.textContent = 'mobalytics';
    btnMobalytics.classList.add("btnDeadlockStatsLinks");
    container.appendChild(btnMobalytics);

    if (profileRightCol.children.length < 2)
        profileRightCol.appendChild(container)
    else
        profileRightCol.insertBefore(container, profileRightCol.children[1])

    const keys = ["Tracklock", "Deadlocktracker", "Statlocker", "Mobalytics"];
    chrome.storage.local.get(keys, (result) => {
        keys.forEach(key => {
            const btn = document.getElementById(`btn${key}`);
            btn.style.display = result[key] ? 'inline-block' : 'none';
        });

        updateLastWidth();
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'toggle_changed') {
        const { key, value } = message;

        const btn = document.getElementById(`btn${key}`);
        if (btn)
        {
            btn.style.display = value ? 'inline-block' : 'none';
            updateLastWidth()
        }
    }
});

window.addEventListener("DOMContentLoaded", async () => {
    await createButtons();
});