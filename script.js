// Game Generator
const games = [
    {
        name: "Snake",
        render: function() {
            return `
                <h2>Snake Game</h2>
                <div id="snake-game">
                    <canvas id="snake-canvas" width="400" height="400"></canvas>
                    <p>Use W, A, S, D keys to move the snake. Eat fruit to grow.</p>
                    <p>Score: <span id="snake-score">0</span></p>
                    <p>High Score: <span id="snake-high-score">0</span></p>
                    <button id="start-snake">Start Game</button>
                </div>
            `;
        },
        init: function() {
            const canvas = document.getElementById('snake-canvas');
            const ctx = canvas.getContext('2d');
            const startBtn = document.getElementById('start-snake');
            const scoreElement = document.getElementById('snake-score');

            const gridSize = 20;
            const tileCount = 20;
            let snake = [{x: 10, y: 10}];
            let fruit = {x: 15, y: 15};
            let dx = 0;
            let dy = 0;
            let score = 0;
            let highScore = 0;
            let gameLoop;

            if (currentUser) {
                highScore = currentUser.data.snakeHighScore || 0;
                document.getElementById('snake-high-score').textContent = highScore;
            }

            function drawGame() {
                clearCanvas();
                moveSnake();
                checkCollision();
                drawSnake();
                drawFruit();
                updateScore();
            }

            function clearCanvas() {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            function moveSnake() {
                const head = {x: snake[0].x + dx, y: snake[0].y + dy};
                snake.unshift(head);
                if (head.x === fruit.x && head.y === fruit.y) {
                    score++;
                    generateFruit();
                } else {
                    snake.pop();
                }
            }

            function checkCollision() {
                const head = snake[0];
                if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                    gameOver();
                }
                for (let i = 1; i < snake.length; i++) {
                    if (head.x === snake[i].x && head.y === snake[i].y) {
                        gameOver();
                    }
                }
            }

            function drawSnake() {
                ctx.fillStyle = 'lime';
                snake.forEach(segment => {
                    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
                });
            }

            function drawFruit() {
                ctx.fillStyle = 'red';
                ctx.fillRect(fruit.x * gridSize, fruit.y * gridSize, gridSize - 2, gridSize - 2);
            }

            function generateFruit() {
                fruit.x = Math.floor(Math.random() * tileCount);
                fruit.y = Math.floor(Math.random() * tileCount);
            }

            function updateScore() {
                score++;
                scoreElement.textContent = score;
                if (currentUser && score > highScore) {
                    highScore = score;
                    document.getElementById('snake-high-score').textContent = highScore;
                    currentUser.data.snakeHighScore = highScore;
                    saveUserData();
                }
            }

            function gameOver() {
                clearInterval(gameLoop);
                alert(`Game Over! Your score: ${score}`);
                if (currentUser && score > highScore) {
                    highScore = score;
                    currentUser.data.snakeHighScore = highScore;
                    saveUserData();
                }
            }

            function startGame() {
                snake = [{x: 10, y: 10}];
                fruit = {x: 15, y: 15};
                dx = 0;
                dy = 0;
                score = 0;
                updateScore();
                if (gameLoop) clearInterval(gameLoop);
                gameLoop = setInterval(drawGame, 100);
            }

            document.addEventListener('keydown', (e) => {
                switch(e.key.toLowerCase()) {
                    case 'w': if (dy === 0) { dx = 0; dy = -1; } break;
                    case 's': if (dy === 0) { dx = 0; dy = 1; } break;
                    case 'a': if (dx === 0) { dx = -1; dy = 0; } break;
                    case 'd': if (dx === 0) { dx = 1; dy = 0; } break;
                }
            });

            startBtn.addEventListener('click', startGame);
        }
    },
    {
        name: "Tic-Tac-Toe",
        render: function() {
            return `
                <h2>Tic-Tac-Toe</h2>
                <div id="tictactoe-game">
                    <div id="tictactoe-board">
                        ${Array(9).fill('').map((_, i) => `<div class="cell" data-index="${i}"></div>`).join('')}
                    </div>
                    <p id="game-status">Player X's turn</p>
                    <button id="reset-tictactoe">Reset Game</button>
                </div>
                <button id="back-to-main">Back to Main Menu</button>
            `;
        },
        init: function() {
            const board = ['', '', '', '', '', '', '', '', ''];
            let currentPlayer = 'X';
            let gameActive = true;

            const cells = document.querySelectorAll('.cell');
            const gameStatus = document.getElementById('game-status');

            const winningCombos = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];

            function handleCellClick(e) {
                const cellIndex = parseInt(e.target.getAttribute('data-index'));

                if (board[cellIndex] !== '' || !gameActive) return;

                board[cellIndex] = currentPlayer;
                e.target.textContent = currentPlayer;

                if (checkWin()) {
                    gameStatus.textContent = `Player ${currentPlayer} wins!`;
                    gameActive = false;
                } else if (checkDraw()) {
                    gameStatus.textContent = "It's a draw!";
                    gameActive = false;
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
                }
            }

            function checkWin() {
                return winningCombos.some(combo => {
                    return combo.every(index => board[index] === currentPlayer);
                });
            }

            function checkDraw() {
                return board.every(cell => cell !== '');
            }

            function resetGame() {
                board.fill('');
                cells.forEach(cell => cell.textContent = '');
                currentPlayer = 'X';
                gameActive = true;
                gameStatus.textContent = "Player X's turn";
            }

            cells.forEach(cell => cell.addEventListener('click', handleCellClick));
            document.getElementById('reset-tictactoe').addEventListener('click', resetGame);
        }
    },
    {
        name: "Memory Game",
        render: function() {
            return `
                <h2>Memory Game</h2>
                <div id="memory-game">
                    <div id="memory-board"></div>
                    <p>Pairs found: <span id="pairs-found">0</span></p>
                    <button id="reset-memory">Reset Game</button>
                </div>
            `;
        },
        init: function() {
            const board = document.getElementById('memory-board');
            const pairsFoundElement = document.getElementById('pairs-found');
            const resetButton = document.getElementById('reset-memory');
            
            const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
            let cards = [...emojis, ...emojis];
            let selectedCards = [];
            let pairsFound = 0;

            function shuffleCards(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            function createBoard() {
                board.innerHTML = '';
                shuffleCards(cards).forEach((emoji, index) => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.dataset.cardIndex = index;
                    card.innerHTML = `
                        <div class="card-inner">
                            <div class="card-front"></div>
                            <div class="card-back">${emoji}</div>
                        </div>
                    `;
                    card.addEventListener('click', flipCard);
                    board.appendChild(card);
                });
            }

            function flipCard() {
                if (selectedCards.length < 2 && !this.classList.contains('flipped')) {
                    this.classList.add('flipped');
                    selectedCards.push(this);

                    if (selectedCards.length === 2) {
                        setTimeout(checkMatch, 500);
                    }
                }
            }

            function checkMatch() {
                const [card1, card2] = selectedCards;
                const isMatch = card1.querySelector('.card-back').textContent === card2.querySelector('.card-back').textContent;

                if (isMatch) {
                    card1.removeEventListener('click', flipCard);
                    card2.removeEventListener('click', flipCard);
                    pairsFound++;
                    pairsFoundElement.textContent = pairsFound;

                    if (pairsFound === emojis.length) {
                        setTimeout(() => alert('Congratulations! You found all pairs!'), 500);
                    }
                } else {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                }

                selectedCards = [];
            }

            function resetGame() {
                pairsFound = 0;
                pairsFoundElement.textContent = pairsFound;
                createBoard();
            }

            resetButton.addEventListener('click', resetGame);
            createBoard();
        }
    },
    {
        name: "Hangman",
        render: function() {
            return `
                <h2>Hangman</h2>
                <div id="hangman-game">
                    <p id="word-display"></p>
                    <p id="guesses-left"></p>
                    <input type="text" id="guess-input" maxlength="1">
                    <button id="guess-button">Guess</button>
                    <p id="hangman-message"></p>
                </div>
            `;
        },
        init: function() {
            const words = ['javascript', 'python', 'html', 'css', 'react'];
            let word = words[Math.floor(Math.random() * words.length)];
            let guessedLetters = [];
            let remainingGuesses = 6;

            const wordDisplay = document.getElementById('word-display');
            const guessesLeft = document.getElementById('guesses-left');
            const guessInput = document.getElementById('guess-input');
            const guessButton = document.getElementById('guess-button');
            const message = document.getElementById('hangman-message');

            function updateDisplay() {
                wordDisplay.textContent = word.split('').map(letter => 
                    guessedLetters.includes(letter) ? letter : '_'
                ).join(' ');
                guessesLeft.textContent = `Guesses left: ${remainingGuesses}`;
            }

            function makeGuess() {
                const guess = guessInput.value.toLowerCase();
                if (guess.length !== 1 || !/[a-z]/.test(guess)) {
                    message.textContent = "Please enter a single letter.";
                    return;
                }
                if (guessedLetters.includes(guess)) {
                    message.textContent = "You already guessed that letter.";
                    return;
                }
                guessedLetters.push(guess);
                if (!word.includes(guess)) {
                    remainingGuesses--;
                }
                updateDisplay();
                checkGameStatus();
                guessInput.value = '';
            }

            function checkGameStatus() {
                if (wordDisplay.textContent.replace(/ /g, '') === word) {
                    message.textContent = "Congratulations! You won!";
                    guessButton.disabled = true;
                } else if (remainingGuesses === 0) {
                    message.textContent = `Game over. The word was "${word}".`;
                    guessButton.disabled = true;
                }
            }

            guessButton.addEventListener('click', makeGuess);
            updateDisplay();
        }
    },
    {
        name: "Rock Paper Scissors",
        render: function() {
            return `
                <h2>Rock Paper Scissors</h2>
                <div id="rps-game">
                    <button class="rps-choice" data-choice="rock">Rock</button>
                    <button class="rps-choice" data-choice="paper">Paper</button>
                    <button class="rps-choice" data-choice="scissors">Scissors</button>
                    <p id="rps-result"></p>
                    <p>Score: <span id="player-score">0</span> - <span id="computer-score">0</span></p>
                </div>
            `;
        },
        init: function() {
            const choices = ['rock', 'paper', 'scissors'];
            let playerScore = 0;
            let computerScore = 0;

            const resultDisplay = document.getElementById('rps-result');
            const playerScoreDisplay = document.getElementById('player-score');
            const computerScoreDisplay = document.getElementById('computer-score');
            const buttons = document.querySelectorAll('.rps-choice');

            function computerPlay() {
                return choices[Math.floor(Math.random() * choices.length)];
            }

            function playRound(playerSelection, computerSelection) {
                if (playerSelection === computerSelection) {
                    return "It's a tie!";
                } else if (
                    (playerSelection === 'rock' && computerSelection === 'scissors') ||
                    (playerSelection === 'paper' && computerSelection === 'rock') ||
                    (playerSelection === 'scissors' && computerSelection === 'paper')
                ) {
                    playerScore++;
                    return "You win!";
                } else {
                    computerScore++;
                    return "Computer wins!";
                }
            }

            function updateScore() {
                playerScoreDisplay.textContent = playerScore;
                computerScoreDisplay.textContent = computerScore;
            }

            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    const playerSelection = this.dataset.choice;
                    const computerSelection = computerPlay();
                    const result = playRound(playerSelection, computerSelection);
                    resultDisplay.textContent = `You chose ${playerSelection}, computer chose ${computerSelection}. ${result}`;
                    updateScore();
                });
            });
        }
    },
    {
        name: "Whack-a-Mole",
        render: function() {
            return `
                <h2>Whack-a-Mole</h2>
                <div id="whack-a-mole">
                    <div id="game-board">
                        ${Array(9).fill().map((_, i) => `<div class="mole-hole" id="hole-${i}"></div>`).join('')}
                    </div>
                    <p>Score: <span id="whack-score">0</span></p>
                    <button id="start-whack">Start Game</button>
                </div>
            `;
        },
        init: function() {
            const holes = document.querySelectorAll('.mole-hole');
            const scoreDisplay = document.getElementById('whack-score');
            const startButton = document.getElementById('start-whack');
            let score = 0;
            let timeUp = false;
            let lastHole;

            function randomTime(min, max) {
                return Math.round(Math.random() * (max - min) + min);
            }

            function randomHole(holes) {
                const idx = Math.floor(Math.random() * holes.length);
                const hole = holes[idx];
                if (hole === lastHole) {
                    return randomHole(holes);
                }
                lastHole = hole;
                return hole;
            }

            function peep() {
                const time = randomTime(200, 1000);
                const hole = randomHole(holes);
                hole.classList.add('up');
                setTimeout(() => {
                    hole.classList.remove('up');
                    if (!timeUp) peep();
                }, time);
            }

            function startGame() {
                scoreDisplay.textContent = 0;
                timeUp = false;
                score = 0;
                peep();
                setTimeout(() => timeUp = true, 10000);
            }

            function whack(e) {
                if (!e.isTrusted) return;
                score++;
                this.classList.remove('up');
                scoreDisplay.textContent = score;
            }

            holes.forEach(hole => hole.addEventListener('click', whack));
            startButton.addEventListener('click', startGame);
        }
    },
    {
        name: "Puzzle Slider",
        render: function() {
            return `
                <h2>Puzzle Slider</h2>
                <div id="puzzle-slider">
                    <div id="puzzle-board"></div>
                    <button id="shuffle-puzzle">Shuffle</button>
                </div>
            `;
        },
        init: function() {
            // Implement puzzle slider game logic here
        }
    },
    {
        name: "Simon Says",
        render: function() {
            return `
                <h2>Simon Says</h2>
                <div id="simon-game">
                    <div id="simon-buttons">
                        <div class="simon-button" id="green"></div>
                        <div class="simon-button" id="red"></div>
                        <div class="simon-button" id="yellow"></div>
                        <div class="simon-button" id="blue"></div>
                    </div>
                    <button id="start-simon">Start Game</button>
                    <button id="restart-simon" disabled>Restart Game</button>
                    <p>Level: <span id="simon-level">0</span></p>
                </div>
            `;
        },
        init: function() {
            const buttons = ['green', 'red', 'yellow', 'blue'];
            let sequence = [];
            let playerSequence = [];
            let level = 0;
            let gameActive = false;

            const simonButtons = document.querySelectorAll('.simon-button');
            const startButton = document.getElementById('start-simon');
            const restartButton = document.getElementById('restart-simon');
            const levelDisplay = document.getElementById('simon-level');

            function startGame() {
                sequence = [];
                playerSequence = [];
                level = 0;
                gameActive = true;
                startButton.disabled = true;
                restartButton.disabled = false;
                nextRound();
            }

            function restartGame() {
                if (gameActive) {
                    gameActive = false;
                    setTimeout(startGame, 1000);
                } else {
                    startGame();
                }
            }

            function nextRound() {
                level++;
                levelDisplay.textContent = level;
                playerSequence = [];
                addToSequence();
                playSequence();
            }

            function addToSequence() {
                const randomColor = buttons[Math.floor(Math.random() * buttons.length)];
                sequence.push(randomColor);
            }

            function playSequence() {
                disableButtons();
                let i = 0;
                const intervalId = setInterval(() => {
                    if (i >= sequence.length) {
                        clearInterval(intervalId);
                        enableButtons();
                        return;
                    }
                    const color = sequence[i];
                    flashButton(color);
                    i++;
                }, 600);
            }

            function flashButton(color) {
                const button = document.getElementById(color);
                button.classList.add('active');
                setTimeout(() => button.classList.remove('active'), 300);
            }

            function handleButtonClick(e) {
                if (!gameActive) return;
                const clickedColor = e.target.id;
                playerSequence.push(clickedColor);
                flashButton(clickedColor);

                if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
                    gameOver();
                    return;
                }

                if (playerSequence.length === sequence.length) {
                    disableButtons();
                    setTimeout(nextRound, 1000);
                }
            }

            function gameOver() {
                gameActive = false;
                alert(`Game Over! You reached level ${level}`);
                startButton.disabled = false;
            }

            function disableButtons() {
                simonButtons.forEach(button => button.removeEventListener('click', handleButtonClick));
            }

            function enableButtons() {
                simonButtons.forEach(button => button.addEventListener('click', handleButtonClick));
            }

            startButton.addEventListener('click', startGame);
            restartButton.addEventListener('click', restartGame);

            // Add these styles to make the game more visually appealing
            simonButtons.forEach(button => {
                button.style.width = '150px';
                button.style.height = '150px';
                button.style.margin = '5px';
                button.style.cursor = 'pointer';
            });

            // Add transition for smooth color change
            const style = document.createElement('style');
            style.textContent = `
                .simon-button {
                    transition: opacity 0.3s ease;
                }
                .simon-button.active {
                    opacity: 1 !important;
                }
            `;
            document.head.appendChild(style);

            // Set initial opacity
            document.getElementById('green').style.opacity = '0.6';
            document.getElementById('red').style.opacity = '0.6';
            document.getElementById('yellow').style.opacity = '0.6';
            document.getElementById('blue').style.opacity = '0.6';
        }
    },
    {
        name: "Minesweeper",
        render: function() {
            return `
                <h2>Minesweeper</h2>
                <div id="minesweeper-game">
                    <div id="minesweeper-board"></div>
                    <button id="new-minesweeper-game">New Game</button>
                </div>
            `;
        },
        init: function() {
            // Implement Minesweeper game logic here
        }
    },
    {
        name: "2048",
        render: function() {
            return `
                <h2>2048</h2>
                <div id="game-2048">
                    <div id="game-header-2048">
                        <div id="score-container-2048">
                            <span>Score:</span>
                            <span id="score-2048">0</span>
                        </div>
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
                scoreDisplay.textContent = score;
                addNewTile();
                addNewTile();
                updateBoard();
            }

            function addNewTile() {
                let available = [];
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (grid[i][j] === 0) {
                            available.push({x: i, y: j});
                        }
                    }
                }
                if (available.length > 0) {
                    let randomSpot = available[Math.floor(Math.random() * available.length)];
                    grid[randomSpot.x][randomSpot.y] = Math.random() < 0.9 ? 2 : 4;
                }
            }

            function updateBoard() {
                board.innerHTML = '';
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        let tile = document.createElement('div');
                        tile.classList.add('tile');
                        tile.dataset.row = i;
                        tile.dataset.col = j;
                        if (grid[i][j] !== 0) {
                            tile.textContent = grid[i][j];
                            tile.classList.add(`tile-${grid[i][j]}`);
                        }
                        board.appendChild(tile);
                    }
                }
                scoreDisplay.textContent = score;
            }

            function move(direction) {
                let moved = false;
                let animations = [];

                if (direction === 'left' || direction === 'right') {
                    for (let i = 0; i < 4; i++) {
                        let row = grid[i];
                        let originalRow = [...row];
                        if (direction === 'left') {
                            row = row.filter(val => val !== 0);
                            for (let j = 0; j < row.length - 1; j++) {
                                if (row[j] === row[j+1]) {
                                    row[j] *= 2;
                                    score += row[j];
                                    row.splice(j+1, 1);
                                }
                            }
                            while (row.length < 4) row.push(0);
                        } else {
                            row = row.filter(val => val !== 0);
                            for (let j = row.length - 1; j > 0; j--) {
                                if (row[j] === row[j-1]) {
                                    row[j] *= 2;
                                    score += row[j];
                                    row.splice(j-1, 1);
                                    row.unshift(0);
                                }
                            }
                            while (row.length < 4) row.unshift(0);
                        }
                        for (let j = 0; j < 4; j++) {
                            if (row[j] !== originalRow[j]) {
                                animations.push({from: {row: i, col: originalRow.indexOf(row[j])}, to: {row: i, col: j}});
                            }
                        }
                        grid[i] = row;
                        if (!moved && !arraysEqual(originalRow, row)) moved = true;
                    }
                } else {
                    for (let j = 0; j < 4; j++) {
                        let column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
                        let originalColumn = [...column];
                        if (direction === 'up') {
                            column = column.filter(val => val !== 0);
                            for (let i = 0; i < column.length - 1; i++) {
                                if (column[i] === column[i+1]) {
                                    column[i] *= 2;
                                    score += column[i];
                                    column.splice(i+1, 1);
                                }
                            }
                            while (column.length < 4) column.push(0);
                        } else {
                            column = column.filter(val => val !== 0);
                            for (let i = column.length - 1; i > 0; i--) {
                                if (column[i] === column[i-1]) {
                                    column[i] *= 2;
                                    score += column[i];
                                    column.splice(i-1, 1);
                                    column.unshift(0);
                                }
                            }
                            while (column.length < 4) column.unshift(0);
                        }
                        for (let i = 0; i < 4; i++) {
                            if (column[i] !== originalColumn[i]) {
                                animations.push({from: {row: originalColumn.indexOf(column[i]), col: j}, to: {row: i, col: j}});
                            }
                            grid[i][j] = column[i];
                        }
                        if (!moved && !arraysEqual(originalColumn, column)) moved = true;
                    }
                }
                if (moved) {
                    animateTiles(animations).then(() => {
                        addNewTile();
                        updateBoard();
                        if (isGameOver()) {
                            alert('Game Over!');
                        }
                    });
                }
            }

            function animateTiles(animations) {
                return new Promise(resolve => {
                    animations.forEach(anim => {
                        const tile = document.querySelector(`.tile[data-row="${anim.from.row}"][data-col="${anim.from.col}"]`);
                        if (tile) {
                            tile.style.transition = 'transform 0.2s ease-in-out';
                            tile.style.transform = `translate(${(anim.to.col - anim.from.col) * 95}px, ${(anim.to.row - anim.from.row) * 95}px)`;
                        }
                    });
                    setTimeout(resolve, 200);
                });
            }

            function arraysEqual(arr1, arr2) {
                return arr1.every((val, index) => val === arr2[index]);
            }

            function isGameOver() {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (grid[i][j] === 0) return false;
                        if (i < 3 && grid[i][j] === grid[i+1][j]) return false;
                        if (j < 3 && grid[i][j] === grid[i][j+1]) return false;
                    }
                }
                return true;
            }

            document.addEventListener('keydown', (e) => {
                switch(e.key.toLowerCase()) {
                    case 'a': case 'arrowleft': move('left'); break;
                    case 'd': case 'arrowright': move('right'); break;
                    case 'w': case 'arrowup': move('up'); break;
                    case 's': case 'arrowdown': move('down'); break;
                }
            });

            newGameButton.addEventListener('click', () => {
                initializeGrid();
            });

            initializeGrid();
        }
    },
    {
        name: "Tetris",
        render: function() {
            return `
                <h2>Tetris</h2>
                <div id="tetris-game">
                    <canvas id="tetris-canvas"></canvas>
                    <div id="tetris-info">
                        <p>Score: <span id="tetris-score">0</span></p>
                        <p>Level: <span id="tetris-level">1</span></p>
                        <button id="start-tetris">Start Game</button>
                    </div>
                </div>
            `;
        },
        init: function() {
            // Implement Tetris game logic here
        }
    },
    {
        name: "Flappy Bird",
        render: function() {
            return `
                <h2>Flappy Bird</h2>
                <div id="flappy-bird-game">
                    <canvas id="flappy-canvas"></canvas>
                    <p>Score: <span id="flappy-score">0</span></p>
                    <button id="start-flappy">Start Game</button>
                </div>
            `;
        },
        init: function() {
            // Implement Flappy Bird game logic here
        }
    },
    {
        name: "Sudoku",
        render: function() {
            return `
                <h2>Sudoku</h2>
                <div id="sudoku-game">
                    <div id="sudoku-board"></div>
                    <button id="check-sudoku">Check Solution</button>
                    <button id="new-sudoku">New Game</button>
                </div>
            `;
        },
        init: function() {
            // Implement Sudoku game logic here
        }
    }
];

const mainContent = document.getElementById("main-content");
const userInfo = document.getElementById("user-info");
let currentUser = null;

function renderMainMenu() {
    return `
        <section id="game-generator">
            <button id="generate-game">Generate Game</button>
        </section>
        ${currentUser ? `
            <button id="logout">Logout</button>
        ` : `
            <button id="login">Login</button>
            <button id="signup">Sign Up</button>
        `}
    `;
}

function renderLoginForm() {
    return `
        <h2>Login</h2>
        <form id="login-form">
            <input type="text" id="login-username" placeholder="Username" required>
            <input type="password" id="login-password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <button id="back-to-main">Back to Main Menu</button>
    `;
}

function renderSignupForm() {
    return `
        <h2>Sign Up</h2>
        <form id="signup-form">
            <input type="text" id="signup-username" placeholder="Username" required>
            <input type="password" id="signup-password" placeholder="Password" required>
            <button type="submit">Sign Up</button>
        </form>
        <button id="back-to-main">Back to Main Menu</button>
    `;
}

function addGenerateButton(content) {
    return `
        ${content}
        <div class="generate-button-container">
            <button id="generate-game">Generate</button>
        </div>
    `;
}

function generateRandomGame() {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    mainContent.innerHTML = addGenerateButton(randomGame.render());
    randomGame.init();
    addEventListeners();
}

function addEventListeners() {
    const generateBtn = document.getElementById("generate-game");
    if (generateBtn) generateBtn.addEventListener("click", generateRandomGame);

    const backButton = document.getElementById("back-to-main");
    if (backButton) backButton.addEventListener("click", renderMain);

    const loginButton = document.getElementById("login");
    if (loginButton) loginButton.addEventListener("click", renderLogin);

    const signupButton = document.getElementById("signup");
    if (signupButton) signupButton.addEventListener("click", renderSignup);

    const logoutButton = document.getElementById("logout");
    if (logoutButton) logoutButton.addEventListener("click", logout);

    const loginForm = document.getElementById("login-form");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    const signupForm = document.getElementById("signup-form");
    if (signupForm) signupForm.addEventListener("submit", handleSignup);
}

function renderMain() {
    mainContent.innerHTML = renderMainMenu();
    addEventListeners();
    updateUserInfo();
}

function renderLogin() {
    mainContent.innerHTML = renderLoginForm();
    addEventListeners();
}

function renderSignup() {
    mainContent.innerHTML = renderSignupForm();
    addEventListeners();
}

// Simulate JSON file operations
const jsonFile = {
    read: function() {
        return JSON.parse(localStorage.getItem("usersData")) || {};
    },
    write: function(data) {
        localStorage.setItem("usersData", JSON.stringify(data));
    }
};

function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    
    const users = jsonFile.read();
    
    if (users[username]) {
        alert("Username already exists");
    } else {
        users[username] = { password, data: {} };
        jsonFile.write(users);
        currentUser = { username, data: {} };
        renderMain();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    
    const users = jsonFile.read();
    
    if (users[username] && users[username].password === password) {
        currentUser = { username, data: users[username].data };
        renderMain();
    } else {
        alert("Invalid username or password");
    }
}

function saveUserData() {
    if (currentUser) {
        const users = jsonFile.read();
        users[currentUser.username].data = currentUser.data;
        jsonFile.write(users);
    }
}

function logout() {
    currentUser = null;
    renderMain();
}

function updateUserInfo() {
    userInfo.innerHTML = currentUser ? `Logged in as: ${currentUser.username}` : '';
}

// Initial setup
renderMain();