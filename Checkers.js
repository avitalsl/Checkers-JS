buildBoard();

// controller
const squares = document.querySelectorAll(".board-container>div.grey");
for (let square of squares) {
    square.addEventListener('click', (event) => {
        let row = event.target.getAttribute('row'), column = event.target.getAttribute('column');
        if (!isCapturePossibleV) {
            if (isExist(row, column)){
                if(isWhite(row, column) == isWhiteTurn){
                    if (isFocus(row, column)){
                        removeFocus(event.target);
                        updateBoardData(row, column, 'focus');
                        pieceInMove = "";
                        isFirstClick = false;
                        return
                    }
                    if (findFocusedPiece() != null) {
                        rowAndColumn = findFocusedPiece();
                        let piece = findPieceByRowAndColumn(rowAndColumn[0], rowAndColumn[1]);
                        updateBoardData(rowAndColumn[0], rowAndColumn[1], 'focus');
                        removeFocus(piece);
                    }
                    focusOnPiece(event.target, isWhiteTurn);
                    pieceInMove = '' + row + column;
                    isFirstClick = true;
                    updateBoardData(row, column, 'focus');
                    return
                } else {return}
            }
        else {
            if (isFirstClick){
                if (isKing(pieceInMove[0], pieceInMove[1])){
                    isCapturePossibleV =  isCapturePossibleF();
                    if (isMoveLegalForKing(row + column)){
                        performMove(pieceInMove , event.target);
                        performCrowning(event.target);
                        updateBoardData(row, column, 'exist', 'isWhite', 'isKing');
                        updateBoardData(pieceInMove[0], pieceInMove[1], 'exist', 'focus', 'isKing');
                        if (pieceToCaptureV != ''){
                            capturePiece(pieceToCaptureV[0], pieceToCaptureV[1]);
                            updateBoardData(pieceToCaptureV[0], pieceToCaptureV[1], 'exist', 'isKing');
                            if (isCapturePossibleForKing(row + column)){
                                isCapturePossibleV = true;
                                pieceInMove = row + column;
                                return
                            } else {
                                isCapturePossibleV = false;
                                changeTurn();
                                changeStatusBoard();
                                return}
                        } else {
                            if (isCapturePossibleV){
                                burnPiece(pieceMustPerformCapture == pieceInMove? row + column : pieceMustPerformCapture);
                                updateBoardData(pieceMustPerformCapture[0], pieceMustPerformCapture[1], 'exist', 'isKing');
                            }
                        }
                    } else {return}
                }
                isCapturePossibleV = isCapturePossibleF();
                if (isMoveLegal(event.target)){
                    performMove(pieceInMove, event.target);
                    if (isCapturePossibleV) {
                        if (pieceMustPerformCapture == pieceInMove){
                            pieceMustPerformCapture = row + column;
                            burnPiece(pieceMustPerformCapture);
                            updateBoardData(pieceMustPerformCapture[0], pieceMustPerformCapture[1], 'isKing');
                        } else {
                            burnPiece(pieceMustPerformCapture);
                            updateBoardData(pieceMustPerformCapture[0], pieceMustPerformCapture[1], 'exist', 'isKing');
                            updateBoardData(pieceInMove[0], pieceInMove[1], 'exist', 'focus');
                            updateBoardData(row, column, 'exist', 'isWhite');
                        }
                    } else {
                        updateBoardData(pieceInMove[0], pieceInMove[1], 'exist', 'focus');
                        updateBoardData(row, column, 'exist', 'isWhite');
                    }
                    if (isCrowning(row)){
                        performCrowning(event.target);
                        updateBoardData(row, column, 'isKing');
                    }
                    changeTurn();
                    changeStatusBoard();
                    return
                }
                if (isCaptureLegal(pieceInMove, row + column)) {
                    performMove(pieceInMove, event.target);
                    capturePiece(pieceToCaptureV[0], pieceToCaptureV[1]);
                    updateBoardData(pieceInMove[0], pieceInMove[1], 'exist', 'focus');
                    updateBoardData(event.target.getAttribute('row'), event.target.getAttribute('column'), 'exist', 'isWhite');
                    updateBoardData(pieceToCaptureV[0], pieceToCaptureV[1], 'exist', 'isKing');
                    isCapturePossibleV = isMultipleCapturePosibble(event.target);
                    if (isCapturePossibleV){
                        pieceInMove = event.target.getAttribute('row') + event.target.getAttribute('column');
                        return
                    }
                } else {
                    if (isCapturePossibleV){
                        burnPiece(pieceMustPerformCapture);
                        updateBoardData(pieceMustPerformCapture[0], pieceMustPerformCapture[1], 'exist', 'isKing')
                    } else {return}       
                }      
                if (isCrowning(row)){
                    performCrowning(event.target);
                    updateBoardData(event.target.getAttribute('row'), event.target.getAttribute('column'), 'isKing');
                }
                changeTurn();
                changeStatusBoard();
            } else {return}

        }
        } else {
            if (isMultipleCaptureLegal(pieceMustPerformCapture[0], pieceMustPerformCapture[1], row, column)){
                performMove(pieceMustPerformCapture, event.target);
                if (isKing(pieceInMove[0], pieceInMove[1])) {
                    performCrowning(event.target)}
                capturePiece(pieceToCaptureV[0], pieceToCaptureV[1]);
                updateBoardData(pieceMustPerformCapture[0], pieceMustPerformCapture[1], 'exist', 'focus');
                updateBoardData(event.target.getAttribute('row'), event.target.getAttribute('column'), 'exist', 'isWhite', 'isKing');
                updateBoardData(pieceToCaptureV[0], pieceToCaptureV[1], 'exist', 'isKing');
                isCapturePossibleV = isMultipleCapturePosibble(event.target);
                if (!isCapturePossibleV) {
                    if (isCrowning(row)){
                        performCrowning(event.target);
                        updateBoardData(event.target.getAttribute('row'), event.target.getAttribute('column'), 'isKing');
                    }
                    changeTurn();
                    changeStatusBoard();
                    return
                }
            }
        }
        
    })
}


// model
/// variables
let gameBoardData = [
    [{}, {exist: true, isWhite: false, isKing: false, focus: false}, {}, {exist: true, isWhite: false, isKing: false, focus: false}, {}, {exist : true, isWhite: false, isKing: false, focus: false}, {}, {exist: true, isWhite: false, isKing: false, focus: false}],
    [{exist: true, isWhite: false, isKing: false, focus: false}, {}, {exist: true, isWhite: false, isKing: false, focus: false}, {}, {exist: true, isWhite: false, isKing: false, focus: false}, {}, {exist: true, isWhite: false, isKing: false, focus: false}, {}],
    [{}, {exist: true, isWhite: false, isKing: false, focus: false}, {}, {exist: true, isWhite: false, isKing: false, focus: false}, {}, {exist: true, isWhite: false, isKing: false, focus: false}, {}, {exist: true, isWhite: false, isKing: false, focus: false}],
    [{exist: false, isWhite: true, isKing: false, focus: false}, {}, {exist: false, isWhite: true, isKing: false, focus: false}, {}, {exist: false, isWhite: true, isKing: false, focus: false}, {}, {exist: false, isWhite: true, isKing: false, focus: false}, {}],
    [{}, {exist: false, isWhite: true, isKing: false, focus: false}, {}, {exist: false, isWhite: true, isKing: false, focus: false}, {}, {exist: false, isWhite: true, isKing: false, focus: false}, {}, {exist: false, isWhite: true, isKing: false, focus: false}],
    [{exist: true, isWhite: true, isKing: false, focus: false}, {}, {exist: true, isWhite: true, isKing: false, focus: false}, {}, {exist: true, isWhite: true, isKing: false, focus: false}, {}, {exist: true, isWhite: true, isKing: false, focus: false}, {}],
    [{}, {exist: true, isWhite: true, isKing: false, focus: false}, {}, {exist: true, isWhite: true, isKing: false, focus: false}, {}, {exist: true, isWhite: true, isKing: false, focus: false}, {}, {exist: true, isWhite: true, isKing: false, focus: false}],
    [{exist: true, isWhite: true, isKing: false, focus: false}, {}, {exist: true, isWhite: true, isKing: false, focus: false}, {}, {exist: true, isWhite: true, isKing: false, focus: false}, {}, {exist: true, isWhite: true, isKing: false, focus: false}, {}]
]
let isFirstClick = false;
let isFirstCapture = false;
let pieceInMove;
let isCapturePossibleV = false;
let isWhiteTurn = true;
let pieceToCaptureV = '';
let pieceMustPerformCapture = '';

/// functions
function isCapturePossibleF(){
    for (let pRow = 0; pRow < 8; pRow++){
        for (let pColumn = 0; pColumn < 8; pColumn++){
            if (gameBoardData[pRow][pColumn] != null &&
                 gameBoardData[pRow][pColumn].exist &&
                 gameBoardData[pRow][pColumn].isWhite == isWhiteTurn){
                     if (isKing(pRow, pColumn)){
                         if(isCapturePossibleForKing('' + pRow + pColumn)){
                             isCapturePossibleV = true;
                             return true
                         } else {return false}
                     }
                     for (let destRow = 0; destRow < 8; destRow++){
                         for (let destColumn = 0; destColumn < 8; destColumn++){
                             if (gameBoardData[destRow][destColumn].exist != null &&
                                !gameBoardData[destRow][destColumn].exist){
                                    pieceToCaptureV = "";
                                    if(isCaptureLegal('' + pRow + pColumn, '' + destRow + destColumn)){
                                        isCapturePossibleV = true;
                                        pieceMustPerformCapture = '' + pRow + pColumn;
                                        return true
                                    }
                                }
                         }
                     }
                 }
        }
    }
    return false
}

function isCapturePossibleForKing(piece){
    for (let pRow = 0; pRow < 8; pRow++){
        for (let pColumn = 0; pColumn < 8; pColumn++){
            if (gameBoardData[pRow][pColumn] != null &&
                isExist(pRow, pColumn) &&
                isKing(pRow, pColumn) &&
                isWhite(pRow, pColumn) == isWhiteTurn){
                    for (let destRow = 0; destRow < 8; destRow++){
                        for (let destColumn = 0; destColumn < 8; destColumn++){
                            pieceToCaptureV = '';
                            if (!isExist(destRow, destColumn)){
                                if (piece){
                                    if (isMoveLegalForKing('' + destRow + destColumn, piece)){
                                        if (pieceToCaptureV != '') {
                                            pieceMustPerformCapture = '' + piece[0] + piece[1];
                                            return true}
                                    }
                                } else {
                                    if (isMoveLegalForKing('' + destRow + destColumn, '' + pRow + pColumn)){
                                        if (pieceToCaptureV != '') {
                                            pieceMustPerformCapture = '' + pRow + pColumn;
                                            return true}
                                    }
                                }
                            }
                        }
                    }    
                }
        }
    }
    pieceToCaptureV = '';
    return false            
}

function isMultipleCapturePosibble(piece){
    let pRow = parseInt(piece.getAttribute('row'));
    let pColumn = parseInt(piece.getAttribute('column'));
    let possibleDestinations = [
        [pRow - 2, pColumn - 2],
        [pRow - 2, pColumn + 2], 
        [pRow + 2, pColumn - 2],
        [pRow + 2, pColumn + 2]
    ];
    for (let i = 0; i < 4; i++){
        if (possibleDestinations[i][0] >= 0 && possibleDestinations[i][1] >= 0 &&
            possibleDestinations[i][0] <= 7 && possibleDestinations[i][1] <= 7){
            if (!gameBoardData[possibleDestinations[i][0]][possibleDestinations[i][1]].exist){
                if (isMultipleCaptureLegal(pRow, pColumn, possibleDestinations[i][0], possibleDestinations[i][1])){
                    isCapturePossibleV = true;
                    pieceMustPerformCapture = '' + pRow + pColumn;
                    return true
                }
            }
        }
    }
    return false
}

function findIndex(piece){
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (gameBoardData[i][j] == piece){
                return '' + i + j
            }
        }
    }
}

function isExist(x, y){
    x = parseInt(x);
    y = parseInt(y);
    if (gameBoardData[x][y] == null) {return false}
    if (gameBoardData[x][y].exist) {return true}
    return false
}

function isWhite(x, y){
    x = parseInt(x);
    y = parseInt(y);
    return gameBoardData[x][y].isWhite
}

function isKing(x, y){
    x = parseInt(x);
    y = parseInt(y);
    return gameBoardData[x][y].isKing
}

function isFocus(x, y){
    x = parseInt(x);
    y = parseInt(y);
    return gameBoardData[x][y].focus
}

function updateBoardData(x, y, property1, property2, property3, property4){
    x = parseInt(x);
    y = parseInt(y);
    let i = 2;
    while(arguments[i] != null){
        if (arguments[i] == 'isWhite'){
            gameBoardData[x][y][arguments[i]] = isWhiteTurn;
        } else if ((arguments[i] == 'isKing')) {
            if (gameBoardData[x][y][arguments[i]]) {
                gameBoardData[x][y][arguments[i]] = false;
            } else {
                if (isCrowning(x) || isKing(pieceInMove[0], pieceInMove[1])){
                    gameBoardData[x][y][arguments[i]] = true;
                }
            }
        } else {
            gameBoardData[x][y][arguments[i]] = !gameBoardData[x][y][arguments[i]];
        }
        i++;
    }
}

function findFocusedPiece(){
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (gameBoardData[i][j].focus){
                return '' + i + j
            }
        }
    }
}

function isMoveLegal(destination){
    if (isStepLegal(destination)) {return true}
}

function isStepLegal(destination){
    let pRow = parseInt(pieceInMove[0]);
    let pColumn = parseInt(pieceInMove[1]);
    let destRow = parseInt(destination.getAttribute('row'));
    let destColumn = parseInt(destination.getAttribute('column'));
    if (!isWhiteTurn == gameBoardData[pRow][pColumn].isWhite)
      {return false}
    if (destRow == (isWhiteTurn ? pRow - 1 : pRow + 1)){
        if (destColumn == pColumn - 1 || destColumn == pColumn +1)
            {return true} 
    } 
}

function isMoveLegalForKing(destination, piece = pieceInMove){
    let pRow = parseInt(piece[0]);
    let pColumn = parseInt(piece[1]);
    let destRow = parseInt(destination[0]);
    let destColumn = parseInt(destination[1]);
    for (let i = destRow, j = destColumn; destRow < pRow ? i <= pRow : i >= pRow; destRow < pRow? i++ : i--, destColumn < pColumn ? j++ : j--){
        if (i == pRow && j == pColumn) {return true}
        if (isExist(i, j)){
            if (!(isWhiteTurn == isWhite(i, j))){
                pieceToCaptureV = '' + i + j;
            } else {return false}
        }
    }
    return false

}

function isCaptureLegal(piece, destination){
    let pRow = parseInt(piece[0]);
    let pColumn = parseInt(piece[1]);
    let destRow = parseInt(destination[0]);
    let destColumn = parseInt(destination[1]);
    piece = gameBoardData[pRow][pColumn];
    destination = gameBoardData[destRow][destColumn];
    if (!(piece.isWhite ? destRow == pRow - 2 : destRow == pRow + 2)){
        if (!isFirstCapture) {return false}
    }
    if (destColumn == pColumn - 2 || destColumn == pColumn + 2){
        pieceToCaptureV = findPieceToCapture('' + pRow + pColumn, '' + destRow + destColumn);
        if (pieceToCaptureV == '') {return false}
        if (gameBoardData[pieceToCaptureV[0]][pieceToCaptureV[1]].isWhite != piece.isWhite)
            {return true}
    } else {return false}
}

function isMultipleCaptureLegal(pRow, pColumn, destRow, destColumn){
    pRow = parseInt(pRow);
    pColumn = parseInt(pColumn);
    destRow = parseInt(destRow);
    destColumn = parseInt(destColumn);
    if (isKing(pRow, pColumn)){
        if (isCapturePossibleForKing('' + pRow + pColumn)){
            return true
        } else {return false}
    }
    if (!(destRow == pRow - 2 || destRow == pRow + 2)){
        return false
    }
    if (destColumn == pColumn - 2 || destColumn == pColumn + 2){
        pieceToCaptureV = findPieceToCapture('' + pRow + pColumn, '' + destRow + destColumn);
        if (pieceToCaptureV == '') {return false}
        if (gameBoardData[pieceToCaptureV[0]][pieceToCaptureV[1]].isWhite != gameBoardData[pRow][pColumn].isWhite)
            {return true}
    } else {return false}
}

function changeTurn(){
    isFirstClick = false;
    isWhiteTurn = !isWhiteTurn;
    pieceInMove = '';
    isCapturePossibleV = false;
    pieceToCaptureV = '';
    pieceMustPerformCapture = '';
}

function findPieceToCapture(piece = pieceInMove, destination){
    let pRow = parseInt(piece[0]);
    let pColumn = parseInt(piece[1]);
    let destRow = parseInt(destination[0]);
    let destColumn = parseInt(destination[1]);
    let pieceToCaptureRow = destRow < pRow ? pRow - 1 : pRow + 1;
    let pieceToCaptureColumn = destColumn < pColumn ? pColumn - 1 : pColumn + 1;
    if (!gameBoardData[pieceToCaptureRow][pieceToCaptureColumn].exist)
        {return ''}
    return '' + pieceToCaptureRow + pieceToCaptureColumn
}

function isCrowning(row){
    if (row == (isWhiteTurn? 0 : 7))
     {return true}
}

function isIndexLegal(x, y){
    if (x >= 0 && y >= 0 && x <= 7 && y <=7) {return true}
    return false
}


// view
let focusClasses = ['focus-white', 'focus-black', 'focus-crowned-white', 'focus-crowned-black'];
let classesToRemove = ['black', 'white', 'piece', 'crowned'];
const pieces = document.querySelectorAll('.piece, .none');
const statusBoard = document.getElementById('game-status-board');
statusBoard.innerHTML = "White turn";

function buildBoard(){
    let board = document.getElementById('board-container');
    let gameBoard = [];
    let isSquareWhite = false;
    for (let i = 0; i < 8; i++){
        isSquareWhite = isSquareWhite ? false : true;       
        gameBoard.push([]);
        for (let j = 0; j < 8; j++){
            const square = document.createElement('div');
            square.classList.add(isSquareWhite? 'white' : 'grey');
            square.setAttribute('row', i);
            square.setAttribute('column', j);
            gameBoard[i].push(square);
            board.appendChild(square);  
            if (!isSquareWhite){
                const piece = document.createElement('div');
                piece.setAttribute('row', i);
                piece.setAttribute('column', j);
                square.appendChild(piece);
                if (i <= 2){
                    piece.classList.add('black', 'piece');
                } else if (i >= 5){
                    piece.classList.add('white', 'piece');
                } else {piece.classList.add('none');}
            }
            isSquareWhite = isSquareWhite ? false : true;     
        }
    }
    let statusBoard = document.getElementById('game-status-board');
    let newElement = document.createElement('div');
    statusBoard.appendChild(newElement);
}

function focusOnPiece(piece, isWhite){
    piece.classList.add(isWhite? 'focus-white':'focus-black');
}

function findPieceByRowAndColumn(row, column){
    for (let piece of pieces){
        if (piece.getAttribute('row') == row && piece.getAttribute('column') == column){
            {return piece}
        }
    }  
}

function removeFocus(piece){
    piece.classList.remove(...focusClasses);
}

function changeFocus(){

}

function performMove(piece, destination){
    piece = findPieceByRowAndColumn(piece[0], piece[1]);
    destination = findPieceByRowAndColumn(destination.getAttribute('row'), destination.getAttribute('column'))
    if (piece.classList.contains('crowned')) {destination.classList.add('crowned')}
    destination.classList.remove('none');
    destination.classList.add(piece.classList.contains('white') ? 'white' : 'black', 'piece')
    piece.classList.add('none');
    piece.classList.remove(...classesToRemove, ...focusClasses);
}

function capturePiece(row, column){
    let piece = findPieceByRowAndColumn(row, column);
    piece.classList.add('none');
    piece.classList.remove(...classesToRemove);
}

function burnPiece(piece){
    let pieceToBurn = findPieceByRowAndColumn(piece[0], piece[1]);
    pieceToBurn.classList.add('none');
    pieceToBurn.classList.remove(...classesToRemove, ...focusClasses);
}

function performCrowning(piece){
    piece.firstElementChild.classList.add('king');
}

function changeStatusBoard(){
    statusBoard.innerHTML = (isWhiteTurn ? 'White' : 'Black') + ' turn';
}