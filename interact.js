// have a load page that slides down for the person to pick X or O
// usually don't like using jQuery but slidedown is so much easier then writing from scratch
var weapon, difficulty, firstMove;
var hit1 = false;
var hit2 = false;
var hit3 = false;
$(document).ready(function() {
    $(".welcome-menu").slideDown(600);
    
    // 4 rows of buttons to click
    $('button').click(function() {     
        if (this.id==="x" || this.id==="o") {
            // handle the case that you've already picked a weapon
            if (hit1) {
                $('#o, #x').css("background-color", "#f2f2f2");
            }
            weapon = this.id;
            $(this).css("background-color", "tomato");
            hit1 = true;
        }
        else if (this.id==="e" || this.id==="m" || this.id==="h") {
            // again handle the case that it's already been selected
            if (hit2) {
                // clear all background colors
                $('#m, #e, #h').css("background-color", "#f2f2f2");
            }
            
            difficulty = this.id;
            $(this).css("background-color", "tomato");
            hit2 = true;
        }
        else if (this.id==="you" || this.id==="me") {
            if (hit3) {
                $('#you, #me').css("background-color", "#f2f2f2");
            }
            firstMove = this.id;
            $(this).css("background-color", "tomato");
            hit3 = true;
        }
        else {
            if (weapon!==undefined && difficulty!==undefined && firstMove!==undefined) {
                $(".welcome-menu").slideUp(600);
            }
        }

    });
});

function getRandomInt() {
  var int = Math.floor(Math.random() * (10 - 0)) + 0;
    if (int>5) {
        return "X";
    }
    else {
        return "O";
    }
}
// build the board out of the 9 square elements (#sq1-#sq9)
