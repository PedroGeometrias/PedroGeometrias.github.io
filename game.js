// Configuração inicial //
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d", { alpha: true});
context.imageSmoothingEnabled = false;

// Dimensões // 
gameCanvas.width = canvas.offsetWidth;
gameCanvas.height = canvas.offsetHeight;

// Variáveis principais //

// a nave esta no centro do canvas, renderizo ela com um tamanho de 28
let spaceship = { x: canvas.width / 2, y: canvas.height / 2, size: 28 };
// array que guarda as balas
let bullets = [];
// array que guarda os meteoros
let activeMeteorites = [];
// contador da pontuacao
let score = 0;
// contador da vida do player
let lives = 3;
// posica do mouse
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Imagens // 
const nave = new Image();
nave.src = "assets/cursor.png";
const meteorito1 = new Image();
const meteorito2 = new Image();
meteorito1.src = "assets/meteorito1.png";
meteorito2.src = "assets/meteorito2.png";
const meteorites = [meteorito1, meteorito2];


// Cache // 

// salvo angulos ja usados
const sinCache = {};
const cosCache = {};
function getSinCos(angle) {

    if (!sinCache[angle]) {
        // se o angulo nao existe, eu salvo ele
        sinCache[angle] = Math.sin(angle);
        cosCache[angle] = Math.cos(angle);
    }
    // caso ele exista, eu retorno o angulo adequado
    return { sin: sinCache[angle], cos: cosCache[angle] };
}

// Reutilizo objetos //

// reserva de balas
const bulletPool = [];

// retorno uma bala
function getBullet() {
    // caso exista uma bala, eu retorno ela usando pop, caso contrario eu crio uma bala nova
    return bulletPool.length ? bulletPool.pop() : { active: true };
}

// limpo balas nao necessarias
function releaseBullet(bullet) {
    // desativo
    bullet.active = false;
    // devolovo a reserva
    bulletPool.push(bullet);
}

// reutilizo meteoros

// reserva de meteoros
const meteoritePool = [];

// retorno meteoros
function getMeteorite() {
    // mesma logica das balas
    return meteoritePool.length ? meteoritePool.pop() : { active: true };
}
// limpo meteoros nao necessarios
function releaseMeteorite(meteorite) {
    // mesma logica das balasa
    meteorite.active = false;
    meteoritePool.push(meteorite);
}

// Mouse //

// nave em relacao ao mouse 
canvas.addEventListener("mousemove", (event) => {
    // canvas em relacao a pagina
    const rect = canvas.getBoundingClientRect();

    // posicao do mouse
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// tiro das balas
canvas.addEventListener("mousedown", (event) => {
    // canvas em relacao a pagina
    const rect = canvas.getBoundingClientRect();

    // posicao do mouse
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // distancia do mouse e da nave
    const dx = mouseX - spaceship.x;
    const dy = mouseY - spaceship.y;

    // angulo de rotacao
    const angle = Math.atan2(dy, dx);

    // reserva de angulos
    const { cos, sin } = getSinCos(angle);

    // pego da reserva de balas
    const bullet = getBullet();

    // direca da bala
    bullet.posix = spaceship.x + 15 * cos;
    bullet.posiy = spaceship.y + 15 * sin;

    // propriedades
    bullet.angle = angle;
    bullet.speed = 5;
    bullet.active = true;
    bullets.push(bullet);
});

// updates
function updateBullets() {
    // navego a lista de balas
    bullets.forEach((bullet, index) => {
        // verifico de a bala existe
        if (!bullet.active) return;
        // pego o angulo da reserva
        const { cos, sin } = getSinCos(bullet.angle);
        // upadate da posicao da bala 
        bullet.posix += bullet.speed * cos + 0.29;
        bullet.posiy += bullet.speed * sin + 0.25;

        // colisao da bala
        if (
            bullet.posix < 0 ||
            bullet.posix > canvas.width ||
            bullet.posiy < 0 ||
            bullet.posiy > canvas.height
        ) {
            // libero a bala
            releaseBullet(bullet);
            bullets.splice(index, 1);
        }
    });
}

// spawno meteoritos
function spawnMeteorite() {
    // pego um meteoro da reserva
    const meteorite = getMeteorite();
    // randomizo os meteoros 
    const meteoriteType = Math.random() < 0.6 ? meteorito1 : meteorito2;
    const size = meteoriteType === meteorito1 ? 32 : 48;
    // randomizo o lado
    const side = Math.floor(Math.random() * 4);
    // variaveis
    let x, y, speedX, speedY;

    // dependendo do lado eu fasso a logica
    switch (side) {
        case 0:
            x = Math.random() * canvas.width;
            y = -size;
            speedX = Math.random() * 2 - 1;
            speedY = Math.random() * 2 + 1;
            break;
        case 1:
            x = Math.random() * canvas.width;
            y = canvas.height + size;
            speedX = Math.random() * 2 - 1;
            speedY = -(Math.random() * 2 + 1);
            break;
        case 2:
            x = -size;
            y = Math.random() * canvas.height;
            speedX = Math.random() * 2 + 1;
            speedY = Math.random() * 2 - 1;
            break;
        case 3:
            x = canvas.width + size;
            y = Math.random() * canvas.height;
            speedX = -(Math.random() * 2 + 1);
            speedY = Math.random() * 2 - 1;
            break;
    }

    // atualizo as variaveis
    meteorite.x = x;
    meteorite.y = y;
    meteorite.size = size;
    meteorite.speedX = speedX;
    meteorite.speedY = speedY;
    meteorite.type = meteoriteType;
    meteorite.active = true;
    activeMeteorites.push(meteorite);
}

// update nos meteros
function updateMeteorites() {
    // para cada meteoro
    activeMeteorites.forEach((meteorite, index) => {
        // caso ativo eu somo a velocidade da cordenada
        if (!meteorite.active) return;
        meteorite.x += meteorite.speedX;
        meteorite.y += meteorite.speedY;
        // colisao com as paredes
        if (
            meteorite.x < -meteorite.size ||
            meteorite.x > canvas.width + meteorite.size ||
            meteorite.y < -meteorite.size ||
            meteorite.y > canvas.height + meteorite.size
        ) {
            // limpo a reserva
            releaseMeteorite(meteorite);
            activeMeteorites.splice(index, 1);
        }
    });
}

// colisao
function checkCollisions() {
    // para cada bala
    bullets.forEach((bullet, bulletIndex) => {
        // meteoros ativos
        activeMeteorites.forEach((meteorite, meteoriteIndex) => {
            // meteoro e bala tem de estar ativo
            if (!bullet.active || !meteorite.active) return;
            // colisao da bala com o meteoro
            if (
                bullet.posix >= meteorite.x - meteorite.size / 2 &&
                bullet.posix <= meteorite.x + meteorite.size / 2 &&
                bullet.posiy >= meteorite.y - meteorite.size / 2 &&
                bullet.posiy <= meteorite.y + meteorite.size / 2
            ) {
                // limpo a reserva
                releaseBullet(bullet);
                bullets.splice(bulletIndex, 1);
                releaseMeteorite(meteorite);
                activeMeteorites.splice(meteoriteIndex, 1);
                score += 1;
            }
        });
    });
}

// colisao da nave com a bala
function checkSpaceshipCollision() {
    activeMeteorites.forEach((meteorite, index) => {
        // Verificar colisão com a nave
        const dx = meteorite.x - spaceship.x;
        const dy = meteorite.y - spaceship.y;

        // Comparar os quadrados das distâncias
        const distanceSquared = dx * dx + dy * dy;
        const combinedRadius = meteorite.size / 2 + spaceship.size / 2;
        const radiusSquared = combinedRadius * combinedRadius;

        // subtraio da vida
        if (distanceSquared < radiusSquared) {
            lives--;

            releaseMeteorite(meteorite);
            activeMeteorites.splice(index, 1);

            if (lives <= 0) {
                endGame();
            }
        }
    });
}

// Desenho //

// desenho as balas
function drawBullets() {
    bullets.forEach((bullet) => {
        if (bullet.active) {
            context.fillStyle = "cyan";
            // ciano 8x8
            context.fillRect(bullet.posix - 2, bullet.posiy - 2, 8, 8);
        }
    });
}

// desenho meteoros
function drawMeteorites() {
    activeMeteorites.forEach((meteorite) => {
        if (meteorite.active) {
            context.drawImage(
                // dois tipos de meteoros
                meteorite.type,
                meteorite.x - meteorite.size / 2,
                meteorite.y - meteorite.size / 2,
                meteorite.size,
                meteorite.size
            );
        }
    });
}

// desenho a nave
function drawSpaceship() {
    const dx = mouseX - spaceship.x;
    const dy = mouseY - spaceship.y;
    const angle = Math.atan2(dy, dx);

    context.save();
    context.translate(spaceship.x, spaceship.y);
    context.rotate(angle + 7.8);
    context.drawImage(
        nave,
        -spaceship.size / 2,
        -spaceship.size / 2,
        spaceship.size,
        spaceship.size
    );
    context.restore();
}

// funcoes do jogo 
function endGame() {
    cancelAnimationFrame(gameLoopID);
    alert("Game Over! Sua pontuação foi: " + score);
    location.reload(); 
}

// Game loop
let gameLoopID;
let lastFrameTime = 0;
const frameInterval = 1000 / 80;
let lastMeteoriteSpawn = 0;
const meteoriteSpawnInterval = 500;
function gameLoop(timestamp) {
    if (timestamp - lastFrameTime < frameInterval) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastFrameTime = timestamp;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    updateBullets();
    drawBullets();

    if (timestamp - lastMeteoriteSpawn > meteoriteSpawnInterval) {
        spawnMeteorite();
        lastMeteoriteSpawn = timestamp;
    }

    updateMeteorites();
    drawMeteorites();

    checkCollisions();
    checkSpaceshipCollision();

    gameLoopID = requestAnimationFrame(gameLoop);
}
gameLoop();
