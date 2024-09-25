// Starry background functions
function generateStars(id, count) {
    const container = document.getElementById(id);
    const existingStars = container.getElementsByClassName('star');
    const diff = count - existingStars.length;

    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            if (Math.random() > 0.85) {
                star.classList.add('red');
            }
            container.appendChild(star);
        }
    }

    for (let i = 0; i < count; i++) {
        const star = existingStars[i];
        star.style.top = `${Math.random() * container.clientHeight}px`;
        star.style.left = `${Math.random() * container.clientWidth}px`;
    }
}

function adjustStarCount() {
    const starContainers = ['stars', 'stars2', 'stars3'];
    const starCount = window.innerWidth < 768 ? 60 : 180;

    starContainers.forEach(id => {
        const container = document.getElementById(id);
        container.style.height = document.body.scrollHeight + 'px';
        generateStars(id, starCount);
    });
}

function randomBlink() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        if (Math.random() > 0.87) {
            star.classList.add('blink');
        } else {
            star.classList.remove('blink');
        }
    });
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustStarCount, 200);
});

window.addEventListener('load', () => {
    adjustStarCount();
    setInterval(randomBlink, 1000);
});

