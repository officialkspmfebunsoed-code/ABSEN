document.addEventListener('DOMContentLoaded', () => {
    // Set today's date in monitor header
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'short' };
    const todayStr = new Date().toLocaleDateString('id-ID', dateOptions);
    document.getElementById('today-date').innerText = todayStr;

    // --- PWA Modal Logic ---
    const pwaModal = document.getElementById('pwa-modal');
    const closePwa = document.getElementById('close-pwa');
    const understandPwa = document.getElementById('understand-pwa');

    // Basic iOS Safari detection (demo mode checks intentionally simplified)
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);

    // Show PWA modal demo automatically after 1.5 seconds for preview purposes
    // (In production, you'd wrap this inside `if (isIos && !isInStandaloneMode)`)
    setTimeout(() => {
        pwaModal.classList.remove('hidden');
    }, 1500);

    closePwa.addEventListener('click', () => {
        pwaModal.classList.add('hidden');
    });

    understandPwa.addEventListener('click', () => {
        pwaModal.classList.add('hidden');
    });
});
