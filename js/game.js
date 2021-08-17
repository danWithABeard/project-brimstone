(function() {
  /** Canvas setup */
  var canvas = document.getElementById('game')
  var ctx = canvas.getContext('2d')

  /** Gameplay Constants */
  var COLORS = {
    ALT_BG_COLOR: 'darkmagenta',
    ALT_LEVEL_COLOR: 'indigo',
    EXIT_COLOR: '#333',
    LEVEL_COLOR: '#22A9D5',
    OVERLAP_COLOR: '#f00',
    PLAYER_COLOR: '#939393'
  }

  var KEY = {
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    DEBUG: 'KeyP',
    SPACE: 'Space'
  }

  var debugMode = 0,
      ALT_WORLD = 0,
      GRAVITY = 1.1,
      leftPressed = 0,
      PLAYER_JUMP_SPEED = 6.5,
      PLAYER_MOVE_SPEED = 3,
      PLAYER_SIZE = 20,
      playerX = 0,
      playerY = 300,
      dx = 0,
      dy = 0,
      dt = 0,
      rightPressed = 0,
      spacePressed = 0

  var LEVEL_1 = {
    s: {x:240, y:0},
    e: {x:430, y:280, w: PLAYER_SIZE, h: PLAYER_SIZE * 2},
    geo: [{x:240, y:0, w: PLAYER_SIZE, h: canvas.height}],
    alt: [{x:240, y:canvas.height - canvas.height/4, w: PLAYER_SIZE, h: canvas.height/4}]
  }

  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)

  function setBackgroundColor(color) {
    document.body.style.backgroundColor = color ? color : null
    document.getElementById('game').style.backgroundColor = color ? COLORS.ALT_BG_COLOR : null
  }

  function keyDownHandler(e) {
    if (debugMode) { console.log('key down ', e.code) }

    if (e.code === KEY.ARROW_RIGHT) {
      rightPressed = 1
    } else if (e.code === KEY.ARROW_LEFT) {
      leftPressed = 1
    } else if (e.code === KEY.SPACE) {
      spacePressed = 1
      ALT_WORLD = 1
    } else if (e.code === KEY.DEBUG) {
      console.log('Debug mode is now ', !debugMode)
      debugMode = !debugMode
    }
  }

  function keyUpHandler(e) {
    if (debugMode) { console.log('key up ', e.code) }

    if (e.code === KEY.ARROW_RIGHT) {
      rightPressed = 0
    } else if(e.code === KEY.ARROW_LEFT) {
      leftPressed = 0
    } else if (e.code === KEY.SPACE) {
      spacePressed = 0
      ALT_WORLD = 0
    }
  }

  function gameDebugger() {
    if (debugMode) {
      ctx.font = '12px Arial'
      ctx.fillStyle = COLORS.OVERLAP_COLOR
      ctx.fillText('Player: { x:'+playerX+',y:'+playerY+'}',20,32)
      ctx.fillText('Jump:'+dt,20,52)
    }
  }

  function levelCollisionDetection() {
    var currentLevelGeo = ALT_WORLD ? LEVEL_1.alt : LEVEL_1.geo
    for(var c = 0; c < currentLevelGeo.length; c++) {
      var geo = currentLevelGeo[c]

      if (
        (playerX + dx + PLAYER_SIZE > geo.x) &&
        (playerX + dx < geo.x + geo.w) &&
        (playerY + dy + PLAYER_SIZE > geo.y) &&
        (playerY + dy < geo.y + geo.h)
      ) {
        return true
      }
    }

    return false
  }

  function exitCollisionDetection() {
    // var exit = currentLevelGeo[e]
    var exit = LEVEL_1.e

    if (
      (playerX + dx + PLAYER_SIZE > exit.x) &&
      (playerX + dx < exit.x + exit.w) &&
      (playerY + dy + PLAYER_SIZE > exit.y) &&
      (playerY + dy < exit.y + exit.h)
    ) {
      console.log('load next level')
    }

    return false
  }

  function canvasCollisionDetection() {
    dx = 0
    dy = 0

    if (rightPressed && playerX < canvas.width - PLAYER_SIZE) {
      dx += PLAYER_MOVE_SPEED
    }

    if (leftPressed && playerX > 0) {
      dx -= PLAYER_MOVE_SPEED
    }

    /** Make player jump */
    if (spacePressed && dt <= 25  && (playerY <= (canvas.height - PLAYER_SIZE)) && (playerY>= 0)) {
      dt += 1
      dy -= PLAYER_JUMP_SPEED
    } else if (!spacePressed && playerY <= (canvas.height - PLAYER_SIZE)) {
      dt = 0

      if (playerY + PLAYER_JUMP_SPEED >= (canvas.height - PLAYER_SIZE)) {
        dy += ((canvas.height - PLAYER_SIZE) - playerY)
      } else {
        dy += (PLAYER_JUMP_SPEED)
      }
    } else if ( playerY + PLAYER_SIZE <= canvas.height ) {
      dy += (PLAYER_JUMP_SPEED)
    }

    var cc = levelCollisionDetection()
    if (dx !== 0 && !cc) playerX += dx
    if (dy !== 0 && !cc) playerY += dy
  }

  /** Run the end game state */
  // function gameOver() {
  //   clearCanvas()
  //   drawEndText()
  // }

  function drawPlayer() {
    ctx.beginPath()
    ctx.rect(playerX, playerY, PLAYER_SIZE, PLAYER_SIZE)
    ctx.fillStyle = COLORS.PLAYER_COLOR
    ctx.fill()
    ctx.closePath()
  }

  function level1() {
    for (var b = 0; b < LEVEL_1.geo.length; b++) {
      var geo = LEVEL_1.geo[b]
      ctx.beginPath()
      ctx.rect(geo.x, geo.y, geo.w, geo.h)
      ctx.fillStyle = COLORS.LEVEL_COLOR
      ctx.fill()
      ctx.closePath()
    }
  }

  function nega1() {
    for (var b = 0; b < LEVEL_1.alt.length; b++) {
      var alt = LEVEL_1.alt[b]
      ctx.beginPath()
      ctx.rect(alt.x, alt.y, alt.w, alt.h)
      ctx.fillStyle = COLORS.ALT_LEVEL_COLOR
      ctx.fill()
      ctx.closePath()
    }
  }

  function drawLevel() {
    setBackgroundColor(ALT_WORLD ? COLORS.ALT_LEVEL_COLOR : null)

    if (ALT_WORLD) {
      nega1() /** Render alt level */
    } else {
      level1() /** render main level */

      /** draw exit */
      ctx.beginPath()
      ctx.rect(LEVEL_1.e.x, LEVEL_1.e.y, LEVEL_1.e.w, LEVEL_1.e.h)
      ctx.fillStyle = COLORS.EXIT_COLOR
      ctx.fill()
      ctx.closePath()
    }
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function draw() {
    clearCanvas()
    drawPlayer()
    drawLevel()
    gameDebugger()
    canvasCollisionDetection()
    exitCollisionDetection()
    requestAnimationFrame(draw)
  }

  draw()
})()