class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
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
        
        this.keys = {};
        
        // キーイベントの設定
        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);
        
        // 敵の配置
        this.createEnemies();
        
        // ゲームループの開始
        this.gameLoop();
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
        
        // プレイヤーの移動
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
        
        // ショット
        if (this.keys[' ']) {
            if (this.bullets.length === 0) { // 弾が0個の時のみ発射
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
        
        // 弾の移動と衝突判定
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) return false;
            
            // 敵との衝突判定
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
        
        // 敵の移動
        this.enemies.forEach(enemy => {
            enemy.x += enemy.moveDirection * 2;
            
            // 敵が端に到達した場合
            if (enemy.x <= 0 || enemy.x + enemy.width >= this.canvas.width) {
                enemy.moveDirection *= -1;
                enemy.y += 20;
            }
        });
        
        // ゲームオーバー判定
        if (this.enemies.some(enemy => enemy.y + enemy.height >= this.canvas.height)) {
            this.gameOver = true;
        }
    }

    draw() {
        // 背景色のクリア
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // プレイヤーの描画
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 弾の描画
        this.ctx.fillStyle = '#fff';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        // 敵の描画
        this.ctx.fillStyle = '#ff0000';
        this.enemies.forEach(enemy => {
            // ドット絵の描画
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
        
        // スコアの更新
        document.getElementById('score').textContent = this.score;
        
        // ゲームオーバー表示
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

// ゲームの開始
new Game();
