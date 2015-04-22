//GLobal stuff
var playerStartPos = {
	x: 200,
	y:400
};
var enemyYPos = [62, 144, 226];
var rightBoundary = 700;

var playerXMove = 101;
var playerYMove = 82;

//ENEMIES*********************************************************************************************
// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = getRandomArbitrary(1, 3);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * 100 * this.speed);

    if (this.x > rightBoundary) {
    	this.reset();
    }
}

//This resets an enemy to offscreen, and updates their row and speed.
Enemy.prototype.reset = function() {
	this.x = getRandomArbitrary(-500, -100);
	this.y = enemyYPos[getRandomInt(0, 3)]
	this.speed = getRandomArbitrary(1, 3);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
//END ENEMIES******************************************************************************************

//PLAYER***********************************************************************************************
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
}

Player.prototype.update = function(dt) {
	// if (player.y === -10) {
	// 	player.reset();
	// }
}

// Update the player's position, required method for game
// Parameter: key, the key pressed by the user
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
        	this.x - playerXMove < 0 ? this.x = 0 : this.x = this.x - playerXMove
            break;
        case 'up':
            this.y - playerYMove < -10 ? this.y = -10 : this.y = this.y - playerYMove
            break;
        case 'right':
            this.x + playerXMove > 400 ? this.x = 400 : this.x = this.x + playerXMove
            break;
        case 'down':
            this.y + playerYMove > 400 ? this.y = 400 : this.y = this.y + playerYMove
            break;
        default:
            break;
        }
}

Player.prototype.reset = function() {
	this.x = playerStartPos.x;
	this.y = playerStartPos.y;
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(-100, enemyYPos[getRandomInt(0, 3)])];
var player = new Player(playerStartPos.x, playerStartPos.y);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
