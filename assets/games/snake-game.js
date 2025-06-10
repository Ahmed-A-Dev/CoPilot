class SnakeGame {
    constructor(terminal) {
        this.terminal = terminal;
        this.width = 75;  // Tripled from 25
        this.height = 45; // Tripled from 15
        this.snake = [{ x: 37, y: 22 }]; // Center position
        this.direction = { x: 1, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.gameInterval = null;
        this.gameContainer = null;
        this.keyHandler = null;
        this.playerName = '';
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    start() {
        if (this.gameRunning) {
            this.terminal.addOutput('Snake game already running!', 'secondary');
            return;
        }

        this.gameRunning = true;
        this.snake = [{ x: 37, y: 22 }]; // Center position
        this.direction = { x: 1, y: 0 };
        this.food = this.generateFood();
        this.score = 0;

        this.terminal.addOutput('SNAKE Game Started!', 'accent');
        this.terminal.addOutput('Use WASD keys to move. Press ESC to quit.', 'secondary');
        this.terminal.addOutput('');

        this.createGameDisplay();
        this.setupControls();
        this.gameInterval = setInterval(() => this.gameLoop(), 130);
    }

    createGameDisplay() {
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'snake-game-container';
        this.gameContainer.className = 'output-line';
        
        this.terminal.output.appendChild(this.gameContainer);
        this.updateDisplay();
        this.terminal.scrollToBottom();
    }

    updateDisplay() {
        if (!this.gameContainer) return;

        let display = '<pre class="ascii-art" style="text-align: left; font-size: 10px; line-height: 1; width: fit-content;">';
        
        // Arcade-style top border with title - width matches game area only
        display += '╔' + '═'.repeat(this.width) + '╗\n';
        display += '║' + ' '.repeat(Math.floor((this.width - 5) / 2)) + 'SNAKE' + ' '.repeat(Math.ceil((this.width - 5) / 2)) + '║\n';
        display += '╠' + '═'.repeat(this.width) + '╣\n';
        
        // Game area with enhanced ASCII
        for (let y = 0; y < this.height; y++) {
            display += '║';
            let lineContent = '';
            let foodInLine = false;
            
            for (let x = 0; x < this.width; x++) {
                if (this.snake.some(segment => segment.x === x && segment.y === y)) {
                    if (x === this.snake[0].x && y === this.snake[0].y) {
                        lineContent += '●'; // Head - filled circle
                    } else {
                        lineContent += '○'; // Body - hollow circle
                    }
                } else if (this.food.x === x && this.food.y === y) {
                    lineContent += '◎'; // Food - glowing circle/dot
                    foodInLine = true;
                } else {
                    lineContent += '·'; // Background dots for retro feel
                }
            }
            
            // Ensure line is exactly the right width - no extra characters
            if (lineContent.length > this.width) {
                lineContent = lineContent.substring(0, this.width);
            }
            
            display += lineContent + '║\n';
        }
        
        // Arcade-style bottom border with stats
        display += '╚' + '═'.repeat(this.width) + '╝\n';
        display += '</pre>';
        
        display += `<div class="output-line accent" style="text-align: center; font-weight: bold;">`;
        display += `SCORE: ${this.score.toString().padStart(6, '0')} | LENGTH: ${this.snake.length.toString().padStart(3, '0')} | SPEED: ${Math.min(10, Math.floor(this.score / 50) + 1)}`;
        display += `</div>`;
        
        this.gameContainer.innerHTML = display;
    }

    setupControls() {
        this.keyHandler = (e) => {
            if (!this.gameRunning) return;

            switch(e.key.toLowerCase()) {
                case 'w':
                    if (this.direction.y !== 1) this.direction = { x: 0, y: -1 };
                    break;
                case 's':
                    if (this.direction.y !== -1) this.direction = { x: 0, y: 1 };
                    break;
                case 'a':
                    if (this.direction.x !== 1) this.direction = { x: -1, y: 0 };
                    break;
                case 'd':
                    if (this.direction.x !== -1) this.direction = { x: 1, y: 0 };
                    break;
                case 'escape':
                    this.stop();
                    break;
            }
            e.preventDefault();
        };

        document.addEventListener('keydown', this.keyHandler);
    }

    gameLoop() {
        if (!this.gameRunning) return;

        // Move snake with consistent timing regardless of direction
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            
            // Slightly increase speed as score increases
            if (this.score % 50 === 0) {
                clearInterval(this.gameInterval);
                const newSpeed = Math.max(80, 130 - Math.floor(this.score / 50) * 10);
                this.gameInterval = setInterval(() => this.gameLoop(), newSpeed);
            }
        } else {
            this.snake.pop();
        }

        this.updateDisplay();
    }

    gameOver() {
        this.stop();
        this.terminal.addOutput('');
        this.showGameOverScreen();
    }

    async showGameOverScreen() {
        // Arcade-style game over screen
        const gameOverArt = `
╔══════════════════════════════════════╗
║              GAME OVER!              ║
║                                      ║
║               SNAKE                  ║
║                                      ║
║        Final Score: ${this.score.toString().padStart(6, '0')}           ║
║        Snake Length: ${this.snake.length.toString().padStart(3, '0')}             ║
╚══════════════════════════════════════╝`;

        this.terminal.addOutputHTML(`<pre class="ascii-art accent">${gameOverArt}</pre>`);
        this.terminal.addOutput('');
        
        // Get player name for leaderboard
        await this.getPlayerName();
    }

    async getPlayerName() {
        return new Promise((resolve) => {
            this.terminal.addOutput('Enter your name for the leaderboard:', 'accent');
            this.terminal.addOutput('(Press Enter to submit, max 15 characters)', 'secondary');
            
            // Create persistent name input display element
            const nameDisplayContainer = document.createElement('div');
            nameDisplayContainer.id = 'name-input-display';
            nameDisplayContainer.className = 'output-line accent';
            nameDisplayContainer.textContent = 'Name: _';
            this.terminal.output.appendChild(nameDisplayContainer);
            this.terminal.scrollToBottom();
            
            // Temporarily replace the terminal's key handler
            const originalHandler = this.terminal.handleKeydown.bind(this.terminal);
            let nameInput = '';
            
            const nameHandler = (e) => {
                if (e.key === 'Enter') {
                    this.playerName = nameInput.trim() || 'Anonymous';
                    
                    // Update final display and remove input element
                    nameDisplayContainer.textContent = `Name: ${this.playerName}`;
                    this.terminal.addOutput(`Name entered: ${this.playerName}`, 'success');
                    this.terminal.addOutput('');
                    
                    // Restore original handler
                    this.terminal.input.removeEventListener('keydown', nameHandler);
                    this.terminal.input.addEventListener('keydown', originalHandler);
                    
                    this.saveScore();
                    resolve();
                } else if (e.key === 'Backspace') {
                    nameInput = nameInput.slice(0, -1);
                    this.updateNameDisplay(nameInput, nameDisplayContainer);
                } else if (e.key.length === 1 && nameInput.length < 15) {
                    nameInput += e.key;
                    this.updateNameDisplay(nameInput, nameDisplayContainer);
                }
                e.preventDefault();
            };
            
            this.terminal.input.removeEventListener('keydown', originalHandler);
            this.terminal.input.addEventListener('keydown', nameHandler);
        });
    }

    updateNameDisplay(name, displayElement) {
        // Update the existing element in place
        displayElement.textContent = `Name: ${name}_`;
    }

    stop() {
        this.gameRunning = false;
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }
        
        // Refocus terminal input
        setTimeout(() => this.terminal.focusInput(), 100);
    }

    saveScore() {
        const scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
        const newScore = {
            name: this.playerName,
            score: this.score,
            length: this.snake.length,
            date: new Date().toISOString()
        };
        
        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        scores.splice(10); // Keep only top 10
        
        localStorage.setItem('snakeScores', JSON.stringify(scores));
        
        this.terminal.addOutput(`Score saved to leaderboard!`, 'success');
        this.terminal.addOutput('Type "leaderboard snake" to view rankings.', 'secondary');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnakeGame;
} else {
    window.SnakeGame = SnakeGame;
}
