const games = [
    {
        name: "Guess the Number",
        render: function() {
            return `
                <h2>Guess the Number</h2>
                <p>I'm thinking of a number between 1 and 100.</p>
                <input type="number" id="guessInput" min="1" max="100">
                <button id="guessButton">Guess</button>
                <p id="guessResult"></p>
            `;
        },
        init: function() {
            // Guess the Number game logic
            // ... (implement the game logic here)
        }
    },
    {
        name: "Rock Paper Scissors",
        render: function() {
            return `
                <h2>Rock Paper Scissors</h2>
                <button id="rock">Rock</button>
                <button id="paper">Paper</button>
                <button id="scissors">Scissors</button>
                <p id="rpsResult"></p>
            `;
        },
        init: function() {
            // Rock Paper Scissors game logic
            // ... (implement the game logic here)
        }
    },
    {
        name: "Memory Game",
        render: function() {
            return `
                <h2>Memory Game</h2>
                <div id="memoryBoard"></div>
                <p id="memoryScore">Pairs found: 0</p>
            `;
        },
        init: function() {
            // Memory Game logic
            // ... (implement the game logic here)
        }
    },
    {
        name: "2048",
        render: function() {
            return `
                <div id="game-2048">
                    <div id="game-header-2048">
                        <div class="header-item">
                            <div id="score-container-2048">
                                <span class="score-label">Score</span>
                                <span id="score-2048">0</span>
                            </div>
                        </div>
                        <div class="header-item">
                            <h2 class="game-title">2048</h2>
                        </div>
                        <div class="header-item">
                            <button id="new-game-2048">New Game</button>
                        </div>
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
                scoreDisplay.textContent = score;
                addNewTile();
                addNewTile();
                renderBoard();
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
                        const tile = document.createElement('div');
                        tile.className = 'grid-cell';
                        if (grid[i][j] !== 0) {
                            tile.classList.add('tile', `tile-${grid[i][j]}`);
                            tile.textContent = grid[i][j];
                            tile.style.backgroundColor = getTileColor(grid[i][j]);
                            tile.style.color = grid[i][j] > 4 ? '#f9f6f2' : '#776e65';
                        }
                        board.appendChild(tile);
                    }
                }
                scoreDisplay.textContent = score;
            }

            function getTileColor(value) {
                const colors = {
                    2: '#eee4da',
                    4: '#ede0c8',
                    8: '#f2b179',
                    16: '#f59563',
                    32: '#f67c5f',
                    64: '#f65e3b',
                    128: '#edcf72',
                    256: '#edcc61',
                    512: '#edc850',
                    1024: '#edc53f',
                    2048: '#edc22e'
                };
                return colors[value] || '#3c3a32';
            }

            function move(direction) {
                let moved = false;
                const newGrid = grid.map(row => [...row]);

                function shiftTiles(row) {
                    const newRow = row.filter(tile => tile !== 0);
                    for (let i = 0; i < newRow.length - 1; i++) {
                        if (newRow[i] === newRow[i + 1]) {
                            newRow[i] *= 2;
                            score += newRow[i];
                            newRow.splice(i + 1, 1);
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
                    addNewTile();
                    renderBoard();
                    if (isGameOver()) {
                        alert('Game Over!');
                    }
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
            };
        }
    },
    {
        name: "Wordle",
        render: function() {
            return `
                <div id="wordle-game">
                    <div id="wordle-grid"></div>
                    <div id="wordle-keyboard"></div>
                </div>
                <p id="wordle-message"></p>
            `;
        },
        init: function() {
            const words = ['APPLE', 'BRAVE', 'CACTUS', 'DANCE', 'EAGLE']; // Add more words
            const word = words[Math.floor(Math.random() * words.length)];
            let attempts = 0;
            const maxAttempts = 6;
            let currentGuess = '';
            let gameOver = false;

            const grid = document.getElementById('wordle-grid');
            const keyboard = document.getElementById('wordle-keyboard');
            const message = document.getElementById('wordle-message');

            // Create grid
            for (let i = 0; i < maxAttempts; i++) {
                const row = document.createElement('div');
                row.className = 'wordle-row';
                for (let j = 0; j < 5; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'wordle-cell';
                    row.appendChild(cell);
                }
                grid.appendChild(row);
            }

            // Create keyboard
            const keys = [
                'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
                'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
                'Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'
            ];
            keys.forEach(key => {
                const button = document.createElement('button');
                button.textContent = key;
                button.className = 'keyboard-key';
                if (key === 'Enter') button.classList.add('enter-key');
                if (key === '⌫') button.classList.add('backspace-key');
                button.addEventListener('click', () => handleInput(key));
                keyboard.appendChild(button);
            });

            function handleInput(key) {
                if (gameOver) return;

                if (key === 'Enter') {
                    if (currentGuess.length === 5) submitGuess();
                } else if (key === '⌫') {
                    currentGuess = currentGuess.slice(0, -1);
                } else if (currentGuess.length < 5) {
                    currentGuess += key;
                }
                updateGrid();
            }

            function updateGrid() {
                const row = grid.children[attempts];
                for (let i = 0; i < 5; i++) {
                    const cell = row.children[i];
                    cell.textContent = currentGuess[i] || '';
                    cell.className = 'wordle-cell' + (currentGuess[i] ? ' filled' : '');
                }
            }

            function submitGuess() {
                const row = grid.children[attempts];
                let correctCount = 0;
                const letterCounts = {};
                for (let letter of word) {
                    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
                }

                // First pass: mark correct letters
                for (let i = 0; i < 5; i++) {
                    const cell = row.children[i];
                    const letter = currentGuess[i];
                    const keyButton = keyboard.querySelector(`button[data-key="${letter}"]`);

                    if (letter === word[i]) {
                        cell.classList.add('correct');
                        keyButton.classList.add('correct');
                        correctCount++;
                        letterCounts[letter]--;
                    }
                }

                // Second pass: mark present and absent letters
                for (let i = 0; i < 5; i++) {
                    const cell = row.children[i];
                    const letter = currentGuess[i];
                    const keyButton = keyboard.querySelector(`button[data-key="${letter}"]`);

                    if (letter === word[i]) {
                        // Already handled in the first pass
                    } else if (word.includes(letter) && letterCounts[letter] > 0) {
                        cell.classList.add('present');
                        keyButton.classList.add('present');
                        letterCounts[letter]--;
                    } else {
                        cell.classList.add('absent');
                        keyButton.classList.add('absent');
                    }
                }

                attempts++;
                currentGuess = '';

                if (correctCount === 5) {
                    gameOver = true;
                    message.textContent = 'Congratulations! You guessed the word!';
                } else if (attempts === maxAttempts) {
                    gameOver = true;
                    message.textContent = `Game over. The word was ${word}.`;
                }
            }

            function handleKeydown(e) {
                const key = e.key.toUpperCase();
                if (key === 'ENTER' || key === 'BACKSPACE' || (key.length === 1 && key >= 'A' && key <= 'Z')) {
                    handleInput(key === 'BACKSPACE' ? '⌫' : key);
                }
            }

            document.addEventListener('keydown', handleKeydown);

            // Clean up event listener when switching games
            return () => {
                document.removeEventListener('keydown', handleKeydown);
            };
        }
    }
];

const boredButton = document.getElementById('boredButton');
const gameContainer = document.getElementById('gameContainer');

boredButton.addEventListener('click', () => {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    gameContainer.innerHTML = randomGame.render();
    randomGame.init();
});
