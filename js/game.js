/** Canvas setup */
import { COLORS, KEY, PLAYER_SIZE, PLAYER_JUMP_SPEED, PLAYER_MOVE_SPEED } from './constants'
import { LevelOne } from './levels/LevelOne'
import './css/game.css'

export class Game {
  init() {
    this.start()
  }

  start() {
    const canvas = document.getElementById('game')
    const ctx = canvas.getContext('2d')

    let debugMode = 0,
        ALT_WORLD = 0,
        leftPressed = 0,
        playerX = 0,
        playerY = 300,
        dx = 0,
        dy = 0,
        dt = 0,
        rightPressed = 0,
        spacePressed = 0

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
      var currentLevelGeo = ALT_WORLD ? LevelOne.alt : LevelOne.geo
      for(var c = 0; c < currentLevelGeo.length; c++) {
        var geo = currentLevelGeo[c]

        if (
          (playerX + dx + PLAYER_SIZE > geo.x) &&
          (playerX + dx < geo.x + geo.w) &&
          (playerY + dy + PLAYER_SIZE > geo.y) &&
          (playerY + dy < geo.y + geo.h)
        ) {
          console.log('DEATH')
          return true
        }
      }

      return false
    }

    function exitCollisionDetection() {
      // var exit = currentLevelGeo[e]
      var exit = LevelOne.exit

      if (
        (playerX + PLAYER_SIZE > exit.x) &&
        (playerX < exit.x + exit.w) &&
        (playerY + PLAYER_SIZE > exit.y) &&
        (playerY < exit.y + exit.h)
      ) {
        return true
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
    function gameOver() {
      clearCanvas()
      alert("Load Level 2")
      document.location.reload()
    }

    function drawPlayer() {
      ctx.beginPath()
      ctx.rect(playerX, playerY, PLAYER_SIZE, PLAYER_SIZE)
      ctx.fillStyle = COLORS.PLAYER_COLOR
      ctx.fill()
      ctx.closePath()
    }

    function level1() {
      for (var c=0; c < LevelOne.matrix.length; c++) {
        const column = LevelOne.matrix[c]
        for (var r=0; r < column.length; r++) {
          if (LevelOne.matrix[c][r] === 1) {
            // console.log(`pixel[${r},${c}]`)
            ctx.beginPath()
            ctx.rect(r*20, c*20, 20, 20)
            ctx.fillStyle = COLORS.LEVEL_COLOR
            // ctx.lineWidth = 1
            // ctx.strokeStyle = COLORS.OVERLAP_COLOR
            // ctx.stroke()
            ctx.fill()
            ctx.closePath()
          }
        }
      }
    }

    function nega1() {
      for (var b = 0; b < LevelOne.alt.length; b++) {
        var alt = LevelOne.alt[b]
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
        ctx.rect(LevelOne.exit[0], LevelOne.exit[1], 20, 40)
        ctx.fillStyle = COLORS.EXIT_COLOR
        // ctx.lineWidth = 1
        // ctx.strokeStyle = COLORS.OVERLAP_COLOR
        // ctx.stroke()
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

      if (exitCollisionDetection()) {
        gameOver()
      } else {
        requestAnimationFrame(draw)
      }
    }

    draw()
  }
}

export const G = new Game();