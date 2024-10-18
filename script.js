const games = [
    {
        name: "Guess the Number",
        render: function() {
            return `
                <div id="guess-the-number-container">
                    <h2>Guess the Number</h2>
                    <p>I'm thinking of a number between 1 and 100.</p>
                    <input type="number" id="guessInput" min="1" max="100" placeholder="Enter your guess">
                    <button id="guessButton">Guess</button>
                    <p id="guessResult"></p>
                    <button id="newGameButton" style="display: none;">New Game</button>
                </div>
            `;
        },
        init: function() {
            const guessInput = document.getElementById('guessInput');
            const guessButton = document.getElementById('guessButton');
            const guessResult = document.getElementById('guessResult');
            const newGameButton = document.getElementById('newGameButton');
            
            let targetNumber = Math.floor(Math.random() * 100) + 1;
            let attempts = 0;

            function checkGuess() {
                const userGuess = parseInt(guessInput.value);
                attempts++;

                if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
                    guessResult.textContent = "Please enter a valid number between 1 and 100.";
                    return;
                }

                if (userGuess === targetNumber) {
                    guessResult.textContent = `Congratulations! You guessed the number ${targetNumber} in ${attempts} attempts!`;
                    guessButton.disabled = true;
                    newGameButton.style.display = 'block';
                } else if (userGuess < targetNumber) {
                    guessResult.textContent = "Too low! Try a higher number.";
                } else {
                    guessResult.textContent = "Too high! Try a lower number.";
                }

                guessInput.value = '';
                guessInput.focus();
            }

            function startNewGame() {
                targetNumber = Math.floor(Math.random() * 100) + 1;
                attempts = 0;
                guessResult.textContent = '';
                guessButton.disabled = false;
                newGameButton.style.display = 'none';
                guessInput.value = '';
                guessInput.focus();
            }

            guessButton.addEventListener('click', checkGuess);
            newGameButton.addEventListener('click', startNewGame);
            guessInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    checkGuess();
                }
            });

            // Cleanup function
            return function() {
                guessButton.removeEventListener('click', checkGuess);
                newGameButton.removeEventListener('click', startNewGame);
                guessInput.removeEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        checkGuess();
                    }
                });
            };
        }
    },
    {
        name: "Memory Game",
        render: function() {
            console.log("Rendering Memory Game");
            const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
            const allEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
            
            let boardHTML = '';
            allEmojis.forEach((emoji, index) => {
                boardHTML += `
                    <div class="memory-card" data-card-index="${index}">
                        <div class="memory-card-inner">
                            <div class="memory-card-front"></div>
                            <div class="memory-card-back">${emoji}</div>
                        </div>
                    </div>
                `;
            });

            return `
                <div id="memory-game-container">
                    <h2 style="text-align: center; color: #776e65; font-size: 2rem; margin-bottom: 1rem;">Memory Game</h2>
                    <div id="memoryBoard">${boardHTML}</div>
                    <p id="memoryScore">Pairs found: 0</p>
                </div>
            `;
        },
        init: function() {
            console.log("Initializing Memory Game");
            const board = document.getElementById('memoryBoard');
            const scoreDisplay = document.getElementById('memoryScore');
            let flippedCards = [];
            let matchedPairs = 0;
            const totalPairs = 8;

            function flipCard() {
                console.log("Card clicked", this);
                if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
                    this.classList.add('flipped');
                    flippedCards.push(this);

                    if (flippedCards.length === 2) {
                        setTimeout(checkMatch, 500);
                    }
                }
            }

            function checkMatch() {
                console.log("Checking match");
                const [card1, card2] = flippedCards;
                const isMatch = card1.querySelector('.memory-card-back').textContent === 
                                card2.querySelector('.memory-card-back').textContent;

                if (isMatch) {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    scoreDisplay.textContent = `Pairs found: ${matchedPairs}`;
                    console.log("Match found. Total pairs:", matchedPairs);

                    if (matchedPairs === totalPairs) {
                        console.log("Game won!");
                        setTimeout(() => alert('Congratulations! You won!'), 500);
                    }
                } else {
                    console.log("No match");
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                    }, 1000);
                }

                flippedCards = [];
            }

            const cards = board.querySelectorAll('.memory-card');
            console.log("Number of cards:", cards.length);
            cards.forEach(card => {
                card.addEventListener('click', flipCard);
                console.log("Added click listener to card", card);
            });

            return () => {
                console.log("Cleaning up Memory Game");
                cards.forEach(card => card.removeEventListener('click', flipCard));
            };
        }
    },
    {
        name: "2048",
        render: function() {
            return `
                <div id="game-2048">
                    <div id="game-header-2048">
                        <div id="score-container-2048">
                            <span class="score-label">Score</span>
                            <span id="score-2048">0</span>
                        </div>
                        <h2 class="game-title">2048</h2>
                        <button id="new-game-2048">New Game</button>
                    </div>
                    <div id="board-2048"></div>
                </div>
            `;
        },
        init: function() {
            const board = document.getElementById('board-2048');
            const scoreDisplay = document.getElementById('score-2048');
            const newGameButton = document.getElementById('new-game-2048');
            let grid = [];
            let score = 0;

            function initializeGrid() {
                grid = Array(4).fill().map(() => Array(4).fill(0));
                score = 0;
                updateScore();
                addNewTile();
                addNewTile();
                renderBoard();
            }

            function updateScore() {
                scoreDisplay.textContent = score;
            }

            function addNewTile() {
                const emptyTiles = [];
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (grid[i][j] === 0) {
                            emptyTiles.push({i, j});
                        }
                    }
                }
                if (emptyTiles.length > 0) {
                    const {i, j} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
                    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
                }
            }

            function renderBoard() {
                board.innerHTML = '';
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        const cell = document.createElement('div');
                        cell.className = 'grid-cell';
                        board.appendChild(cell);
                        if (grid[i][j] !== 0) {
                            const tile = document.createElement('div');
                            tile.className = `tile tile-${grid[i][j]}`;
                            tile.textContent = grid[i][j];
                            positionTile(tile, i, j);
                            board.appendChild(tile);
                        }
                    }
                }
            }

            function updateTiles() {
                const tiles = board.querySelectorAll('.tile');
                tiles.forEach(tile => {
                    const value = parseInt(tile.textContent);
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            if (grid[i][j] === value) {
                                positionTile(tile, i, j);
                                return;
                            }
                        }
                    }
                });
            }

            function positionTile(tile, row, col) {
                const cellSize = (board.clientWidth - 75) / 4; // 75px is total gap (15px * 5)
                const left = 15 + col * (cellSize + 15);
                const top = 15 + row * (cellSize + 15);
                tile.style.left = `${left}px`;
                tile.style.top = `${top}px`;
            }

            // Add this function to handle window resizing
            function handleResize() {
                const tiles = board.querySelectorAll('.tile');
                tiles.forEach(tile => {
                    const row = parseInt(tile.style.top) / (tile.offsetHeight + 15);
                    const col = parseInt(tile.style.left) / (tile.offsetWidth + 15);
                    positionTile(tile, row, col);
                });
            }

            // Add event listener for window resize
            window.addEventListener('resize', handleResize);

            function move(direction) {
                let moved = false;
                const newGrid = grid.map(row => [...row]);

                function shiftTiles(row) {
                    const newRow = row.filter(tile => tile !== 0);
                    for (let i = 0; i < newRow.length - 1; i++) {
                        if (newRow[i] === newRow[i + 1]) {
                            newRow[i] *= 2;
                            score += newRow[i]; // Update score when tiles merge
                            newRow.splice(i + 1, 1);
                            moved = true;
                        }
                    }
                    while (newRow.length < 4) {
                        newRow.push(0);
                    }
                    return newRow;
                }

                if (direction === 'left' || direction === 'right') {
                    for (let i = 0; i < 4; i++) {
                        const row = direction === 'left' ? newGrid[i] : newGrid[i].reverse();
                        const newRow = shiftTiles(row);
                        newGrid[i] = direction === 'left' ? newRow : newRow.reverse();
                        if (!moved && !arraysEqual(grid[i], newGrid[i])) moved = true;
                    }
                } else {
                    for (let j = 0; j < 4; j++) {
                        const column = direction === 'up' ? 
                            [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]] :
                            [newGrid[3][j], newGrid[2][j], newGrid[1][j], newGrid[0][j]];
                        const newColumn = shiftTiles(column);
                        for (let i = 0; i < 4; i++) {
                            newGrid[direction === 'up' ? i : 3 - i][j] = newColumn[i];
                        }
                        if (!moved && !arraysEqual(
                            [grid[0][j], grid[1][j], grid[2][j], grid[3][j]],
                            [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]]
                        )) moved = true;
                    }
                }

                if (moved) {
                    grid = newGrid;
                    updateScore(); // Update score display
                    updateTiles();
                    setTimeout(() => {
                        addNewTile();
                        renderBoard();
                        if (isGameOver()) {
                            setTimeout(() => alert('Game Over! Your score: ' + score), 200);
                        }
                    }, 100);
                }
            }

            function arraysEqual(a, b) {
                return a.every((val, index) => val === b[index]);
            }

            function isGameOver() {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (grid[i][j] === 0) return false;
                        if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
                        if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
                    }
                }
                return true;
            }

            function handleKeydown(e) {
                const key = e.key.toLowerCase();
                const keyMap = {
                    'w': 'up',
                    'arrowup': 'up',
                    's': 'down',
                    'arrowdown': 'down',
                    'a': 'left',
                    'arrowleft': 'left',
                    'd': 'right',
                    'arrowright': 'right'
                };
                if (keyMap[key]) {
                    e.preventDefault();
                    move(keyMap[key]);
                }
            }

            window.addEventListener('keydown', handleKeydown);
            newGameButton.addEventListener('click', initializeGrid);
            initializeGrid();

            // Clean up event listeners when switching games
            return () => {
                window.removeEventListener('keydown', handleKeydown);
                window.removeEventListener('resize', handleResize);
            };
        }
    },
    {
        name: "Wordle",
        render: function() {
            return `
                <div id="wordle-container">
                    <div id="wordle-result">
                        <p id="wordle-message"></p>
                        <button id="wordle-restart">Restart Game</button>
                    </div>
                    <div id="wordle-game">
                        <div id="wordle-grid"></div>
                        <div id="wordle-keyboard"></div>
                    </div>
                    <div id="wordle-stats">
                        <h3>Statistics</h3>
                        <div class="stats-container">
                            <div class="stat-item">
                                <span class="stat-value" id="games-played">0</span>
                                <span class="stat-label">Played</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value" id="win-percentage">0</span>
                                <span class="stat-label">Win %</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value" id="current-streak">0</span>
                                <span class="stat-label">Current Streak</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value" id="max-streak">0</span>
                                <span class="stat-label">Max Streak</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        init: function() {
            const grid = document.getElementById('wordle-grid');
            const keyboard = document.getElementById('wordle-keyboard');
            const message = document.getElementById('wordle-message');
            const statsElement = document.getElementById('wordle-stats');
            const restartButton = document.getElementById('wordle-restart');

            const maxAttempts = 6;
            const wordLength = 5;
            let attempts = 0;
            let currentGuess = '';
            let gameOver = false;
            let todaysWord = '';

            // Function to get today's word
            function getTodaysWord() {
                const epoch = new Date(2023, 0, 1).getTime(); // January 1, 2023
                const now = new Date().getTime();
                const daysSinceEpoch = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));
                const words = ['APPLE', 'BRAVE', 'CACTUS', 'DANCE', 'EAGLE', /* ... add more words ... */];
                return words[daysSinceEpoch % words.length];
            }

            // Initialize the game
            function initGame() {
                todaysWord = getTodaysWord();
                attempts = 0;
                currentGuess = '';
                gameOver = false;
                message.textContent = '';
                createGrid();
                createKeyboard();
                updateStats();
            }

            // Create the grid
            function createGrid() {
                grid.innerHTML = '';
                for (let i = 0; i < maxAttempts; i++) {
                    const row = document.createElement('div');
                    row.className = 'wordle-row';
                    for (let j = 0; j < wordLength; j++) {
                        const cell = document.createElement('div');
                        cell.className = 'wordle-cell';
                        row.appendChild(cell);
                    }
                    grid.appendChild(row);
                }
            }

            // Create the keyboard
            function createKeyboard() {
                const keys = [
                    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
                    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
                    'Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'
                ];
                keyboard.innerHTML = '';
                keys.forEach(key => {
                    const button = document.createElement('button');
                    button.textContent = key;
                    button.className = 'keyboard-key';
                    if (key === 'Enter') button.classList.add('enter-key');
                    if (key === '⌫') button.classList.add('backspace-key');
                    button.addEventListener('click', () => handleInput(key));
                    keyboard.appendChild(button);
                });
            }

            // Handle input (keyboard or on-screen keyboard)
            function handleInput(key) {
                if (gameOver) return;

                if (key === 'ENTER') {
                    if (currentGuess.length === wordLength) submitGuess();
                } else if (key === '⌫' || key === 'BACKSPACE') {
                    currentGuess = currentGuess.slice(0, -1);
                } else if (currentGuess.length < wordLength && key.length === 1 && key.match(/[A-Z]/i)) {
                    currentGuess += key.toUpperCase();
                }
                updateGrid();
            }

            // Update the grid display
            function updateGrid() {
                const row = grid.children[attempts];
                for (let i = 0; i < wordLength; i++) {
                    const cell = row.children[i];
                    cell.textContent = currentGuess[i] || '';
                    cell.className = 'wordle-cell' + (currentGuess[i] ? ' filled' : '');
                }
            }

            // Submit the guess
            function submitGuess() {
                const row = grid.children[attempts];
                let correctCount = 0;

                for (let i = 0; i < wordLength; i++) {
                    const cell = row.children[i];
                    const letter = currentGuess[i];
                    const keyButton = keyboard.querySelector(`button:not(.enter-key):not(.backspace-key):nth-child(${letter.charCodeAt(0) - 64})`);

                    if (letter === todaysWord[i]) {
                        cell.classList.add('correct');
                        keyButton.classList.add('correct');
                        correctCount++;
                    } else if (todaysWord.includes(letter)) {
                        cell.classList.add('present');
                        if (!keyButton.classList.contains('correct')) {
                            keyButton.classList.add('present');
                        }
                    } else {
                        cell.classList.add('absent');
                        keyButton.classList.add('absent');
                    }
                }

                attempts++;
                if (correctCount === wordLength) {
                    endGame(true);
                } else if (attempts === maxAttempts) {
                    endGame(false);
                } else {
                    currentGuess = '';
                }
                saveGameState();
            }

            // End the game
            function endGame(won) {
                gameOver = true;
                const resultElement = document.getElementById('wordle-result');
                const messageElement = document.getElementById('wordle-message');
                const keyboardElement = document.getElementById('wordle-keyboard');
                
                messageElement.textContent = won ? 'Congratulations! You guessed the word!' : `Game over. The word was ${todaysWord}.`;
                resultElement.style.display = 'block';
                keyboardElement.style.display = 'none';
                
                updateStats(won);
                saveGameState();
            }

            // Load game state from localStorage
            function loadGameState() {
                const savedState = localStorage.getItem('wordleState');
                if (savedState) {
                    const state = JSON.parse(savedState);
                    if (state.date === new Date().toDateString() && state.word === todaysWord) {
                        attempts = state.attempts;
                        gameOver = state.gameOver;
                        state.guesses.forEach((guess, index) => {
                            currentGuess = guess;
                            updateGrid();
                            submitGuess();
                        });
                        if (gameOver) {
                            message.textContent = state.won ? 'Congratulations! You guessed the word!' : `Game over. The word was ${todaysWord}.`;
                            restartButton.style.display = 'inline-block';
                        }
                    } else {
                        localStorage.removeItem('wordleState');
                        initGame();
                    }
                } else {
                    initGame();
                }
            }

            // Save game state to localStorage
            function saveGameState() {
                const state = {
                    date: new Date().toDateString(),
                    word: todaysWord,
                    attempts,
                    gameOver,
                    guesses: Array.from(grid.children).slice(0, attempts).map(row => 
                        Array.from(row.children).map(cell => cell.textContent).join('')
                    ),
                    won: gameOver && currentGuess === todaysWord
                };
                localStorage.setItem('wordleState', JSON.stringify(state));
            }

            // Update and display statistics
            function updateStats(won = null) {
                let stats = JSON.parse(localStorage.getItem('wordleStats')) || {
                    played: 0,
                    wins: 0,
                    currentStreak: 0,
                    maxStreak: 0
                };

                if (won !== null) {
                    stats.played++;
                    if (won) {
                        stats.wins++;
                        stats.currentStreak++;
                        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
                    } else {
                        stats.currentStreak = 0;
                    }
                    localStorage.setItem('wordleStats', JSON.stringify(stats));
                }

                document.getElementById('games-played').textContent = stats.played;
                document.getElementById('win-percentage').textContent = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
                document.getElementById('current-streak').textContent = stats.currentStreak;
                document.getElementById('max-streak').textContent = stats.maxStreak;

                statsElement.style.display = 'block';
            }

            // Event listener for keyboard input
            function handleKeydown(e) {
                const key = e.key.toUpperCase();
                if (key === 'ENTER' || key === 'BACKSPACE' || (key.length === 1 && key >= 'A' && key <= 'Z')) {
                    e.preventDefault();
                    handleInput(key);
                }
            }

            document.addEventListener('keydown', handleKeydown);

            // Function to restart the game
            function restartGame() {
                const resultElement = document.getElementById('wordle-result');
                const keyboardElement = document.getElementById('wordle-keyboard');
                
                resultElement.style.display = 'none';
                keyboardElement.style.display = 'grid';
                
                initGame();
            }

            // Add event listener for restart button
            restartButton.addEventListener('click', restartGame);

            // Initialize the game
            loadGameState();

            // Clean up event listeners when switching games
            return () => {
                document.removeEventListener('keydown', handleKeydown);
                restartButton.removeEventListener('click', restartGame);
            };
        }
    }
];

const boredButton = document.getElementById('boredButton');
const gameContainer = document.getElementById('gameContainer');
const headerButton = document.getElementById('headerButton');
const message = document.getElementById('message');

let availableGames = [...games];

function startGame() {
    if (availableGames.length === 0) {
        availableGames = [...games];
    }

    const randomIndex = Math.floor(Math.random() * availableGames.length);
    const randomGame = availableGames[randomIndex];
    availableGames.splice(randomIndex, 1);

    loadGame(randomGame);
}

function loadGame(game) {
    console.log("Loading game:", game.name);
    if (typeof window.currentCleanupFunction === 'function') {
        window.currentCleanupFunction();
    }

    gameContainer.innerHTML = game.render();
    console.log("Game rendered");

    window.currentCleanupFunction = game.init();
    console.log("Game initialized");

    // Update Bored Button in header
    headerButton.innerHTML = '<button id="headerBoredButton" class="back-button">Bored Button</button>';
    const headerBoredButton = document.getElementById('headerBoredButton');
    headerBoredButton.addEventListener('click', startGame);

    message.textContent = `Playing: ${game.name}`;
}

// Initial setup
boredButton.addEventListener('click', startGame);