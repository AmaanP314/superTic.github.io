let superBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";
let gameActive = true;
let activeMiniBoard = null;

function initializeSuperBoard() {
  let superBoardElement = document.getElementById("super-board");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let miniBoard = document.createElement("div");
      miniBoard.classList.add("board");
      miniBoard.dataset.row = i;
      miniBoard.dataset.col = j;

      for (let k = 0; k < 9; k++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = Math.floor(k / 3);
        cell.dataset.col = k % 3;
        cell.addEventListener("click", () =>
          makeMove(i, j, Math.floor(k / 3), k % 3)
        );
        miniBoard.appendChild(cell);
      }

      superBoardElement.appendChild(miniBoard);
    }
  }
}

function makeMove(superRow, superCol, miniRow, miniCol) {
  if (!gameActive) return;

  if (
    activeMiniBoard !== null &&
    (superRow !== activeMiniBoard[0] || superCol !== activeMiniBoard[1])
  )
    return;

  if (
    superBoard[superRow][superCol] === "" ||
    (miniRow === activeMiniBoard[2] && miniCol === activeMiniBoard[3])
  ) {
    let miniBoard = document.querySelector(
      `.board[data-row="${superRow}"][data-col="${superCol}"]`
    );
    let cell = miniBoard.querySelector(
      `.cell[data-row="${miniRow}"][data-col="${miniCol}"]`
    );
    if (superBoard[miniRow][miniCol] === "" && !checkMiniBoardWin(miniBoard)) {
      activeMiniBoard = [miniRow, miniCol, null, null];
    } else {
      activeMiniBoard = null;
    }

    document.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.remove("active-cell");
    });
    if (activeMiniBoard !== null) {
      let activeMiniBoardElement = document.querySelector(
        `.board[data-row="${activeMiniBoard[0]}"][data-col="${activeMiniBoard[1]}"]`
      );
      activeMiniBoardElement.querySelectorAll(".cell").forEach((cell) => {
        cell.classList.add("active-cell");
      });
    }

    if (cell.innerText === "") {
      cell.innerText = currentPlayer;
      superBoard[superRow][superCol] = checkWinner(miniBoard);

      if (superBoard[superRow][superCol] === currentPlayer) {
        miniBoard.classList.add("winner");
        markWinningCells(miniBoard, currentPlayer);
        document.getElementById(
          "message"
        ).innerText = `${currentPlayer} wins the board!`;
      } else if (superBoard[superRow][superCol] === "draw") {
        document.getElementById("message").innerText = `Board is a draw!`;
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById(
          "message"
        ).innerText = `${currentPlayer}'s turn`;
      }

      if (checkWinner(superBoardElement) || checkDraw()) {
        document.getElementById(
          "message"
        ).innerText = `${currentPlayer} wins the game!`;
        gameActive = false;
      }
    }
  }
}

function markWinningCells(miniBoard, player) {
  let cells = miniBoard.getElementsByClassName("cell");
  let board = [];

  for (let i = 0; i < 9; i += 3) {
    board.push([cells[i], cells[i + 1], cells[i + 2]]);
  }

  for (let row of board) {
    let winnerCells = row.filter((cell) => cell.innerText === player);
    if (winnerCells.length === 3) {
      winnerCells.forEach((cell) => cell.classList.add("winner"));
    }
  }

  for (let i = 0; i < 3; i++) {
    let winnerCells = [board[0][i], board[1][i], board[2][i]].filter(
      (cell) => cell.innerText === player
    );
    if (winnerCells.length === 3) {
      winnerCells.forEach((cell) => cell.classList.add("winner"));
    }
  }

  let diagonal1 = [board[0][0], board[1][1], board[2][2]];
  let diagonal2 = [board[0][2], board[1][1], board[2][0]];

  let winnerCells1 = diagonal1.filter((cell) => cell.innerText === player);
  if (winnerCells1.length === 3) {
    winnerCells1.forEach((cell) => cell.classList.add("winner"));
  }

  let winnerCells2 = diagonal2.filter((cell) => cell.innerText === player);
  if (winnerCells2.length === 3) {
    winnerCells2.forEach((cell) => cell.classList.add("winner"));
  }
  let winningCells = diagonal1.filter((cell) => cell.innerText === player);
  if (winningCells.length === 3) {
    winningCells.forEach((cell) => cell.classList.add("winner"));
  }

  winningCells = diagonal2.filter((cell) => cell.innerText === player);
  if (winningCells.length === 3) {
    winningCells.forEach((cell) => cell.classList.add("winner"));
  }

  if (winningCells.length === 3) {
    miniBoard.classList.add("winning-board");
  }
}

function checkWinner(boardElement) {
  let cells = boardElement.getElementsByClassName("cell");
  let board = [];

  for (let i = 0; i < 9; i += 3) {
    board.push([
      cells[i].innerText,
      cells[i + 1].innerText,
      cells[i + 2].innerText,
    ]);
  }

  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== "" &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    ) {
      return board[i][0];
    }
  }

  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] !== "" &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    ) {
      return board[0][i];
    }
  }

  if (
    board[0][0] !== "" &&
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2]
  ) {
    return board[0][0];
  }
  if (
    board[0][2] !== "" &&
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0]
  ) {
    return board[0][2];
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        return "";
      }
    }
  }
  return "draw";
}

function checkMiniBoardWin(miniBoard) {
  let cells = miniBoard.getElementsByClassName("cell");
  let board = [];

  for (let i = 0; i < 9; i += 3) {
    board.push([
      cells[i].innerText,
      cells[i + 1].innerText,
      cells[i + 2].innerText,
    ]);
  }

  return checkWinner(miniBoard) !== "";
}

function checkDraw() {
  for (let row of superBoard) {
    for (let cell of row) {
      if (cell === "") {
        return false;
      }
    }
  }
  return true;
}

function resetGame() {
  superBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentPlayer = "X";
  gameActive = true;
  activeMiniBoard = null;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("winner");
  });
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("active-cell");
  });
  document.getElementById("message").innerText = `${currentPlayer}'s turn`;
}

initializeSuperBoard();

/////////////////////////////////////////////////////////////////////////////////////////////////
