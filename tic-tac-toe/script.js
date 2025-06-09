'use strict';

let currentPlayer = "O";
let won = false;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize status display
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = "Player O's turn";

    // Add click handlers to cells
    document.querySelectorAll('.cell').forEach((cell, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        cell.id = `${row}_${col}`;
        cell.addEventListener('click', () => place(cell));
    });

    // Add reset button handler
    document.querySelector('.reset-button').addEventListener('click', resetGame);
});

function place(box) {
    if (box.innerText !== "" || won) return;
    
    box.innerText = currentPlayer;
    box.style.color = currentPlayer === "O" ? "#2196F3" : "#f44336";
    currentPlayer = currentPlayer === "O" ? "X" : "O";
    document.getElementById("status").innerText = `Player ${currentPlayer}'s turn`;
    
    checkGameBoard();
    checkDraw();
}

function checkGameBoard() {
    for (let i = 0; i <= 2; i++) {
        checkWinner(`${i}_0`, `${i}_1`, `${i}_2`); // Check rows
        checkWinner(`0_${i}`, `1_${i}`, `2_${i}`); // Check columns
    }
    checkWinner("0_0", "1_1", "2_2"); // Check diagonal
    checkWinner("0_2", "1_1", "2_0"); // Check reverse diagonal
}

function checkWinner(first, second, third) {
    const value1 = document.getElementById(first).innerText;
    const value2 = document.getElementById(second).innerText;
    const value3 = document.getElementById(third).innerText;
    
    if (value1 !== "" && value1 === value2 && value1 === value3) {
        document.getElementById("status").innerText = `Player ${value1} wins!`;
        [first, second, third].forEach(id => 
            document.getElementById(id).classList.add('winning-cell')
        );
        won = true;
    }
}

function checkDraw() {
    if (!won) {
        const isDraw = [...document.querySelectorAll('.cell')]
            .every(cell => cell.innerText !== "");
            
        if (isDraw) {
            document.getElementById("status").innerText = "It's a draw!";
        }
    }
}

function resetGame() {
    won = false;
    currentPlayer = "O";
    document.getElementById("status").innerText = "Player O's turn";
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('winning-cell');
    });
}
