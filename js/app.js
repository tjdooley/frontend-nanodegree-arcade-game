//GLobal stuff
var menu;
var gameState;
var statusBar;
var playerConst = {
	x: 200,
	y:400,
	sprites: ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png']
};
var enemyYPos = [62, 144, 226];
var enemyCount = 3;

var rightBoundary = 700;

var playerXMove = 101;
var playerYMove = 82;

var Menu = function(){
    this.x = 0;
    this.y = 100;
    this.width = 400;
    this.height = 400;
    this.spriteIndex = 0;
    this.sprite = playerConst.sprites[0];
};

Menu.prototype.render = function(){
    ctx.textAlign = "center";
    ctx.rect(20,100,ctx.canvas.width-40,ctx.canvas.height - 150);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "bold 48px";

    if(gameState === 'menu') {

        ctx.drawImage(Resources.get(this.sprite), 200, 200);

        ctx.fillText('Frogger Game', ctx.canvas.width / 2, ctx.canvas.height / 5);
        ctx.font = "24px sans-serif";
        ctx.fillText('Press c to choose a different character.', ctx.canvas.width / 2, ctx.canvas.height / 6 * 5);
    }

    if(gameState === 'lose'){
        ctx.fillText('GAME OVER', ctx.canvas.width/2, ctx.canvas.height/5);
    }
    ctx.font = "24px ";
    ctx.fillText('Press Space to continue.', ctx.canvas.width/2, ctx.canvas.height/6*5 + 30);
};

Menu.prototype.handleInput = function(key){
    switch(key){
        case 'c' :
        	this.spriteIndex++;
        	if (this.spriteIndex >= playerConst.sprites.length) {
        		this.spriteIndex = 0;
        	}
        	this.sprite = playerConst.sprites[this.spriteIndex];
        	break;
        case 'space':
            if(gameState === 'menu') {
                gameState = 'playing';
                startGame();
            }
            else if(gameState === 'lose'){
                gameState = 'restart';
            }
            else if(gameState === 'win'){
                gameState = 'continue';
            }
            break;

        default:
            break;
    }
};

//Status bar
var StatusBar = function() {
	this.x = 5;
	this.y = -10;
	this.lifeTotal = 3;
	this.lives = 3
	this.sprite = 'images/Heart.png';
	this.width = Resources.get(this.sprite).width * .4;
    this.height = Resources.get(this.sprite).height * .4;
}

StatusBar.prototype.render = function(){
    for(i = 0; i < this.lives; i++){
        ctx.drawImage(Resources.get(this.sprite), this.x + i*this.width, this.y, this.width, this.height);
    }
};

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
    this.width = 101;
    this.height = 70;
    this.speed = getRandomArbitrary(3, 5);
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
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = playerConst.sprites[0];
    this.x = playerConst.x;
    this.y = playerConst.y;
    this.width = 70;
    this.height = 70;
    this.leftBorder = 20;
    this.rightBorder = this.leftBorder + this.width;
}

Player.prototype.update = function(dt) {
	if (player.y === -10) {
		player.reset();
	}
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
	this.x = playerConst.x;
	this.y = playerConst.y;
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


var allEnemies = [];
var player = new Player();
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var startGame = function() {
	allEnemies = [];
	for (i = 0; i < enemyCount; i++) {
  		allEnemies.push(new Enemy(-100, enemyYPos[getRandomInt(0, 3)]));
	}
	player = new Player();
	player.sprite = playerConst.sprites[menu.spriteIndex];
	statusBar = new StatusBar();
};

var initGraphics = function(){
    gameState = 'menu';
    menu = new Menu();
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
    	32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c'
    };

    if(gameState === 'playing'){
        player.handleInput(allowedKeys[e.keyCode]);
    }
    else {
        menu.handleInput(allowedKeys[e.keyCode]);
    }
});
