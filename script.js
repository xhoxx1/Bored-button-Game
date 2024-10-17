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
