'use strict';

let currentPlayer = "O";
let won = false;
let gameActive = true;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize status display
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = "Player O's turn";

    // Add click handlers to cells
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.dataset.index = index;
        cell.addEventListener('click', () => handleMove(index, currentPlayer));
    });

    // Add reset button handler
    document.querySelector('.reset-button').addEventListener('click', resetGame);
});

function handleMove(index, player) {
    const cell = document.querySelector(`[data-index="${index}"]`);
    if (cell.textContent !== '' || !gameActive) return;

    cell.textContent = player;
    cell.style.color = player === 'X' ? '#f44336' : '#2196F3';

    if (checkWinner(player)) {
        gameActive = false;
        document.getElementById('status').textContent = `Player ${player} wins!`;
        return;
    }

    if (checkDraw()) {
        gameActive = false;
        document.getElementById('status').textContent = "It's a draw!";
        return;
    }

    currentPlayer = currentPlayer === "O" ? "X" : "O";
    document.getElementById("status").innerText = `Player ${currentPlayer}'s turn`;
}

function checkWinner(player) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // columns
        [0,4,8], [2,4,6]           // diagonals
    ];

    for (let pattern of winPatterns) {
        const cells = pattern.map(i => document.querySelector(`[data-index="${i}"]`));
        if (cells.every(cell => cell.textContent === player)) {
            cells.forEach(cell => cell.classList.add('winning-cell'));
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return [...document.querySelectorAll('.cell')].every(cell => cell.textContent !== '');
}

function resetGame() {
    won = false;
    gameActive = true;
    currentPlayer = "O";
    document.getElementById("status").innerText = "Player O's turn";

    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('winning-cell');
        cell.style.color = "";
    });
}
