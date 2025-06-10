class TetrisGame {
    constructor(terminal) {
        this.terminal = terminal;
        this.width = 30;  // Tripled from 10
        this.height = 60; // Tripled from 20
        this.board = Array(this.height).fill().map(() => Array(this.width).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameRunning = false;
        this.gameInterval = null;
        this.gameContainer = null;
        this.keyHandler = null;
        this.currentPiece = null;
        this.currentX = 0;
        this.currentY = 0;
        this.playerName = '';

        // Enhanced piece designs for larger board
        this.pieces = [
            [[1,1,1,1]], // I - line
            [[1,1],[1,1]], // O - square
            [[0,1,0],[1,1,1]], // T
            [[0,1,1],[1,1,0]], // S
            [[1,1,0],[0,1,1]], // Z
            [[1,0,0],[1,1,1]], // J
            [[0,0,1],[1,1,1]]  // L
        ];
    }

    start() {
        if (this.gameRunning) {
            this.terminal.addOutput('Tetris game already running!', 'secondary');
            return;
        }

        this.gameRunning = true;
        this.board = Array(this.height).fill().map(() => Array(this.width).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;

        this.terminal.addOutput('TETRIS Game Started!', 'accent');
        this.terminal.addOutput('Use WASD keys: A/D = move, S = soft drop, W = rotate. ESC = quit.', 'secondary');
        this.terminal.addOutput('');

        this.spawnPiece();
        this.createGameDisplay();
        this.setupControls();
        this.gameInterval = setInterval(() => this.gameLoop(), Math.max(50, 500 - (this.level - 1) * 50));
    }

    spawnPiece() {
        this.currentPiece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        this.currentX = Math.floor((this.width - this.currentPiece[0].length) / 2);
        this.currentY = 0;

        if (this.isCollision(this.currentPiece, this.currentX, this.currentY)) {
            this.gameOver();
        }
    }

    createGameDisplay() {
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'tetris-game-container';
        this.gameContainer.className = 'output-line';
        
        this.terminal.output.appendChild(this.gameContainer);
        this.updateDisplay();
        this.terminal.scrollToBottom();
    }

    updateDisplay() {
        if (!this.gameContainer) return;

        // Remove any inline centering - let CSS handle positioning
        let display = '<pre class="ascii-art" style="text-align: left; font-size: 9px; line-height: 1; width: fit-content;">';
        
        // Create display board
        const displayBoard = this.board.map(row => [...row]);
        
        // Add current piece to display
        if (this.currentPiece) {
            for (let y = 0; y < this.currentPiece.length; y++) {
                for (let x = 0; x < this.currentPiece[y].length; x++) {
                    if (this.currentPiece[y][x]) {
                        const boardY = this.currentY + y;
                        const boardX = this.currentX + x;
                        if (boardY >= 0 && boardY < this.height && boardX >= 0 && boardX < this.width) {
                            displayBoard[boardY][boardX] = 2; // Current piece
                        }
                    }
                }
            }
        }
        
        // Arcade-style top border with title
        display += '╔' + '═'.repeat(this.width) + '╗\n';
        display += '║' + ' '.repeat(Math.floor((this.width - 6) / 2)) + 'TETRIS' + ' '.repeat(Math.ceil((this.width - 6) / 2)) + '║\n';
        display += '╠' + '═'.repeat(this.width) + '╣\n';
        
        // Game area with enhanced ASCII
        for (let y = 0; y < this.height; y++) {
            display += '║';
            let lineContent = '';
            for (let x = 0; x < this.width; x++) {
                if (displayBoard[y][x] === 2) {
                    lineContent += '▓'; // Current piece - medium shade
                } else if (displayBoard[y][x] === 1) {
                    lineContent += '█'; // Placed blocks - solid
                } else {
                    // Add subtle grid pattern for empty spaces
                    if (y % 3 === 0 && x % 3 === 0) {
                        lineContent += '·';
                    } else {
                        lineContent += ' ';
                    }
                }
            }
            
            // Ensure line is exactly the right width
            if (lineContent.length > this.width) {
                lineContent = lineContent.substring(0, this.width);
            }
            
            display += lineContent + '║\n';
        }
        
        // Arcade-style bottom border
        display += '╚' + '═'.repeat(this.width) + '╝\n';
        display += '</pre>';
        
        display += `<div class="output-line accent" style="text-align: center; font-weight: bold;">`;
        display += `SCORE: ${this.score.toString().padStart(8, '0')} | LEVEL: ${this.level.toString().padStart(2, '0')} | LINES: ${this.lines.toString().padStart(4, '0')}`;
        display += `</div>`;
        
        this.gameContainer.innerHTML = display;
    }

    setupControls() {
        this.keyHandler = (e) => {
            if (!this.gameRunning) return;

            switch(e.key.toLowerCase()) {
                case 'a':
                    this.movePiece(-1, 0);
                    break;
                case 'd':
                    this.movePiece(1, 0);
                    break;
                case 's':
                    this.movePiece(0, 1);
                    break;
                case 'w':
                    this.rotatePiece();
                    break;
                case 'escape':
                    this.stop();
                    break;
            }
            e.preventDefault();
        };

        document.addEventListener('keydown', this.keyHandler);
    }

    movePiece(dx, dy) {
        const newX = this.currentX + dx;
        const newY = this.currentY + dy;
        
        if (!this.isCollision(this.currentPiece, newX, newY)) {
            this.currentX = newX;
            this.currentY = newY;
            this.updateDisplay();
        }
    }

    rotatePiece() {
        const rotated = this.currentPiece[0].map((_, index) =>
            this.currentPiece.map(row => row[index]).reverse()
        );
        
        if (!this.isCollision(rotated, this.currentX, this.currentY)) {
            this.currentPiece = rotated;
            this.updateDisplay();
        }
    }

    isCollision(piece, x, y) {
        for (let py = 0; py < piece.length; py++) {
            for (let px = 0; px < piece[py].length; px++) {
                if (piece[py][px]) {
                    const boardX = x + px;
                    const boardY = y + py;
                    
                    if (boardX < 0 || boardX >= this.width || 
                        boardY >= this.height || 
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    gameLoop() {
        if (!this.gameRunning) return;

        if (!this.isCollision(this.currentPiece, this.currentX, this.currentY + 1)) {
            this.currentY++;
        } else {
            this.placePiece();
            this.clearLines();
            this.spawnPiece();
        }
        
        this.updateDisplay();
    }

    placePiece() {
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    const boardY = this.currentY + y;
                    const boardX = this.currentX + x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = 1;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell === 1)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.width).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            // Enhanced scoring system
            const baseScore = [0, 40, 100, 300, 1200]; // Standard Tetris scoring
            this.score += baseScore[linesCleared] * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            
            // Update game speed with smoother progression
            clearInterval(this.gameInterval);
            const speed = Math.max(30, 400 - (this.level - 1) * 30);
            this.gameInterval = setInterval(() => this.gameLoop(), speed);
        }
    }

    gameOver() {
        this.stop();
        this.terminal.addOutput('');
        this.showGameOverScreen();
    }

    async showGameOverScreen() {
        // Arcade-style game over screen
        const gameOverArt = `
╔════════════════════════════════════════════╗
║                GAME OVER!                  ║
║                                            ║
║               TETRIS                       ║
║                                            ║
║          Final Score: ${this.score.toString().padStart(8, '0')}             ║
║          Level Reached: ${this.level.toString().padStart(2, '0')}                 ║
║          Lines Cleared: ${this.lines.toString().padStart(4, '0')}               ║
╚════════════════════════════════════════════╝`;

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
            
            const originalHandler = this.terminal.handleKeydown.bind(this.terminal);
            let nameInput = '';
            
            const nameHandler = (e) => {
                if (e.key === 'Enter') {
                    this.playerName = nameInput.trim() || 'Anonymous';
                    
                    nameDisplayContainer.textContent = `Name: ${this.playerName}`;
                    this.terminal.addOutput(`Name entered: ${this.playerName}`, 'success');
                    this.terminal.addOutput('');
                    
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
        
        setTimeout(() => this.terminal.focusInput(), 100);
    }

    saveScore() {
        const scores = JSON.parse(localStorage.getItem('tetrisScores') || '[]');
        const newScore = {
            name: this.playerName,
            score: this.score,
            level: this.level,
            lines: this.lines,
            date: new Date().toISOString()
        };
        
        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        scores.splice(10); // Keep only top 10
        
        localStorage.setItem('tetrisScores', JSON.stringify(scores));
        
        this.terminal.addOutput(`Score saved to leaderboard!`, 'success');
        this.terminal.addOutput('Type "leaderboard tetris" to view rankings.', 'secondary');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TetrisGame;
} else {
    window.TetrisGame = TetrisGame;
}
