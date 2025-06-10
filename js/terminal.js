class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('command');
        this.cursor = document.getElementById('cursor');
        this.prompt = document.getElementById('prompt');
        
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentTheme = 'dark';
        this.startTime = new Date();
        this.clockInterval = null;
        this.matrixActive = false;
        this.matrixStopHandler = null;
        this.snakeGame = null;
        this.tetrisGame = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showAnimatedWelcome();
        this.focusInput();
        this.updateCursor();
    }
    
    setupEventListeners() {
        // Command input handling
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('input', () => this.updateCursor());
        this.input.addEventListener('keyup', () => this.updateCursor());
        this.input.addEventListener('click', () => this.updateCursor());
        
        // Keep input focused
        document.addEventListener('click', () => this.focusInput());
        this.input.addEventListener('blur', () => {
            setTimeout(() => this.focusInput(), 10);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.scrollToBottom();
            this.updateCursor();
        });
    }
    
    handleKeydown(e) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory('down');
                break;
            case 'Tab':
                e.preventDefault();
                // TODO: Implement tab completion
                break;
        }
    }
    
    executeCommand() {
        const command = this.input.value.trim();
        
        if (command) {
            // Add to history
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
            
            // Display command in output
            this.addOutput(`${this.prompt.textContent} ${command}`, 'command-line');
            
            // Process command
            this.processCommand(command);
        }
        
        // Clear input
        this.input.value = '';
        this.updateCursor();
    }
    
    processCommand(command) {
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        switch(cmd) {
            case 'help':
                this.showHelp(args[0]);
                break;
            case 'clear':
                this.clearOutput();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'projects':
                this.showProjects();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'contact':
                this.showContact();
                break;
            case 'github':
                this.openGithub();
                break;
            case 'linkedin':
                this.openLinkedIn();
                break;
            case 'email':
                this.copyEmail();
                break;
            case 'theme':
                this.changeTheme(args[0]);
                break;
            case 'cowsay':
                this.cowsay(args.join(' '));
                break;
            case 'art':
                this.showArt(args[0]);
                break;
            case 'joke':
                this.showJoke();
                break;
            case 'fortune':
                this.showFortune();
                break;
            case 'stats':
                this.showStats();
                break;
            case 'weather':
                this.showWeather(args[0]);
                break;
            case 'date':
            case 'time':
                this.showDateTime();
                break;
            case 'clock':
                this.toggleClock();
                break;
            case 'cursor':
                this.changeCursor(args[0]);
                break;
            case 'matrix':
                this.startMatrix();
                break;
            case 'loading':
                this.showLoadingDemo();
                break;
            case 'snake':
                this.startSnake();
                break;
            case 'tetris':
                this.startTetris();
                break;
            case 'leaderboard':
            case 'scores':
                this.showLeaderboard(args[0]);
                break;
            default:
                this.addOutput(`Command '${cmd}' not found. Type 'help' to see all available commands.`, 'error');
        }
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        }
        
        this.updateCursor();
        // Set cursor to end of input
        setTimeout(() => {
            this.input.setSelectionRange(this.input.value.length, this.input.value.length);
        }, 0);
    }
    
    updateCursor() {
        // Get the input field position and text width
        const inputValue = this.input.value;
        const inputRect = this.input.getBoundingClientRect();
        const inputLineRect = this.input.parentElement.getBoundingClientRect();
        
        // Create a temporary span to measure text width
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'pre';
        tempSpan.style.fontFamily = getComputedStyle(this.input).fontFamily;
        tempSpan.style.fontSize = getComputedStyle(this.input).fontSize;
        tempSpan.style.fontWeight = getComputedStyle(this.input).fontWeight;
        tempSpan.textContent = inputValue;
        
        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        // Calculate cursor position relative to the input field's left edge
        const inputLeftOffset = inputRect.left - inputLineRect.left;
        this.cursor.style.left = `${inputLeftOffset + textWidth}px`;
        
        // Ensure input field is properly sized
        const minWidth = 100;
        const newWidth = Math.max(textWidth + 20, minWidth);
        this.input.style.width = `${newWidth}px`;
    }
    
    addOutput(text, className = '') {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.scrollToBottom();
    }
    
    addOutputHTML(html, className = '') {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.innerHTML = html;
        this.output.appendChild(line);
        this.scrollToBottom();
    }
    
    clearOutput() {
        this.output.innerHTML = '';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.output.scrollTop = this.output.scrollHeight;
        }, 10);
    }
    
    focusInput() {
        this.input.focus();
        this.updateCursor();
    }
    
    // Command implementations
    showWelcome() {
        const welcomeArt = `
 ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
 ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
    ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
    ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
    ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
                                                                    
        ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
        ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
        ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
        ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
        ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
        ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ 
`;
        
        this.addOutputHTML(welcomeArt, 'ascii-art');
        this.addOutput('');
        this.addOutput('Welcome to my terminal portfolio!', 'accent');
        this.addOutput('Type "help" to see available commands.', 'secondary');
        this.addOutput('');
    }
    
    showHelp(specificCommand) {
        if (specificCommand) {
            this.showSpecificHelp(specificCommand);
        } else {
            this.addOutput('Available commands:', 'accent');
            this.addOutput('');
            this.addOutput('Basic Commands:');
            this.addOutput('  help [command]    - Show this help or help for specific command');
            this.addOutput('  about             - About me');
            this.addOutput('  projects          - My projects');
            this.addOutput('  skills            - Technical skills');
            this.addOutput('  contact           - Contact information');
            this.addOutput('  clear             - Clear terminal');
            this.addOutput('');
            this.addOutput('Social Commands:');
            this.addOutput('  github            - Open GitHub profile');
            this.addOutput('  linkedin          - Open LinkedIn profile');
            this.addOutput('  email             - Copy email to clipboard');
            this.addOutput('');
            this.addOutput('Fun Commands:');
            this.addOutput('  art [name]        - Display ASCII art');
            this.addOutput('  cowsay [text]     - ASCII cow says something');
            this.addOutput('  joke              - Random programming joke');
            this.addOutput('  fortune           - Inspirational quote');
            this.addOutput('');
            this.addOutput('Games:');
            this.addOutput('  snake             - Play ASCII Snake game');
            this.addOutput('  tetris            - Play ASCII Tetris game');
            this.addOutput('  leaderboard [game] - Show high scores (snake/tetris)');
            this.addOutput('');
            this.addOutput('Info Commands:');
            this.addOutput('  stats             - Show site statistics');
            this.addOutput('  weather [city]    - Show weather info');
            this.addOutput('  date/time         - Show current date and time');
            this.addOutput('');
            this.addOutput('Visual Commands:');
            this.addOutput('  clock             - Toggle real-time ASCII clock');
            this.addOutput('  cursor [style]    - Change cursor style (block, line, underscore)');
            this.addOutput('  matrix            - Start matrix animation');
            this.addOutput('  loading           - Show loading animation demo');
            this.addOutput('');
            this.addOutput('Customization:');
            this.addOutput('  theme [name]      - Change color theme');
            this.addOutput('');
            this.addOutput('Use ↑/↓ arrow keys to navigate command history.', 'secondary');
        }
    }
    
    showSpecificHelp(command) {
        const helpTexts = {
            'help': 'help [command] - Shows available commands or detailed help for a specific command',
            'about': 'about - Displays information about the website owner',
            'projects': 'projects - Lists portfolio projects with descriptions',
            'skills': 'skills - Shows technical skills and proficiencies',
            'contact': 'contact - Displays contact information and social links',
            'github': 'github - Opens GitHub profile in a new browser tab',
            'linkedin': 'linkedin - Opens LinkedIn profile in a new browser tab',
            'email': 'email - Copies email address to clipboard',
            'theme': 'theme [name] - Changes color theme. Available: dark, light, dracula, onedark, tokyo, monokai, nord, cyberpunk, hacker, retro, ocean',
            'cowsay': 'cowsay [text] - Displays an ASCII cow saying the provided text',
            'art': 'art [name] - Shows ASCII art. Available: cat, dog, rocket, heart, computer, tree, coffee, skull, diamond, house. Use "art" alone to list all.',
            'joke': 'joke - Displays a random programming or tech joke',
            'fortune': 'fortune - Shows an inspirational quote or programming wisdom',
            'stats': 'stats - Displays site statistics with animated progress bars',
            'weather': 'weather [city] - Shows mock weather information for specified city',
            'date': 'date/time - Displays current date and time information',
            'clear': 'clear - Clears all terminal output'
        };
        
        if (helpTexts[command]) {
            this.addOutput(helpTexts[command], 'accent');
        } else {
            this.addOutput(`No help available for command '${command}'`, 'error');
        }
    }
    
    showAbout() {
        this.addOutput('About Me', 'accent');
        this.addOutput('========', 'accent');
        this.addOutput('');
        this.addOutput('Hi! I\'m a passionate developer who loves creating');
        this.addOutput('innovative solutions and beautiful user experiences.');
        this.addOutput('');
        this.addOutput('This terminal portfolio showcases my work and skills');
        this.addOutput('in a unique, interactive format that reflects my');
        this.addOutput('love for command-line interfaces and retro aesthetics.');
        this.addOutput('');
        this.addOutput('Feel free to explore using the available commands!');
    }
    
    showProjects() {
        this.addOutput('My Projects', 'accent');
        this.addOutput('===========', 'accent');
        this.addOutput('');
        this.addOutput('🚀 Terminal Portfolio Website');
        this.addOutput('   A retro terminal-style portfolio built with vanilla JS');
        this.addOutput('   Features: Multiple themes, games, interactive commands');
        this.addOutput('');
        this.addOutput('🎮 ASCII Games Collection');
        this.addOutput('   Classic games recreated in ASCII art format');
        this.addOutput('   Includes: Snake, Tetris, and more');
        this.addOutput('');
        this.addOutput('🎨 Theme Engine');
        this.addOutput('   Dynamic theming system with 11+ color schemes');
        this.addOutput('   Supports popular editor themes and custom designs');
    }
    
    showSkills() {
        this.addOutput('Technical Skills', 'accent');
        this.addOutput('================', 'accent');
        this.addOutput('');
        this.addOutput('Languages:');
        this.addOutput('  JavaScript/TypeScript  ████████████ 95%', 'secondary');
        this.addOutput('  HTML/CSS              ███████████  90%', 'secondary');
        this.addOutput('  Python                █████████    80%', 'secondary');
        this.addOutput('  Java                  ██████       60%', 'secondary');
        this.addOutput('');
        this.addOutput('Frameworks & Tools:');
        this.addOutput('  React/Next.js         ████████████ 95%', 'secondary');
        this.addOutput('  Node.js               ██████████   85%', 'secondary');
        this.addOutput('  Git/GitHub            ████████████ 95%', 'secondary');
        this.addOutput('  VS Code               ████████████ 95%', 'secondary');
    }
    
    showContact() {
        this.addOutput('Contact Information', 'accent');
        this.addOutput('===================', 'accent');
        this.addOutput('');
        this.addOutput('📧 Email: developer@example.com');
        this.addOutput('🐙 GitHub: github.com/username');
        this.addOutput('💼 LinkedIn: linkedin.com/in/username');
        this.addOutput('🌐 Website: example.com');
        this.addOutput('');
        this.addOutput('Use specific commands to interact:', 'secondary');
        this.addOutput('  email    - Copy email to clipboard');
        this.addOutput('  github   - Open GitHub profile');
        this.addOutput('  linkedin - Open LinkedIn profile');
    }
    
    openGithub() {
        this.addOutput('Opening GitHub profile...', 'success');
        window.open('https://github.com/username', '_blank');
    }
    
    openLinkedIn() {
        this.addOutput('Opening LinkedIn profile...', 'success');
        window.open('https://linkedin.com/in/username', '_blank');
    }
    
    copyEmail() {
        const email = 'developer@example.com';
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                this.addOutput(`Email copied to clipboard: ${email}`, 'success');
            }).catch(() => {
                this.addOutput('Failed to copy email to clipboard', 'error');
                this.addOutput(`Email: ${email}`, 'accent');
            });
        } else {
            this.addOutput('Clipboard not available', 'error');
            this.addOutput(`Email: ${email}`, 'accent');
        }
    }
    
    changeTheme(themeName) {
        const availableThemes = [
            'dark', 'light', 'dracula', 'onedark', 'tokyo', 
            'monokai', 'nord', 'cyberpunk', 'hacker', 'retro', 'ocean'
        ];
        
        if (!themeName) {
            this.addOutput('Available themes:', 'accent');
            availableThemes.forEach(theme => {
                const current = theme === this.currentTheme ? ' (current)' : '';
                this.addOutput(`  ${theme}${current}`, 'secondary');
            });
            return;
        }
        
        if (availableThemes.includes(themeName)) {
            this.currentTheme = themeName;
            document.documentElement.setAttribute('data-theme', themeName);
            this.addOutput(`Theme changed to: ${themeName}`, 'success');
        } else {
            this.addOutput(`Theme '${themeName}' not found.`, 'error');
            this.addOutput('Available themes: ' + availableThemes.join(', '), 'secondary');
        }
    }
    
    cowsay(message) {
        if (!message) {
            message = 'Hello, World!';
        }
        
        const maxWidth = 40;
        const lines = this.wrapText(message, maxWidth);
        const border = '_'.repeat(maxWidth + 2);
        
        let cow = ` ${border}\n`;
        
        if (lines.length === 1) {
            cow += `< ${lines[0].padEnd(maxWidth)} >\n`;
        } else {
            lines.forEach((line, index) => {
                const paddedLine = line.padEnd(maxWidth);
                if (index === 0) {
                    cow += `/ ${paddedLine} \\\n`;
                } else if (index === lines.length - 1) {
                    cow += `\\ ${paddedLine} /\n`;
                } else {
                    cow += `| ${paddedLine} |\n`;
                }
            });
        }
        
        cow += ` ${border}\n`;
        cow += `        \\   ^__^\n`;
        cow += `         \\  (oo)\\_______\n`;
        cow += `            (__)\\       )\\/\\\n`;
        cow += `                ||----w |\n`;
        cow += `                ||     ||\n`;
        
        this.addOutputHTML(`<pre class="ascii-art">${cow}</pre>`);
    }
    
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + word).length <= maxWidth) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }
    
    // New Creative Commands
    showArt(artName) {
        if (!artName) {
            this.addOutput('Available ASCII art:', 'accent');
            this.addOutput('');
            const artNames = Object.keys(ASCII_ART);
            artNames.forEach(name => {
                this.addOutput(`  ${name}`, 'secondary');
            });
            this.addOutput('');
            this.addOutput('Usage: art [name]', 'secondary');
            return;
        }
        
        if (ASCII_ART[artName]) {
            this.addOutputHTML(`<pre class="ascii-art">${ASCII_ART[artName]}</pre>`);
        } else {
            this.addOutput(`ASCII art '${artName}' not found.`, 'error');
            this.addOutput('Type "art" to see available options.', 'secondary');
        }
    }
    
    showJoke() {
        const allJokes = [...PROGRAMMING_JOKES, ...TECH_JOKES];
        const randomJoke = allJokes[Math.floor(Math.random() * allJokes.length)];
        
        this.addOutput('😄 Random Joke:', 'accent');
        this.addOutput('');
        this.addOutput(randomJoke, 'secondary');
        this.addOutput('');
    }
    
    showFortune() {
        const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        
        this.addOutput('🔮 Fortune:', 'accent');
        this.addOutput('');
        this.addOutput(`"${randomFortune}"`, 'secondary');
        this.addOutput('');
    }
    
    showStats() {
        this.addOutput('📊 Site Statistics:', 'accent');
        this.addOutput('================', 'accent');
        this.addOutput('');
        
        // Simulate various statistics with progress bars
        const stats = [
            { label: 'Terminal Efficiency', value: 95 },
            { label: 'Code Quality', value: 88 },
            { label: 'User Experience', value: 92 },
            { label: 'Theme Variety', value: 100 },
            { label: 'Command Coverage', value: 87 },
            { label: 'Responsiveness', value: 94 }
        ];
        
        stats.forEach(stat => {
            const barLength = 20;
            const filled = Math.round((stat.value / 100) * barLength);
            const empty = barLength - filled;
            const bar = '█'.repeat(filled) + '░'.repeat(empty);
            
            this.addOutput(`${stat.label.padEnd(20)} [${bar}] ${stat.value}%`, 'secondary');
        });
        
        this.addOutput('');
        this.addOutput(`Commands executed: ${this.commandHistory.length}`, 'accent');
        this.addOutput(`Current theme: ${this.currentTheme}`, 'accent');
        this.addOutput(`Session uptime: ${this.getUptime()}`, 'accent');
    }
    
    showWeather(city = 'Terminal City') {
        // Mock weather data
        const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Foggy', 'Windy'];
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const temp = Math.floor(Math.random() * 30) + 5; // 5-35°C
        const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
        const wind = Math.floor(Math.random() * 20) + 5; // 5-25 km/h
        
        const weatherIcons = {
            'Sunny': '☀️',
            'Cloudy': '☁️',
            'Rainy': '🌧️',
            'Partly Cloudy': '⛅',
            'Foggy': '🌫️',
            'Windy': '💨'
        };
        
        this.addOutput(`🌤️ Weather in ${city}:`, 'accent');
        this.addOutput('==================', 'accent');
        this.addOutput('');
        this.addOutput(`${weatherIcons[condition]} ${condition}`, 'secondary');
        this.addOutput(`🌡️ Temperature: ${temp}°C`, 'secondary');
        this.addOutput(`💧 Humidity: ${humidity}%`, 'secondary');
        this.addOutput(`💨 Wind: ${wind} km/h`, 'secondary');
        this.addOutput('');
        this.addOutput('Note: This is mock weather data for demonstration.', 'accent');
    }
    
    showDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const time = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        this.addOutput('🕐 Date & Time:', 'accent');
        this.addOutput('==============', 'accent');
        this.addOutput('');
        this.addOutput(`📅 ${date}`, 'secondary');
        this.addOutput(`⏰ ${time}`, 'secondary');
        this.addOutput(`🌍 ${timezone}`, 'secondary');
        this.addOutput('');
        this.addOutput(`Unix timestamp: ${Math.floor(now.getTime() / 1000)}`, 'accent');
    }
    
    getUptime() {
        if (!this.startTime) {
            this.startTime = new Date();
        }
        
        const now = new Date();
        const uptime = now - this.startTime;
        const minutes = Math.floor(uptime / 60000);
        const seconds = Math.floor((uptime % 60000) / 1000);
        
        return `${minutes}m ${seconds}s`;
    }
    
    // Enhanced Welcome with Animation
    showAnimatedWelcome() {
        this.addOutput('Initializing terminal...', 'secondary');
        this.addOutput('');
        
        // Show boot sequence with delays
        this.showBootSequence().then(() => {
            this.addOutput('');
            this.showMainWelcome();
        });
    }
    
    async showBootSequence() {
        const sequence = WELCOME_ART.bootSequence;
        
        for (let i = 0; i < sequence.length; i++) {
            await this.delay(300);
            this.addOutput(sequence[i], 'accent');
            
            // Add progress bar for some steps
            if (i === 1 || i === 3 || i === 5) {
                await this.delay(200);
                await this.showProgressBar();
            }
        }
    }
    
    async showProgressBar() {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'output-line';
        
        const progressSteps = 20;
        for (let i = 0; i <= progressSteps; i++) {
            const filled = '█'.repeat(i);
            const empty = '░'.repeat(progressSteps - i);
            const percent = Math.round((i / progressSteps) * 100);
            
            progressDiv.innerHTML = `[${filled}${empty}] ${percent}%`;
            
            if (i === 0) {
                this.output.appendChild(progressDiv);
            }
            
            await this.delay(50);
            this.scrollToBottom();
        }
    }
    
    showMainWelcome() {
        this.addOutputHTML(`<div style="text-align: left;">${WELCOME_ART.terminal}</div>`, 'ascii-art');
        this.addOutputHTML(`<div style="text-align: left;">${WELCOME_ART.portfolio}</div>`, 'ascii-art');
        this.addOutput('');
        this.addOutput('🎉 Welcome to my interactive terminal portfolio!', 'accent');
        this.addOutput('💻 Type "help" to explore available commands', 'secondary');
        this.addOutput('🎨 Try "theme dracula" to change themes', 'secondary');
        this.addOutput('🕐 Use "clock" to toggle the real-time clock', 'secondary');
        this.addOutput('');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Inline ASCII Clock with live updates - COMPLETELY REWRITTEN
    toggleClock() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
            this.addOutput('🕐 Clock disabled', 'success');
            this.removeInlineClock();
        } else {
            this.clockInterval = setInterval(() => this.updateInlineClockDisplay(), 1000);
            this.addOutput('🕐 Live ASCII clock enabled', 'success');
            this.addOutput('Use "clock" again to disable', 'secondary');
            this.addOutput('');
            this.createInlineClockDisplay();
        }
    }
    
    createInlineClockDisplay() {
        // Create inline clock display in terminal output
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long', 
            day: '2-digit',
            year: 'numeric'
        });
        
        // Create clock container
        const clockContainer = document.createElement('div');
        clockContainer.id = 'inline-clock-container';
        clockContainer.className = 'output-line';
        
        // Generate initial time display
        const timeDisplay = this.generateInlineTimeAscii(timeString);
        
        clockContainer.innerHTML = `
<div class="ascii-art" style="text-align: left;">${timeDisplay}</div>
<div class="output-line secondary" style="margin-top: 10px;">📅 ${dateString}</div>
<div class="output-line secondary">⏰ Live updating every second</div>`;
        
        this.output.appendChild(clockContainer);
        this.scrollToBottom();
    }
    
    updateInlineClockDisplay() {
        const clockContainer = document.getElementById('inline-clock-container');
        if (!clockContainer) return;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long', 
            day: '2-digit',
            year: 'numeric'
        });
        
        // Update only the time display, keep date static unless day changes
        const timeDisplay = this.generateInlineTimeAscii(timeString);
        
        clockContainer.innerHTML = `
<div class="ascii-art" style="text-align: left;">${timeDisplay}</div>
<div class="output-line secondary" style="margin-top: 10px;">📅 ${dateString}</div>
<div class="output-line secondary">⏰ Live updating every second</div>`;
    }
    
    generateInlineTimeAscii(timeString) {
        const chars = timeString.split('');
        const height = 7;
        let result = '<pre>';
        
        for (let row = 0; row < height; row++) {
            let line = '';
            
            chars.forEach(char => {
                const pattern = CLOCK_ART.digits[char] || CLOCK_ART.digits[' '];
                line += pattern[row];
            });
            
            result += line + '\n';
        }
        
        result += '</pre>';
        return result;
    }
    
    removeInlineClock() {
        const clockContainer = document.getElementById('inline-clock-container');
        if (clockContainer) {
            clockContainer.remove();
        }
    }

    // REMOVE ALL OLD CLOCK METHODS - Replace with comments
    /*
    createClockDisplay() {
        // REMOVED - old fixed positioning clock
    }
    
    updateClockDisplay() {
        // REMOVED - old fixed positioning clock
    }
    
    generateTimeAscii() {
        // REMOVED - old clock method
    }
    
    centerText() {
        // REMOVED - old clock method  
    }
    
    removeClock() {
        // REMOVED - old fixed positioning removal
    }
    */

    // Simplified Matrix Animation - runs full duration without stop functionality
    startMatrix() {
        if (this.matrixActive) {
            this.addOutput('Matrix animation already running...', 'secondary');
            return;
        }
        
        this.matrixActive = true;
        this.addOutput('🔰 Starting Matrix animation...', 'accent');
        this.addOutput('');
        
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const width = 60;
        const height = 10;
        const totalFrames = 80; // Increased duration for better experience
        
        let frameCount = 0;
        
        const animate = () => {
            if (frameCount >= totalFrames) {
                this.matrixActive = false;
                this.addOutput('');
                this.addOutput('Matrix animation complete.', 'accent');
                
                // Remove matrix display
                const matrixDiv = document.getElementById('matrix-animation');
                if (matrixDiv) {
                    matrixDiv.remove();
                }
                return;
            }
            
            let frame = '';
            for (let i = 0; i < height; i++) {
                let line = '';
                for (let j = 0; j < width; j++) {
                    line += Math.random() > 0.7 ? chars[Math.floor(Math.random() * chars.length)] : ' ';
                }
                frame += line + '\n';
            }
            
            // Replace last matrix frame or add new one
            const matrixDiv = document.getElementById('matrix-animation') || document.createElement('div');
            matrixDiv.id = 'matrix-animation';
            matrixDiv.className = 'output-line ascii-art';
            matrixDiv.innerHTML = `<pre>${frame}</pre>`;
            
            if (!document.getElementById('matrix-animation')) {
                this.output.appendChild(matrixDiv);
            }
            
            frameCount++;
            setTimeout(animate, 120); // Slightly slower for better visual effect
            this.scrollToBottom();
        };
        
        animate();
    }
    
    // Game Commands
    startSnake() {
        if (!this.snakeGame) {
            this.snakeGame = new SnakeGame(this);
        }
        this.snakeGame.start();
    }

    startTetris() {
        if (!this.tetrisGame) {
            this.tetrisGame = new TetrisGame(this);
        }
        this.tetrisGame.start();
    }

    showLeaderboard(game) {
        if (!game) {
            this.addOutput('🏆 Available Leaderboards:', 'accent');
            this.addOutput('');
            this.addOutput('  leaderboard snake  - Snake game high scores');
            this.addOutput('  leaderboard tetris - Tetris game high scores');
            this.addOutput('');
            this.addOutput('Usage: leaderboard [game]', 'secondary');
            return;
        }

        if (game === 'snake') {
            this.showSnakeLeaderboard();
        } else if (game === 'tetris') {
            this.showTetrisLeaderboard();
        } else {
            this.addOutput(`Unknown game '${game}'. Available: snake, tetris`, 'error');
        }
    }

    showSnakeLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
        
        this.addOutput('SNAKE Game Leaderboard:', 'accent');
        this.addOutput('======================', 'accent');
        this.addOutput('');
        
        if (scores.length === 0) {
            this.addOutput('No scores yet! Play snake to set a record.', 'secondary');
        } else {
            this.addOutput('Rank | Player Name     | Score  | Length | Date      ', 'accent');
            this.addOutput('-----|-----------------|--------|--------|----------', 'secondary');
            
            scores.forEach((score, index) => {
                const date = new Date(score.date).toLocaleDateString();
                const rank = (index + 1).toString().padStart(4, ' ');
                const name = (score.name || 'Anonymous').substring(0, 15).padEnd(15, ' ');
                const points = score.score.toString().padStart(6, ' ');
                const length = score.length.toString().padStart(6, ' ');
                
                this.addOutput(`${rank} | ${name} | ${points} | ${length} | ${date}`, 'secondary');
            });
        }
        this.addOutput('');
    }

    showTetrisLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('tetrisScores') || '[]');
        
        this.addOutput('🧩 Tetris Game Leaderboard:', 'accent');
        this.addOutput('==========================', 'accent');
        this.addOutput('');
        
        if (scores.length === 0) {
            this.addOutput('No scores yet! Play tetris to set a record.', 'secondary');
        } else {
            this.addOutput('Rank | Player Name     | Score    | Level | Lines | Date      ', 'accent');
            this.addOutput('-----|-----------------|----------|-------|-------|----------', 'secondary');
            
            scores.forEach((score, index) => {
                const date = new Date(score.date).toLocaleDateString();
                const rank = (index + 1).toString().padStart(4, ' ');
                const name = (score.name || 'Anonymous').substring(0, 15).padEnd(15, ' ');
                const points = score.score.toString().padStart(8, ' ');
                const level = score.level.toString().padStart(5, ' ');
                const lines = score.lines.toString().padStart(5, ' ');
                
                this.addOutput(`${rank} | ${name} | ${points} | ${level} | ${lines} | ${date}`, 'secondary');
            });
        }
        this.addOutput('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});
