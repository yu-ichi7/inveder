class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // スマホ対応のため、ウィンドウサイズに合わせてキャンバスサイズを調整
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 30,
            width: 50,
            height: 30,
            speed: 5
        };
        
        this.bullets = [];
        this.enemies = [];
        this.score = 0;
        this.gameOver = false;
        
        // キーボード入力
        this.keys = {};
        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);
        
        // タッチ入力
        document.querySelectorAll('.touch-button').forEach(button => {
            button.addEventListener('touchstart', () => {
                if (button.classList.contains('left')) {
                    this.keys['ArrowLeft'] = true;
                } else if (button.classList.contains('right')) {
                    this.keys['ArrowRight'] = true;
                } else if (button.classList.contains('shoot')) {
                    this.keys[' '] = true;
                }
            });
            
            button.addEventListener('touchend', () => {
                if (button.classList.contains('left')) {
                    this.keys['ArrowLeft'] = false;
                } else if (button.classList.contains('right')) {
                    this.keys['ArrowRight'] = false;
                } else if (button.classList.contains('shoot')) {
                    this.keys[' '] = false;
                }
            });
        });
        
        this.createEnemies();
        this.gameLoop();
    }

    resizeCanvas() {
        // キャンバスのサイズをウィンドウサイズに合わせる
        const container = document.querySelector('.game-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // キャンバスのアスペクト比を維持
        const aspectRatio = 800 / 600;
        const canvasWidth = Math.min(containerWidth, 800);
        const canvasHeight = canvasWidth / aspectRatio;
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        // プレイヤーの位置を調整
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height - 30;
        
        // 敵の位置を調整
        this.enemies.forEach(enemy => {
            enemy.x = enemy.x * (this.canvas.width / 800);
            enemy.y = enemy.y * (this.canvas.height / 600);
        });
    }

    createEnemies() {
        const rows = 5;
        const cols = 10;
        const spacing = 60;
        const enemyTypes = [
            // 敵1: ウミガメ
            [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,1,0,0,1,0,0],
                [0,1,1,1,1,1,1,0],
                [0,1,0,1,1,0,1,0],
                [0,1,1,1,1,1,1,0],
                [0,0,1,1,1,1,0,0]
            ],
            // 敵2: ロボット
            [
                [0,0,0,1,1,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,1,1,1,1,1,1,0],
                [1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1],
                [0,0,0,1,1,0,0,0],
                [0,0,0,1,1,0,0,0]
            ],
            // 敵3: ウサギ
            [
                [0,0,0,1,1,0,0,0],
                [0,0,1,0,0,1,0,0],
                [0,1,0,0,0,0,1,0],
                [1,1,1,1,1,1,1,1],
                [0,1,1,1,1,1,1,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,1,1,0,0,0],
                [0,0,0,1,1,0,0,0]
            ],
            // 敵4: ドラゴン
            [
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,1,0,0,0,0,1,0],
                [1,0,0,1,1,0,0,1],
                [1,1,1,1,1,1,1,1],
                [1,0,0,1,1,0,0,1],
                [0,1,0,0,0,0,1,0],
                [0,0,1,1,1,1,0,0]
            ],
            // 敵5: キャラクター
            [
                [0,0,0,0,0,0,0,0],
                [0,1,1,0,0,1,1,0],
                [1,1,1,1,1,1,1,1],
                [0,1,1,1,1,1,1,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,1,1,0,0,0],
                [0,0,0,1,1,0,0,0],
                [0,0,0,1,1,0,0,0]
            ]
        ];
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.enemies.push({
                    x: j * spacing + 50,
                    y: i * spacing + 50,
                    width: 40,
                    height: 40,
                    moveDirection: 1,
                    type: enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
                });
            }
        }
    }

    update() {
        if (this.gameOver) return;
        
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
        
        if (this.keys[' ']) {
            if (this.bullets.length === 0) {
                this.bullets.push({
                    x: this.player.x + this.player.width / 2,
                    y: this.player.y,
                    width: 5,
                    height: 15,
                    speed: 10
                });
            }
            this.keys[' '] = false;
        }

        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) return false;
            
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                if (this.checkCollision(bullet, enemy)) {
                    this.enemies.splice(i, 1);
                    this.score += 10;
                    return false;
                }
            }
            return true;
        });

        this.enemies.forEach(enemy => {
            enemy.x += enemy.moveDirection * 2;
            
            if (enemy.x <= 0 || enemy.x + enemy.width >= this.canvas.width) {
                enemy.moveDirection *= -1;
                enemy.y += 20;
            }
        });

        if (this.enemies.some(enemy => enemy.y + enemy.height >= this.canvas.height)) {
            this.gameOver = true;
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        this.ctx.fillStyle = '#fff';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        this.ctx.fillStyle = '#ff0000';
        this.enemies.forEach(enemy => {
            const dotSize = 5;
            enemy.type.forEach((row, y) => {
                row.forEach((pixel, x) => {
                    if (pixel === 1) {
                        this.ctx.fillStyle = '#ff0000';
                        this.ctx.fillRect(enemy.x + x * dotSize, enemy.y + y * dotSize, dotSize, dotSize);
                    }
                });
            });
        });

        document.getElementById('score').textContent = this.score;
        
        if (this.gameOver) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('ゲームオーバー', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    checkCollision(a, b) {
        return (a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

new Game();
