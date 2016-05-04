// have a load page that slides down for the person to pick X or O
// usually don't like using jQuery but slideDown is so much easier then writing from scratch
var playerWeapon, difficulty, firstMove;
var hit1 = false;
var hit2 = false;
var hit3 = false;
$(document).ready(function() {
    // slide down the welcome menu and menu options
    //$(".welcome-menu").slideDown(600);
    
    // 4 rows of buttons to click
    $('button').click(function() {     
        if (this.id==="X" || this.id==="O") {
            // handle the case that you've already picked a weapon
            if (hit1) {
                $('#O, #X').css("background-color", "#f2f2f2");
            }
            playerWeapon = this.id;
            $(this).css("background-color", "tomato");
            hit1 = true;
        }
        else if (this.id==="e" || this.id==="h") {
            // again handle the case that it's already been selected
            if (hit2) {
                // clear all background colors
                $('#e, #h').css("background-color", "#f2f2f2");
            }
            
            difficulty = this.id;
            $(this).css("background-color", "tomato");
            hit2 = true;
        }
        else if (this.id==="you" || this.id==="me") {
            if (hit3) {
                $('#you, #me').css("background-color", "#f2f2f2");
            }
            firstMove = true;
            $(this).css("background-color", "tomato");
            hit3 = true;
        }
        else {
            if (weapon!==undefined && difficulty!==undefined && firstMove!==undefined) {
                $(".welcome-menu").slideUp(700);
            }
        }
    });

});

// initialize the board
var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// function to check if there's a win on the board (3 straight X's or 3 straight O's)
// 8 possible ways to win, counting from bottom left to top
function isWin(bd, lt) {
    var w1 = bd[0]===lt && bd[1]===lt && bd[2]===lt;//top row
    var w2 = bd[3]===lt && bd[4]===lt && bd[5]===lt;//mid row
    var w3 = bd[6]===lt && bd[7]===lt && bd[8]===lt;//bottom row
    var w4 = bd[0]===lt && bd[3]===lt && bd[6]===lt;//left col
    var w5 = bd[1]===lt && bd[4]===lt && bd[7]===lt;//mid col
    var w6 = bd[2]===lt && bd[5]===lt && bd[8]===lt;//right col
    var w7 = bd[2]===lt && bd[4]===lt && bd[6]===lt;//diag top to bottom
    var w8 = bd[0]===lt && bd[4]===lt && bd[8]===lt;//diag bottom to top
    // gather the possibilities
    return (w1||w2||w3||w4||w5||w6||w7||w8);
}

// placing a move on the board
function makeMove(board, letter, move) {
    board[move] = letter;
}

// placing a move on the physical board
function showMove(board, move) {
    $('#sq' + move).html(board[move]).hide().fadeIn(100);
}

// checking if a move is free
function isFree(board, move) {
    return board[move]===0;
}

// choose a random number from 1 to n (for easy difficulty)
function chooseRandom(n) {
    return Math.floor(n*Math.random() + 1); 
}

// initialize the CPU 
function cpuPlay() {
    // local variables
    var myWeapon; 
    var localBoard = board.slice(); //copy current board
    
    // x's or o's
    if (weapon==='X') {
        myWeapon = "O";
    }
    else {
        myWeapon = "X";
    }
    
    //if difficulty is easy, just pick the first available place in the count
    if (difficulty==='e') {
        for (var i = 0; i<board.length; i++) {
            if (isFree(board, i)) {
                makeMove(board, myWeapon, i);
                showMove(board, i);
                break;
            }
        }
    }
    // hard difficulty, a little more involved
    else {
        var nextMove; //initialize the next move
        
        // first check if can win in the next move
        for (var i = 0; i<board.length; i++) {
            if (isFree(localBoard, i)) {
                // move on the local board and see if you won
                makeMove(localBoard, myWeapon, i)
                if isWin(localBoard, myWeapon) {
                    nextMove = i;
                }
            }
        }

    }
    
}

// to debug
playerWeapon = 'O'; 
difficulty = 'e';
if (playerWeapon==='X') {
    weapon = 'O';
}
else {
    weapon = 'X';
}


function playerPlay() {
    // get the id from the square class that was pressed
    var id = this.id;
    var move = parseInt(id.slice(-1));
    // check if the board piece is free, if so, write to the board and physical board
    if (isFree(board, move)) {
        makeMove(board, weapon, move);
        showMove(board, move);
        // pass the turn to the cpu
        cpuPlay();
    }
}

// function to check wins on a set interval to simulate a while loop
function checkWin() {
    var count;
    // the computer won
    if (isWin(board, weapon)) {
        // reset the board
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        // reset the squares
        for (var i = 0; i<board.length; i++) {
            $('#sq' + i).html('');
        }
        // put numbers on the board
        // get current count
        count = parseInt($('#computerscore').html());
        $('#computerscore').html(++count);
        // clear highlighting from the user score and highlight computer score
        $('#userscore, #computerscore').css('color', '#ffffe6');
        $('#computerscore').css('color', 'tomato');
    }
    // the player won
    else if (isWin(board, playerWeapon)) {
        // reset the board
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        // reset the squares
        for (var i = 0; i<board.length; i++) {
            $('#sq' + i).html('');
        }   
        // put numbers on the board
        // get current count
        count = parseInt($('#userscore').html());
        $('#userscore').html(++count);
        // clear highlighting from the user score and highlight computer score
        $('#userscore, #computerscore').css('color', '#ffffe6');
        $('#userscore').css('color', 'tomato');
    }
}
setInterval(checkWin, 700);

// every time a square is clicked
$('.square').click(playerPlay);

// if the first move is to the computer, run a cpuPlay first
if (firstMove) {
    cpuPlay();
    firstMove = false; // to avoid multiple plays
}


