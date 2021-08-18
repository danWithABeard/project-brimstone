import { CANVAS_HEIGHT, PLAYER_SIZE } from '../constants'

export const LevelOne = {
  s: {
    x: 240,
    y: 0
  },
  e: {
    x: 430,
    y: 280,
    w: PLAYER_SIZE,
    h: PLAYER_SIZE * 2
  },
  geo: [{ x:240, y: 0, w: PLAYER_SIZE, h: CANVAS_HEIGHT }],
  alt: [{ x:240, y: CANVAS_HEIGHT - CANVAS_HEIGHT / 4, w: PLAYER_SIZE, h: CANVAS_HEIGHT / 4 }]
}