/*----- constants -----*/
const playerLookup = {
  '1': 'Red',
  '-1': 'Gold',
  'null':'transparent'
};

/*----- app's state (variables) -----*/
let board;    // Array of column arrays with 1, -1, or null
let turn;     // 1 or -1 (player)
let winner;   // 1 = Player 1; -1 = Player 2; 'T' = tie; null = no winner/tie

/*----- cached element references -----*/
const markerEls = Array.from(document.querySelectorAll('#markers > div'));
// OR
// const markerEls = [...document.querySelectorAll('#markers > div')];

const msgEl = document.getElementById('msg')

/*----- event listeners -----*/
document.getElementById('markers')
  .addEventListener('click', handleClick);

/*----- functions -----*/
init();

function init() {
  board = [
    [null, null, null, null, null, null],  // Column 0
    [null, null, null, null, null, null],  // Column 1
    [null, null, null, null, null, null],  // etc.
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null]
  ];
  turn = 1;
  winner = null;
  render();
}

// Transfer all state to the DOM
function render() {
  renderBoard();
  // Render turn or winner message
  if (winner) {
    if (winner === 'T') {
      msgEl.innerHTML = "It's a Tie!";
    } else {
      msgEl.innerHTML = `<span style="color: ${playerLookup[winner]}">${playerLookup[winner].toUpperCase()}</span> Wins!`;
    }
  } else {
    // Render whose turn
    msgEl.innerHTML = `<span style="color: ${playerLookup[turn]}">${playerLookup[turn].toUpperCase()}'s</span> Turn`;
  }
}
function renderBoard() {
  // Render the board
  board.forEach(function(colArr, colIdx) {
    colArr.forEach(function(cell, rowIdx) {
      if (!colArr.includes(null)) markerEls[colIdx].style.visibility = 'hidden';
      const div = document.getElementById(`c${colIdx}r${rowIdx}`);
      div.style.backgroundColor = playerLookup[cell];
    });
  });
}
function handleClick(evt) {
  // Get col index of clicked marker
  const colIdx = markerEls.indexOf(evt.target);
  // Ensure actual col marker was clicked and that the game isn't over
  if (colIdx === -1 || winner) return;
  // Get index of first null in col array
  const colArr = board[colIdx];
  const rowIdx = colArr.indexOf(null);
  if (rowIdx === -1) return;
  // Update the board's column
  colArr[rowIdx] = turn;
  // Calculate winner
  getWinner();
  turn *= -1;
  // turn = turn * -1;
  render();
}
function getWinner() {
  // Iterate through all col arrays until a winner
  for (let colIdx = 0; colIdx < board.length; colIdx++) {
    checkCol(colIdx);
    if (winner) break;
  }
}
function checkCol(colIdx) {
  const colArr = board[colIdx];
  for (let rowIdx = 0; rowIdx < colArr.length; rowIdx++) {
    if (colArr[rowIdx] === null) break;
    if (rowIdx <= 2) winner = checkUp(colArr, rowIdx);
    if (winner) break;
  }
}
function checkUp(colArr, rowIdx) {
  if (Math.abs(colArr[rowIdx] + colArr[rowIdx + 1] + colArr[rowIdx + 2] + colArr[rowIdx + 3]) === 4) {
    return colArr[rowIdx];
  } else {
    return null;
  }
}