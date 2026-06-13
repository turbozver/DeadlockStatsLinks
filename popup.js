const toggles = ["Tracklock", "Deadlocktracker", "Statlocker", "Mobalytics"];

function sendToggleChanged(key, value) {
    chrome.tabs.query({ url: ["https://steamcommunity.com/id/*", "https://steamcommunity.com/profiles/*"] }, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                type: 'toggle_changed',
                key: key,
                value: value
            }, () => {
                if (chrome.runtime.lastError) {}
            });
        });
    });
}

toggles.forEach(id => {
    const checkbox = document.getElementById(id);

    checkbox.addEventListener('change', () => {
        const value = checkbox.checked;

        chrome.storage.local.set({ [id]: value });
        sendToggleChanged(id, value);
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

document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('main').style.display = 'none';
    document.getElementById('settings').style.display = 'flex';
});

document.getElementById('backSettingsBtn').addEventListener('click', () => {
    document.getElementById('settings').style.display = 'none';
    document.getElementById('main').style.display = 'block';
});

document.getElementById('githubBtn').addEventListener('click', () => {
    window.open('https://github.com/turbozver/DeadlockStatsLinks', '_blank');
});

document.getElementById('emailBtn').addEventListener('click', () => {
    window.open('mailto:turbozver24@gmail.com', '_blank');
});

function getStoreUrl(extension) {
    const isFirefox = navigator.userAgent.includes('Firefox');

    if (extension === 'steamstatslinks') {
        return isFirefox
            ? 'https://addons.mozilla.org/ru/firefox/addon/steam-stats-links/'
            : 'https://chromewebstore.google.com/detail/steam-stats-links/ojmmcmoegpnmepjokkdemcgiklaldcld';
    }

    return isFirefox
        ? 'https://addons.mozilla.org/ru/firefox/addon/deadlock-stats-links/'
        : 'https://chromewebstore.google.com/detail/deadlock-stats-links/doikcgcigaogkfgjjhaafbnodmabeomd';
}

function renderRateBlock() {
    document.getElementById('rateBlock').innerHTML = `
        <div class="rate-stars">
            ${[1,2,3,4,5].map(star => `<span class="rateStar" data-star="${star}">&#9733;</span>`).join('')}
        </div>
        <div class="rate-caption">Rate this extension</div>
    `;

    document.querySelectorAll('.rateStar').forEach(star => {
        star.addEventListener('click', () => {
            window.open(getStoreUrl('deadlockstatslinks'), '_blank');
        });

        star.addEventListener('mouseover', (event) => {
            const value = parseInt(event.target.dataset.star, 10);
            document.querySelectorAll('.rateStar').forEach(item => {
                item.style.opacity = parseInt(item.dataset.star, 10) <= value ? "1" : "0.3";
            });
        });

        star.addEventListener('mouseout', () => {
            document.querySelectorAll('.rateStar').forEach(item => item.style.opacity = "1");
        });
    });
}

document.getElementById('steamStatsLinksBtn').addEventListener('click', () => {
    window.open(getStoreUrl('steamstatslinks'), '_blank');
});

renderRateBlock();
