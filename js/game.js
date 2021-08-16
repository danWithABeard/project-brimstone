(function() {
  /** Canvas setup */
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');

  /** Gameplay Constants */
  var ALT_BG_COLOR = 'darkmagenta',
      ALT_LEVEL_COLOR = 'indigo',
      ARROW_LEFT = 'ArrowLeft',
      ARROW_RIGHT = 'ArrowRight',
      DEBUG = 'KeyP',
      debugMode = 0,
      ALT_WORLD = 0,
      GRAVITY = 1.1,
      leftPressed = 0,
      LEVEL_COLOR = '#22A9D5',
      OVERLAP_COLOR = '#f00',
      PLAYER_COLOR = '#939393',
      PLAYER_JUMP_SPEED = 6.5,
      PLAYER_MOVE_SPEED = 3,
      PLAYER_SIZE = 20,
      playerX = 0,
      playerY = 300,
      rightPressed = 0,
      SPACE = 'Space',
      spacePressed = 0

  var LEVEL_1_GEO = [
    {x:240, y:0, w: PLAYER_SIZE, h: canvas.height}
  ]

  var LEVEL_1_GEO_ALT = [

  ]

  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)

  function setBackgroundColor(color) {
    document.body.style.backgroundColor = color ? color : null;
    document.getElementById('game').style.backgroundColor = color ? ALT_BG_COLOR : null;
  }

  function keyDownHandler(e) {
    if (debugMode) { console.log('key down ', e.code) }

    if (e.code === ARROW_RIGHT) {
      rightPressed = true
    } else if (e.code === ARROW_LEFT) {
      leftPressed = true
    } else if (e.code === SPACE) {
      spacePressed = true
      ALT_WORLD = !ALT_WORLD
      setBackgroundColor(ALT_WORLD ? ALT_LEVEL_COLOR : null);
    } else if (e.code === DEBUG) {
      console.log('Debug mode is now ', !debugMode)
      debugMode = !debugMode
    }
  }

  function keyUpHandler(e) {
    if (debugMode) { console.log('key up ', e.code) }
    if(e.code === ARROW_RIGHT) {
      rightPressed = false
    } else if(e.code === ARROW_LEFT) {
      leftPressed = false
    } else if (e.code === SPACE) {
      spacePressed = false
    }
  }

  function gameDebugger() {
    if (debugMode) {
      ctx.font = '12px Arial';
      ctx.fillStyle = OVERLAP_COLOR;
      ctx.fillText('Player: X ' + playerX + ' Y ' + playerY, 20, 32);
    }
  }

  function levelCollisionDetection () {
    for(var c = 0; c < LEVEL_1_GEO.length; c++) {
      var geo = LEVEL_1_GEO[c]

      // console.log('playerX + PLAYER_SIZE > geo.x', playerX + PLAYER_SIZE > geo.x)
      // console.log('playerX + PLAYER_SIZE < geo.x + geo.w', playerX + PLAYER_SIZE < geo.x + geo.w)
      // console.log('playerY + PLAYER_SIZE > geo.y', playerY + PLAYER_SIZE > geo.y)
      // console.log('playerY + PLAYER_SIZE < geo.y + geo.h', playerY + PLAYER_SIZE < geo.y + geo.h)

      if (
        (playerX > geo.x) &&
        (playerX + PLAYER_SIZE < geo.x + geo.w)
        // (playerY + PLAYER_SIZE < geo.y) &&
        // (playerY + PLAYER_SIZE > geo.y + geo.h)
      ) {
        return true
      }
    }

    return false
  }

  function canvasCollisionDetection() {
    var levelCollision = levelCollisionDetection()
    console.log('levelCollision', levelCollision)

    // if (levelCollision) return

    if (rightPressed && playerX < canvas.width - PLAYER_SIZE) {
      playerX += PLAYER_MOVE_SPEED;
    }

    if (leftPressed && playerX > 0) {
      playerX -= PLAYER_MOVE_SPEED;
    }

    /** Make player jump */
    if (spacePressed && (playerY <= (canvas.height - PLAYER_SIZE)) && (playerY>= 0)) {
      playerY -= PLAYER_JUMP_SPEED;
    } else if (!spacePressed && playerY <= (canvas.height - PLAYER_SIZE)) {
      if (playerY + PLAYER_JUMP_SPEED >= (canvas.height - PLAYER_SIZE)) {
        playerY += ((canvas.height - PLAYER_SIZE) - playerY)

      } else {
        playerY += (PLAYER_JUMP_SPEED * 1.1)
      }
    }
  }

  /** Run the end game state */
  // function gameOver() {
  //   clearCanvas();
  //   drawEndText();
  // }

  function drawPlayer() {
    ctx.beginPath();
    ctx.rect(playerX, playerY, PLAYER_SIZE, PLAYER_SIZE);
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fill();
    ctx.closePath();
  }

  function level1() {
    for (var b = 0; b < LEVEL_1_GEO.length; b++) {
      var geo = LEVEL_1_GEO[b]
      ctx.beginPath();
      ctx.rect(geo.x, geo.y, geo.w, geo.h);
      ctx.fillStyle = LEVEL_COLOR;
      ctx.fill();
      ctx.closePath();
    }
  }

  function nega1() {
    ctx.beginPath();
    ctx.rect(240, canvas.height - canvas.height/4, PLAYER_SIZE, canvas.height/4);
    ctx.fillStyle = ALT_LEVEL_COLOR;
    ctx.fill();
    ctx.closePath();
  }

  function drawLevel() {
    if (ALT_WORLD) {
      nega1()
      /** Render alt level */
    } else {
      level1()
      /** render main level */
    }
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    clearCanvas()
    drawPlayer()
    drawLevel()
    gameDebugger()
    canvasCollisionDetection()
    requestAnimationFrame(draw)
  }

  draw();
})();