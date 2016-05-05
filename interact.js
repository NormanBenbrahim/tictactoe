// have a load page that slides down for the person to pick options
// usually don't like using jQuery but slideDown is so much easier than writing from scratch
var playerWeapon, difficulty, firstMove;
var hit1 = false;
var hit2 = false;
var hit3 = false;
$(document).ready(function() {
    // slide down the welcome menu and menu options
    $(".welcome-menu").slideDown(600);
    
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
            
            $(this).css("background-color", "tomato");
            if (this.id==="me") {
                firstMove = true;
            }
            else {
                firstMove = false;
            }
            hit3 = true;
        }
        // if all variables are set, start the game
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

// function to check if the board is full => tie game
function isTie(board) {
    // return false if there is a free piece on the board
    for (var i = 0; i<board.length; i++) {
        if (isFree(board, i)) {
            return false;
        }
    }
    // if all pieces are taken but someone won on the last move, don't count it as a tie
    if (isWin(board)) {
        return false;
    }
    return true;
}

// function to check that there is a tie, which will be set at an interval every 700ms
function checkTie() {
    if (isTie(board)) {
        // reset the board
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        // reset the squares
        for (var i = 0; i<board.length; i++) {
            $('#sq' + i).html('');
        }
        // color both the userscore and computer score red
        $('#userscore, #computerscore').css('color', 'tomato');
    }
}
setInterval(checkTie, 1300);

// placing a move on the board
function makeMove(brd, ltr, mv) {
    brd[mv] = ltr;
}

// placing a move on the physical board
function showMove(board, move) {
    $('#sq' + move).html(board[move]).hide().fadeIn(100);
}

// checking if a move is free
function isFree(board, move) {
    return board[move]===0;
}

// computer move 
function cpuPlay() {
    // local variables
    var myWeapon; 
    
    // x's or o's
    if (playerWeapon==='X') {
        myWeapon = "O";
    }
    else {
        myWeapon = "X";
    }
    
    //if difficulty is easy, just pick a random board piece that is avaialble
    if (difficulty==='e') {
        var options = [];
        for (var i = board.length; i>0; i--) {
            if (isFree(board, i)) {
                options.push(i);
            }
        }
        // now pick a random number from 0 to options.length for the index
        var o = Math.floor((options.length)*Math.random());
        var n = options[o];
        makeMove(board, myWeapon, n);
        showMove(board, n);
        return;
    }
    // hard difficulty, a little more involved
    else {
        var localBoard;
        // first check if cpu can win in the next move
        for (var i = 0; i<board.length; i++) {
            // create a copy of the board to write on to
            localBoard = board.slice();
            if (isFree(localBoard, i)) {
                // move on the local board and see if you won
                makeMove(localBoard, myWeapon, i);
                if (isWin(localBoard, myWeapon)) {
                    makeMove(board, myWeapon, i);
                    showMove(board, i);
                    return;
                }
            }
        }       
        // next check if the user can win on the next move and block them
        for (var i = 0; i<board.length; i++) {
            localBoard = board.slice();
            if (isFree(localBoard, i)) {
                makeMove(localBoard, playerWeapon, i);
                if (isWin(localBoard, playerWeapon)) {
                    makeMove(board, myWeapon, i);
                    showMove(board, i);
                    return;
                }                
            }
        }       
       
        // the next best thing would be to take one of the corners
        var corners = [0, 2, 6, 8];
        var validCorners = [];
        var move;
        // check if any corners are available and append them to the valid ones
        corners.reduce(function(prev, current){
            if (isFree(board, current)) {
                validCorners.push(current);
            }
        }, validCorners);
        // pick a random one from the valid corners
        var o = Math.floor((validCorners.length)*Math.random())
        move = validCorners[o];
        
        if (move!==undefined) {
            makeMove(board, myWeapon, move);
            showMove(board, move);
            return;           
        }
        
        //otherwise pick the center if it's free
        if (isFree(board, 5)) {
            makeMove(board, myWeapon, 5);
            showMove(board, 5);
            return;          
        }
        
    }
    
}

function playerPlay() {
    // get the id from the square class that was pressed
    var id = this.id;
    var move = parseInt(id.slice(-1));
    // check if the board piece is free, if so, write to the board and physical board
    if (isFree(board, move)) {
        makeMove(board, playerWeapon, move);
        showMove(board, move);
        // pass the turn to the cpu
        cpuPlay();
    }
}

// function to check wins on a set interval to simulate a while loop
function checkWin() {
    var count;
    // the computer won
    if (playerWeapon==='X') {
        weapon = 'O';
    }
    else {
        weapon = 'X';
    }
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
$('#go').click(function() {
    if (firstMove) {
        cpuPlay();
    }
})




