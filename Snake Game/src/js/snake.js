/**
 * Namespace
 */
var Game      = Game      || {};
var Keyboard  = Keyboard  || {};
var Component = Component || {};

/**
 * Mapping of keyboard keys
 */
Keyboard.Keymap = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

/**
 * Keyboard Events
 */
Keyboard.ControllerEvents = function() {
  // Sets
  var self      = this;
  this.pressKey = null;
  this.keymap   = Keyboard.Keymap;

  // Keydown Event
  document.onkeydown = function(event) {
    self.pressKey = event.which;
  };

  // Get Key
  this.getKey = function() {
    return this.keymap[this.pressKey];
  };
};

/**
 * Game Component Stage
 */
Component.Stage = function(canvas, config) {
  // Sets
  this.keyEvent  = new Keyboard.ControllerEvents();
  this.width     = canvas.width;
  this.height    = canvas.height;
  this.length    = [];
  this.food      = {};
  this.score     = 0;
  this.direction = 'right';
  this.config      = {
    cw   : 10,
    size : 5,
    fps  : 100
  };

  // Merge config
  if (typeof config == 'object') {
    for (var key in config) {
      if (config.hasOwnProperty(key)) {
        this.config[key] = config[key];
      }
    }
  }

};

/**
 * Game Component Snake
 */
Component.Snake = function(canvas, config) {
  // Game Stage
  this.stage = new Component.Stage(canvas, config);

  // Init Snake
  this.initSnake = function() {
    // Itaration in Snake config Size
    for (var i = 0; i < this.stage.config.size; i++) {

      // Add Snake Cells
      this.stage.length.push({x: i, y:0});
		}
	};

  // Call init Snake
  this.initSnake();

  // Init Food
  this.initFood = function() {

    // Add food on stage
    this.stage.food = {
			x: Math.round(Math.random() * (this.stage.width - this.stage.config.cw) / this.stage.config.cw),
			y: Math.round(Math.random() * (this.stage.height - this.stage.config.cw) / this.stage.config.cw),
		};
	};

  // Init Food
  this.initFood();

  // Reset game
  this.resetGame = function() {
    this.stage.length            = [];
    this.stage.food              = {};
    this.stage.score             = 0;
    this.stage.direction         = 'right';
    this.stage.keyEvent.pressKey = null;
    this.initSnake();
    this.initFood();
  };
};

/**
 * Game Render
 */
Game.Render = function(context, snake) {
  // Render Game
  this.renderGame = function() {
    // Check Keypress And Set Stage direction
    var keyPress = snake.stage.keyEvent.getKey();
    if (typeof(keyPress) != 'undefined') {
      snake.stage.direction = keyPress;
    }

    // Render White Stage
		context.fillStyle = 'rgb(17, 17, 17)';
		context.fillRect(0, 0, snake.stage.width, snake.stage.height);

    // Snake Position
    var nx = snake.stage.length[0].x;
		var ny = snake.stage.length[0].y;

    // Add position by stage direction
    switch (snake.stage.direction) {
      case 'right':
        nx++;
        break;
      case 'left':
        nx--;
        break;
      case 'up':
        ny--;
        break;
      case 'down':
        ny++;
        break;
    }

    // Check Collision
    if (this.collision(nx, ny) == true) {
      snake.resetGame();
      return;
    }

    // Logic of Snake food
    if (nx == snake.stage.food.x && ny == snake.stage.food.y) {
      var tail = {x: nx, y: ny};
      snake.stage.score++;

      // Logic to increase speed at each 5 increment, rendering a bit buggy
      if(snake.stage.score!=0 && snake.stage.score%5==0){
        snake.stage.score-=0;
        this.stage.config.fps -= 10;
      }

      snake.initFood();
    } else {
      var tail = snake.stage.length.pop();
      tail.x   = nx;
      tail.y   = ny;
    }
    snake.stage.length.unshift(tail);

    // Render Snake
    for (var i = 0; i < snake.stage.length.length; i++) {
      var cell = snake.stage.length[i];
      this.drawCell(cell.x, cell.y);
    }

    // Render Food
    this.drawCell(snake.stage.food.x, snake.stage.food.y);

    this.updateScore();
  };

  this.updateScore = function(){
    // Render Score
    context.font = '20px Arial';
    context.fillStyle = 'white';
    context.fillText('Score: ' + snake.stage.score, 5, (snake.stage.height - 5));
  }
  // Draw Cell
  this.drawCell = function(x, y) {
    var gradient = context.createRadialGradient(75,50,5,400,60,520);
    gradient.addColorStop(0,this.updateColour());
    gradient.addColorStop(1,this.updateColour());

    // Fill with gradient
    context.fillStyle = gradient;

    // context.fillStyle = this.updateColour();
    context.beginPath();
    context.arc((x * snake.stage.config.cw + 6), (y * snake.stage.config.cw + 6), 4, 0, 2*Math.PI, false);
    context.fill();
  };

  // Method to get a random colour for snake segments and food
  this.updateColour = function(){
    r = Math.round(Math.random() * 243);
    g = Math.round(Math.random() * 243);
    b = Math.round(Math.random() * 243);

    return `rgb(${r},${g},${b})`
  };

  // Check Collision with sides of game
  this.collision = function(nx, ny) {
    if (nx == -1 || nx == (snake.stage.width / snake.stage.config.cw) || ny == -1 || ny == (snake.stage.height / snake.stage.config.cw)) {
      return true;
    }
    return false;
	}
};


/**
 * Game Snake
 */
Game.Snake = function(elementId, config) {
  // Sets canvas to the element in index.html we want to render the game in
  var canvas   = document.getElementById(elementId);
  // Sets the context to 2D
  var context  = canvas.getContext("2d");
  // Create a new snake object
  var snake    = new Component.Snake(canvas, config);
  // Render a new game
  var gameRender = new Game.Render(context, snake);

  // Game Interval
  setInterval(function() {gameRender.renderGame();}, snake.stage.config.fps);
};


/**
 * Window Load
 */
window.onload = function() {
  var snake = new Game.Snake('game_board', {fps: 100, size: 4});
};
