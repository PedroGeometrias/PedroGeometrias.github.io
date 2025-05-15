// stars logic 
function generateStars(id, count) {
    // applying id 
    const container = document.getElementById(id);
    // every star
    const existingStars = container.getElementsByClassName('star');
    // stars that don't exist yet
    const diff = count - existingStars.length;

    if (diff > 0) {
        // creating new stars until diff
        for (let i = 0; i < diff; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            // 15% are red dwarfs
            if (Math.random() > 0.85) {
                star.classList.add('red');
            }
            container.appendChild(star);
        }
    }

    // drawing
    for (let i = 0; i < count; i++) {
        const star = existingStars[i];
        star.style.top = `${Math.random() * container.clientHeight}px`;
        star.style.left = `${Math.random() * container.clientWidth}px`;
    }
}

function adjustStarCount() {
    const starContainers = ['stars', 'stars2', 'stars3'];
    // smaller screen I generate less stars
    const starCount = window.innerWidth < 768 ? 60: 180;

    // stars are generated on the entirety of the page
    starContainers.forEach(id => {
        const container = document.getElementById(id);
        container.style.height = document.body.scrollHeight + 'px';
        generateStars(id, starCount);
    });
}


function randomBlink() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        // each stars has 13% chance to blinck
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

