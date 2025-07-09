// Elementos HTML
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const platforms = document.querySelectorAll('.platform'); // Seleciona todas as plataformas

// Novas referências para os botões de celular
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const jumpButton = document.getElementById('jump-button');


// Propriedades do jogador
let playerX = 50;
let playerY = 0;
let playerWidth = 30;
let playerHeight = 40;
let playerSpeed = 5;
let jumpStrength = 15;
let gravity = 0.5; // Gravidade
let yVelocity = 0; // Velocidade vertical
let isOnGround = false; // Indica se o jogador está no chão

// Estado das teclas (e agora também dos botões)
let keys = {
    left: false,
    right: false,
    up: false
};

// Event Listeners para input do teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = true;
    }
    if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && isOnGround) {
        keys.up = true;
        yVelocity = -jumpStrength; // Aplica a força do pulo para cima
        isOnGround = false; // Não está mais no chão
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = false;
    }
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        keys.up = false;
    }
});

// --- Event Listeners para os botões de toque ---

// Botão Esquerda
leftButton.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Previne o comportamento padrão (ex: rolagem)
    keys.left = true;
});
leftButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.left = false;
});

// Botão Direita
rightButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys.right = true;
});
rightButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.right = false;
});

// Botão Pular
jumpButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (isOnGround) { // Só permite pular se estiver no chão
        keys.up = true;
        yVelocity = -jumpStrength;
        isOnGround = false;
    }
});
jumpButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.up = false; // O 'up' é desativado após o pulo ser iniciado
});

// --- Fim dos Event Listeners para botões ---


// Função principal de atualização do jogo (game loop)
function gameLoop() {
    // 1. Movimento Horizontal
    if (keys.left) {
        playerX -= playerSpeed;
    }
    if (keys.right) {
        playerX += playerSpeed;
    }

    // Limites da tela horizontal
    if (playerX < 0) {
        playerX = 0;
    }
    if (playerX + playerWidth > gameContainer.offsetWidth) {
        playerX = gameContainer.offsetWidth - playerWidth;
    }

    // 2. Aplicar Gravidade e Movimento Vertical
    yVelocity += gravity; // Aumenta a velocidade de queda
    playerY += yVelocity;

    isOnGround = false; // Assume que não está no chão até colidir com uma plataforma

    // 3. Colisão com Plataformas
    platforms.forEach(platform => {
        const platformRect = platform.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        // Obtém as posições relativas ao gameContainer
        const platformLeft = platform.offsetLeft;
        const platformRight = platform.offsetLeft + platform.offsetWidth;
        const platformTop = gameContainer.offsetHeight - platform.offsetTop - platform.offsetHeight; // Ajuste para bottom-based
        const platformBottom = gameContainer.offsetHeight - platform.offsetTop; // Ajuste para bottom-based

        // Posição do jogador relativa ao gameContainer (bottom-based)
        const playerBottom = playerY;
        const playerTop = playerY + playerHeight;
        const playerLeft = playerX;
        const playerRight = playerX + playerWidth;

        // Verifica se há sobreposição no eixo X e se o jogador está caindo sobre a plataforma
        if (playerRight > platformLeft && playerLeft < platformRight &&
            playerBottom >= platformTop && playerBottom <= platformBottom + 5 && // +5px de tolerância para "grudar" na plataforma
            yVelocity >= 0 // Garante que o jogador está caindo ou parado
        ) {
            playerY = platformTop; // Ajusta a posição do jogador para ficar em cima da plataforma
            yVelocity = 0; // Para a queda
            isOnGround = true; // O jogador está no chão
        }
    });

    // Colisão com o "chão" do container se não estiver em nenhuma plataforma
    if (playerY < 0 && !isOnGround) {
        playerY = 0;
        yVelocity = 0;
        isOnGround = true;
    }

    // 4. Atualizar Posição do Jogador no CSS
    player.style.left = `${playerX}px`;
    player.style.bottom = `${playerY}px`; // Usamos 'bottom' para a gravidade puxar para baixo

    // Solicita o próximo frame da animação
    requestAnimationFrame(gameLoop);
}

// Inicia o loop do jogo
gameLoop();

