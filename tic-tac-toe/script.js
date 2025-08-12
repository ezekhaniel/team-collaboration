let peer = null;
let conn = null;
let isHost = false;
let myTurn = false;
let gameActive = false;

// Initialize PeerJS
document.getElementById('hostBtn').addEventListener('click', () => {
    peer = new Peer();
    peer.on('open', (id) => {
        document.getElementById('hostId').innerHTML = `Your Game ID: <strong>${id}</strong>`;
        isHost = true;
    });
    peer.on('connection', handleConnection);
});

document.getElementById('joinBtn').addEventListener('click', () => {
    const hostId = document.getElementById('joinId').value.trim();
    if (!hostId) {
        alert('Please enter a Host ID');
        return;
    }
    peer = new Peer();
    peer.on('open', () => {
        conn = peer.connect(hostId);
        handleConnection(conn);
    });
});

function handleConnection(connection) {
    if (!conn) {
        conn = connection;
    }

    conn.on('open', () => {
        document.getElementById('connection-controls').style.display = 'none';
        document.getElementById('gameBoard').style.display = 'block';
        document.getElementById('resetBtn').style.display = 'block';
        gameActive = true;
        myTurn = isHost;
        updateStatus();
    });

    conn.on('data', (data) => {
        if (data.type === 'move') {
            handleMove(data.index, data.player);
            if (gameActive) {
                myTurn = true;
                updateStatus();
            }
        } else if (data.type === 'reset') {
            resetGame();
        }
    });
}

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
        if (!gameActive || !myTurn || cell.textContent !== '') return;
        
        const index = parseInt(cell.dataset.index);
        const player = isHost ? 'X' : 'O';
        
        handleMove(index, player);
        
        if (conn && conn.open) {
            conn.send({
                type: 'move',
                index: index,
                player: player
            });
        }
        
        if (gameActive) {
            myTurn = false;
            updateStatus();
        }
    });
});

document.getElementById('resetBtn').addEventListener('click', () => {
    resetGame();
    if (conn && conn.open) {
        conn.send({ type: 'reset' });
    }
});

function handleMove(index, player) {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.setAttribute('data-player', player);

    // Check for winner
    if (checkWinner(player)) {
        gameActive = false;
        const isWinner = (isHost && player === 'X') || (!isHost && player === 'O');
        document.getElementById('status').textContent = isWinner ? '🎉 You win!' : '😔 You lose!';
        return;
    }

    // Check for draw
    if (checkDraw()) {
        gameActive = false;
        document.getElementById('status').textContent = "🤝 It's a draw!";
        return;
    }
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

function updateStatus() {
    if (!gameActive) return;
    const status = document.getElementById('status');
    status.textContent = myTurn ? '🎮 Your turn!' : "⌛ Opponent's turn...";
}

function resetGame() {
    gameActive = true;
    myTurn = isHost;
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('winning-cell');
        cell.style.color = "";
    });
    
    updateStatus();
}
