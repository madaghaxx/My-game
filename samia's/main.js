let scoreel = document.querySelector('#score')
class Player {
    constructor() {
        this.position = { x: 410, y: 630 };
        this.velocity = { x: 0 };
        this.width = 80;
        this.height = 60;
        this.imageSrc = "./image/space-invaders.png";
        this.element = null;
        this.gameContainer = document.querySelector('.game-container');
        this.lastShootFrame = 0;
        this.shootInterval = 15;
    }

    draw() {
        if (!this.element) {
            this.element = document.createElement('img');
            this.element.src = this.imageSrc;
            this.element.classList.add('player');
            this.gameContainer.appendChild(this.element);
        }
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    shoot(currentFrame) {
        if (currentFrame - this.lastShootFrame >= this.shootInterval) {
            projectiles.push(new Projectile({
                position: { x: this.position.x + this.width / 2, y: this.position.y },
                velocity: { x: 0, y: -5 },
                className: 'projectile'
            }));
            this.lastShootFrame = currentFrame;
        }
    }

    move() {
        this.position.x += this.velocity.x;
        this.position.x = Math.max(0, Math.min(this.position.x, this.gameContainer.offsetWidth - this.width));
        this.draw();
    }
}

class Projectile {
    constructor({ position, velocity, className }) {
        this.position = { ...position };
        this.velocity = { ...velocity };
        this.className = className;
        this.element = document.createElement('div');
        this.element.classList.add(this.className);
        document.querySelector('.game-container').appendChild(this.element);
    }

    update() {
        this.position.y += this.velocity.y;
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    remove() {
        this.element.remove();
    }
}

class Invader {
    constructor({ position }) {
        this.position = { ...position };
        this.velocity = { x: 0.5, y: 0 };
        this.width = 60;
        this.height = 50;
        this.imageSrc = "./image/invader.png";
        this.element = document.createElement('img');
        this.element.src = this.imageSrc;
        this.element.classList.add('invader');
        document.querySelector('.game-container').appendChild(this.element);
        this.update();
    }

    update(velocity = this.velocity) {
        this.position.x += velocity.x;
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new Projectile({
            position: { x: this.position.x + this.width / 2, y: this.position.y + this.height },
            velocity: { x: 0, y: 5 },
            className: 'invader-projectile'
        }));
    }

    remove() {
        this.element.remove();
    }
}

class Grid {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 2, y: 0 };
        this.invaders = [];
        this.gameContainer = document.querySelector('.game-container');

        const rows = Math.floor(Math.random() * 3 + 3);
        const cols = Math.floor(Math.random() * 5 + 4);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.invaders.push(new Invader({
                    position: { x: j * 70, y: i * 55 }
                }));
            }
        }
    }

    update() {
        this.position.x += this.velocity.x;
        const leftmostInvader = Math.min(...this.invaders.map(inv => inv.position.x));
        const rightmostInvader = Math.max(...this.invaders.map(inv => inv.position.x));

        if (rightmostInvader + 60 > this.gameContainer.offsetWidth || leftmostInvader < 0) {
            this.velocity.x *= -1;
            this.invaders.forEach(inv => inv.position.y += 10);
        }

        this.invaders.forEach(inv => inv.update(this.velocity));
    }
}

const player = new Player();
const projectiles = [];
const invaderProjectiles = [];
const grids = [];
const keys = {
    space: false
};

player.draw();

window.addEventListener('keydown', (event) => {
    if (event.key === 'a') player.velocity.x = -5;
    if (event.key === 'd') player.velocity.x = 5;
    if (event.key === ' ') keys.space = true;
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'a' || event.key === 'd') player.velocity.x = 0;
    if (event.key === ' ') keys.space = false;
});

// Vérifie la collision entre un projectile et un invader
function checkCollisionInvader(projectile, invader) {
    return (
        projectile.position.x >= invader.position.x &&
        projectile.position.x <= invader.position.x + invader.width &&
        projectile.position.y >= invader.position.y &&
        projectile.position.y <= invader.position.y + invader.height
    );
}
// Vérifie la collision entre un projectile et un player
function checkCollisionPayer(projectile, player) {
    return (
        projectile.position.x >= player.position.x &&
        projectile.position.x <= player.position.x + player.width &&
        projectile.position.y >= player.position.y &&
        projectile.position.y <= player.position.y + player.height
    );
}

let frames = 0;
let score = 0
let gameStarted = false;
let gameActive = true;

function animate() {

    if (!gameActive || !gameStarted) return;

    if (keys.space) {
        player.shoot(frames);
    }
    player.move();

    projectiles.forEach((p, i) => {
        p.update();
        if (p.position.y < 0) {
            p.remove();
            projectiles.splice(i, 1);
        }
    });

    // Mettre à jour les grilles d'envahisseurs
    grids.forEach(grid => {
        grid.update();
        
        // Vérifier les collisions entre projectiles et envahisseurs
        grid.invaders.forEach((invader, invIndex) => {
            projectiles.forEach((p, pIndex) => {
                if (checkCollisionInvader(p, invader)) {
                    invader.remove();
                    p.remove();
                    score += 100;
                    scoreel.innerHTML = score;
                    grid.invaders.splice(invIndex, 1);
                    projectiles.splice(pIndex, 1);
                }
            });
        });

        // Tir aléatoire des envahisseurs
        if (Math.random() < 0.02 && grid.invaders.length > 0) {
            const randomInvader = grid.invaders[Math.floor(Math.random() * grid.invaders.length)];
            if (randomInvader) randomInvader.shoot(invaderProjectiles);
        }
    });

    // Mettre à jour et gérer les projectiles des envahisseurs
    invaderProjectiles.forEach((p, i) => {
        p.update();
        
        // Supprimer les projectiles hors écran
        if (p.position.y > 700) {
            p.remove();
            invaderProjectiles.splice(i, 1);
        }

        // Vérifier la collision avec le joueur
        if (checkCollisionPayer(p, player)) {
            gameActive = false;
            p.remove();
            invaderProjectiles.splice(i, 1);
            
            // Créer le popup de game over
            const overlay = document.createElement('div');
            overlay.className = 'popup-overlay';
            
            const popup = document.createElement('div');
            popup.className = 'popup';
            
            popup.innerHTML = `
                <h2>GAME OVER</h2>
                <p>Score final : </p><p id="scorp">${score}</p>
                <button onclick="restartGame()">Rejouer</button>
            `;
            
            overlay.appendChild(popup);
            document.body.appendChild(overlay);
            
            // Désactiver les contrôles du joueur
            player.velocity.x = 0;
            keys.space = false;
        }
    });

    // Créer une nouvelle grille d'envahisseurs périodiquement
    if (frames % 1000 === 0) {
        grids.push(new Grid());
    }

    // Continuer l'animation
    requestAnimationFrame(animate);
    frames++;
}

// Fonction pour redémarrer le jeu
function restartGame() {
    // Supprimer le popup
    const overlay = document.querySelector('.popup-overlay');
    if (overlay) overlay.remove();
    
    // Réinitialiser les variables du jeu
    score = 0;
    scoreel.innerHTML = score;
    frames = 0;
    gameActive = true;
    gameStarted = true;
    
    // Nettoyer les projectiles existants
    projectiles.forEach(p => p.remove());
    projectiles.length = 0;
    invaderProjectiles.forEach(p => p.remove());
    invaderProjectiles.length = 0;
    
    // Nettoyer les grilles et invaders existants
    grids.forEach(grid => {
        grid.invaders.forEach(invader => invader.remove());
    });
    grids.length = 0;
    
    // Réinitialiser la position du joueur
    player.position = { x: 410, y: 630 };
    player.velocity = { x: 0 };
    player.draw();
    
    animate();
}

// Gestionnaire du bouton de démarrage
document.getElementById('startButton').addEventListener('click', function() {
    const startScreen = document.querySelector('.start-screen');
    startScreen.style.display = 'none';
    gameStarted = true;
    gameActive = true;
    player.draw();
    animate();
});