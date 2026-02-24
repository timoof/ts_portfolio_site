document.addEventListener('DOMContentLoaded', () => {
    const musicCards = document.querySelectorAll('.music-card');
    const playerBar = document.getElementById('audio-player-bar');
    const audioEl = document.getElementById('main-audio');
    const nowPlayingTitle = document.getElementById('now-playing-title');
    const closeBtn = document.getElementById('close-player');

    musicCards.forEach(card => {
        card.addEventListener('click', () => {
            const src = card.getAttribute('data-src');
            const title = card.getAttribute('data-title');

            playTrack(src, title);
        });
    });

    closeBtn.addEventListener('click', () => {
        audioEl.pause();
        playerBar.classList.add('hidden');
    });

    function playTrack(src, title) {
        // Update source
        audioEl.src = src;
        nowPlayingTitle.textContent = title;

        // Show player
        playerBar.classList.remove('hidden');

        // Play
        audioEl.play().catch(err => console.error("Playback failed:", err));
    }
});
