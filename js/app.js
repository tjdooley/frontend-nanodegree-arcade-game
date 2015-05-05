//GLobal stuff
(function () {
   'use strict';
   // this function is strict...
}());

var menu;
var gameState;
var statusBar;
var PLAYER_CONSTANTS = {
    x: 200,
    y: 400,
    sprites: [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]
};
var ENEMY_Y_POS = [62, 144, 226];
var ENEMY_COUNT = 3;

var RIGHT_BOUNDARY = 700;

var PLAYER_X_MOVE = 101;
var PLAYER_Y_MOVE = 82;

//ENTITY---------------------------------------------------------
//Create a base object with properties that all game objects share
//This is probably overkill since it's only a few properties, but was good practice
var Entity = function (x, y, width, height, sprite) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = sprite;
};
//END ENTITY------------------------------------------------------

//MENU------------------------------------------------------------
//Display start/end game menu
var Menu = function () {
    Entity.call(this, 0, 100, 400, 400, PLAYER_CONSTANTS.sprites[0]);
    this.spriteIndex = 0;
};

Menu.prototype = Object.create(Entity.prototype);

//Render the menu
Menu.prototype.render = function () {
    ctx.textAlign = "center";
    ctx.rect(20, 100, ctx.canvas.width-40, ctx.canvas.height - 150);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "bold 48px";

    //Display different text based on game state
    if (gameState === 'menu') {

        ctx.drawImage(Resources.get(this.sprite), 200, 200);

        ctx.fillText('Frogger Game', ctx.canvas.width / 2, ctx.canvas.height / 5);
        ctx.font = "24px sans-serif";
        ctx.fillText('Press c to choose a different character.', ctx.canvas.width / 2, ctx.canvas.height / 6 * 5);
    }

    if (gameState === 'lose') {
        ctx.fillText('GAME OVER', ctx.canvas.width / 2, ctx.canvas.height / 5);
        ctx.font = "24px sans-serif";
        ctx.fillText('Final Score: ' + statusBar.score, ctx.canvas.width / 2, ctx.canvas.height / 6 * 3);

    }

    //No matter the state, space button moves forward
    ctx.font = "24px ";
    ctx.fillText('Press Space to continue.', ctx.canvas.width / 2, ctx.canvas.height / 6 * 5 + 30);
};

//When the menu is displayed, input is handled separately from actual gameplay
Menu.prototype.handleInput = function (key) {
    switch (key) {
        case 'c':
            //Choose a different character.  The index tracks the selection, then resets to
            //zero once end is reached.
            this.spriteIndex++;
            if (this.spriteIndex >= PLAYER_CONSTANTS.sprites.length) {
                this.spriteIndex = 0;
            }
            this.sprite = PLAYER_CONSTANTS.sprites[this.spriteIndex];
            break;
        case 'space':
            if (gameState === 'menu') {
                gameState = 'playing';
                startGame();
            }
            else if (gameState === 'lose') {
                gameState = 'restart';
            }
            break;

        default:
            break;
    }
};
//END MENU----------------------------------------------------------------------


//STATUS BAR--------------------------------------------------------------------
//Status bar displays number of lives and total score
var StatusBar = function () {
    var icon = Resources.get('images/Heart.png');
    Entity.call(this, 5, -10, icon.width * 0.4, icon.height * 0.4, 'images/Heart.png');
    this.lifeTotal = 3;
    this.lives = 3;
    this.score = 0;
};

StatusBar.prototype = Object.create(Entity.prototype);

//Render the number of lives (heart icon) and total score
StatusBar.prototype.render = function () {
    for (var i = 0; i < this.lives; i++) {
        ctx.drawImage(Resources.get(this.sprite), this.x + i*this.width, this.y, this.width, this.height);
    }

    ctx.font = "bold 24px";
    ctx.fillStyle = 'red';
    ctx.fillText('Score: ' + this.score, ctx.canvas.width -75, 35);
};

//ENEMIES*********************************************************************************************
// Enemies our player must avoid
var Enemy = function (x, y) {
    Entity.call(this, x, y, 101, 70, 'images/enemy-bug.png');
    this.speed = getRandomArbitrary(3, 5);
};

Enemy.prototype = Object.create(Entity.prototype);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * 100 * this.speed);

    //When the enemy reaches the right of the board, send them back to the left
    if (this.x > RIGHT_BOUNDARY) {
        this.reset();
    }
};

//This resets an enemy to offscreen, and updates their row and speed.
Enemy.prototype.reset = function () {
    this.x = getRandomArbitrary(-500, -100);
    this.y = ENEMY_Y_POS[getRandomInt(0, 3)];
    this.speed = getRandomArbitrary(1, 3);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//END ENEMIES******************************************************************************************

//PLAYER***********************************************************************************************
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    Entity.call(this, PLAYER_CONSTANTS.x, PLAYER_CONSTANTS.y, 70, 70, PLAYER_CONSTANTS.sprites[0]);
    this.leftBorder = 20;
    this.rightBorder = this.leftBorder + this.width;
};


Player.prototype = Object.create(Entity.prototype);

//If the player reaches the end, update their score and reset them to the beginning
Player.prototype.update = function (dt) {
    if (player.y === -10) {
        statusBar.score++;
        player.reset();
    }
};

// Update the player's position, required method for game
// Parameter: key, the key pressed by the user
Player.prototype.handleInput = function (key) {
    switch (key) {
        case 'left':
            this.x - PLAYER_X_MOVE < 0 ? this.x = 0 : this.x = this.x - PLAYER_X_MOVE;
            break;
        case 'up':
            this.y - PLAYER_Y_MOVE < -10 ? this.y = -10 : this.y = this.y - PLAYER_Y_MOVE;
            break;
        case 'right':
            this.x + PLAYER_X_MOVE > 400 ? this.x = 400 : this.x = this.x + PLAYER_X_MOVE;
            break;
        case 'down':
            this.y + PLAYER_Y_MOVE > 400 ? this.y = 400 : this.y = this.y + PLAYER_Y_MOVE;
            break;
        default:
            break;
        }
};

//Reset player back to start position
Player.prototype.reset = function () {
    this.x = PLAYER_CONSTANTS.x;
    this.y = PLAYER_CONSTANTS.y;
};

// Draw the player on the screen, required method for game
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//END PLAYER*********************************************************************************************

// UTILITY STUFF*****************************************************************************************

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//END UTILITY STUFF**************************************************************************************

var allEnemies = [];
var player = new Player();
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var startGame = function () {
    allEnemies = [];
    for (var i = 0; i < ENEMY_COUNT; i++) {
        allEnemies.push(new Enemy(-100, ENEMY_Y_POS[getRandomInt(0, 3)]));
    }
    player = new Player();
    player.sprite = PLAYER_CONSTANTS.sprites[menu.spriteIndex];
    statusBar = new StatusBar();
};

//Set the game state to menu and create the menu
var initGraphics = function () {
    gameState = 'menu';
    menu = new Menu();
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c'
    };

    if (gameState === 'playing') {
        player.handleInput(allowedKeys[e.keyCode]);
    }
    else {
        menu.handleInput(allowedKeys[e.keyCode]);
    }
});
