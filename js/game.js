/** Canvas setup */
import { COLORS, KEY, PLAYER_SIZE, PLAYER_JUMP_SPEED, PLAYER_MOVE_SPEED } from './constants'
import { LevelOne, LevelTwo } from './levels/LevelOne'
import './css/game.css'

export class Game {
  constructor() {
    this.levels = [
      LevelOne,
      LevelTwo
    ]

    this.start = this.start.bind(this)
    this.debugMode = 0
  }

  init() {
    this.start()
  }

  start() {
    const _this = this
    const canvas = document.getElementById('game')
    const ctx = canvas.getContext('2d')

    let negaWorld = 0,
        leftPressed = 0,
        playerX = 0,
        playerY = 300,
        dx = 0,
        dy = 0,
        dt = 0,
        rightPressed = 0,
        spacePressed = 0,
        currentLevel = 0

    document.addEventListener('keydown', keyDownHandler, false)
    document.addEventListener('keyup', keyUpHandler, false)

    function setBackgroundColor(color) {
      document.body.style.backgroundColor = color ? color : null
      document.getElementById('game').style.backgroundColor = color ? COLORS.ALT_BG_COLOR : null
    }

    function keyDownHandler(e) {
      if (_this.debugMode) { console.log('key down ', e.code) }

      if (e.code === KEY.ARROW_RIGHT) {
        rightPressed = 1
      } else if (e.code === KEY.ARROW_LEFT) {
        leftPressed = 1
      } else if (e.code === KEY.SPACE) {
        spacePressed = 1
        negaWorld = 1
      } else if (e.code === KEY.DEBUG) {
        console.log('Debug mode is now ', !_this.debugMode)
        _this.debugMode = !_this.debugMode
      }
    }

    function keyUpHandler(e) {
      if (_this.debugMode) { console.log('key up ', e.code) }

      if (e.code === KEY.ARROW_RIGHT) {
        rightPressed = 0
      } else if(e.code === KEY.ARROW_LEFT) {
        leftPressed = 0
      } else if (e.code === KEY.SPACE) {
        spacePressed = 0
        negaWorld = 0
      }
    }

    function gameDebugger() {
      if (_this.debugMode) {
        ctx.font = '12px Arial'
        ctx.fillStyle = COLORS.OVERLAP_COLOR
        ctx.fillText('Player: { x:'+playerX/20+',y:'+playerY/20+'}',20,32)
        ctx.fillText('Jump:'+dt,20,52)
        ctx.fillText('Level'+currentLevel,20,82)
      }
    }

    function levelCollisionDetection(dx,dy) {
      console.log('dx', dx, 'dy', dy)

      // for(var c = 0; c < currentLevelGeo.length; c++) {
      //   var geo = currentLevelGeo[c]

      //   if (
      //     (playerX + dx + PLAYER_SIZE > geo.x) &&
      //     (playerX + dx < geo.x + geo.w) &&
      //     (playerY + dy + PLAYER_SIZE > geo.y) &&
      //     (playerY + dy < geo.y + geo.h)
      //   ) {
      //     console.log('DEATH')
      //     return true
      //   }
      // }

      return false
    }

    function exitCollisionDetection() {
      var exit = _this.levels[currentLevel].exit

      if (
        (playerX + 20 > exit[0]) &&
        (playerX < exit[0] + 20) &&
        (playerY + 20 > exit[1]) &&
        (playerY < exit[1] + 20)
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

      var cc = levelCollisionDetection(dx,dy)
      if (dx !== 0 && !cc) playerX += dx
      if (dy !== 0 && !cc) playerY += dy
    }

    /** Run the end game state */
    function nextLevel() {
      console.log('nextLevel nextLevel nextLevel')
      /** Refactor into level start function */
      playerX = 0
      playerY = 300
      clearCanvas()
      currentLevel += 1
      draw()
    }

    function drawPlayer() {
      ctx.beginPath()
      ctx.rect(playerX, playerY, PLAYER_SIZE, PLAYER_SIZE)
      ctx.fillStyle = COLORS.PLAYER_COLOR
      ctx.fill()
      ctx.closePath()
    }

    function drawLevel() {
      setBackgroundColor(negaWorld ? COLORS.ALT_LEVEL_COLOR : null)

      let levelGeometry, levelColor

      if (negaWorld) {
        /** Render alt level */
        levelGeometry = _this.levels[currentLevel].nega
        levelColor = COLORS.ALT_LEVEL_COLOR
      } else {
        levelGeometry = _this.levels[currentLevel].matrix
        levelColor = COLORS.LEVEL_COLOR
      }

      for (var c=0; c < levelGeometry.length; c++) {
        const column = levelGeometry[c]
        for (var r=0; r < column.length; r++) {
          if (levelGeometry[c][r] === 1) {
            ctx.beginPath()
            ctx.rect(r*20, c*20, 20, 20)
            ctx.fillStyle = levelColor
            ctx.fill()

            if (_this.debugMode) {
              // console.log(`pixel[${r},${c}]`)
              ctx.lineWidth = 1
              ctx.strokeStyle = COLORS.OVERLAP_COLOR
              ctx.stroke()
            }

            ctx.closePath()
          } else if (levelGeometry[c][r] === 9) {
            ctx.beginPath()
            ctx.rect(r*20, c*20, 20, 20)
            ctx.fillStyle = COLORS.EXIT_COLOR
            ctx.fill()
            ctx.closePath()
          } else if (_this.debugMode && levelGeometry[c][r] === 0) {
              // console.log(`pixel[${r},${c}]`)
              ctx.beginPath()
              ctx.rect(r*20, c*20, 20, 20)
              ctx.lineWidth = .1
              ctx.strokeStyle = COLORS.EXIT_COLOR
              ctx.stroke()
              ctx.closePath()
          }
        }
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
        nextLevel()
      } else {
        requestAnimationFrame(draw)
      }
    }

    draw()
  }
}

export const G = new Game();