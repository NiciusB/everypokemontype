const randomColor = require('randomcolor')
const { registerFont, createCanvas } = require('canvas')
registerFont('Pokemon Classic.ttf', { family: 'Pokemon Classic' })

module.exports.generateImage = (word) => {
  let canvasWidth = 40 + word.length * 14
  if (canvasWidth < 120) canvasWidth = 120
  const canvas = createCanvas(canvasWidth, 50)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  let middleHeight = 12
  ctx.fillRect(10, canvas.height / 2 - middleHeight / 2, canvas.width - 20, middleHeight)
  middleHeight = 8
  ctx.fillRect(10, canvas.height / 2 - middleHeight / 2, canvas.width - 20, middleHeight)

  ctx.strokeStyle = '#333'
  ctx.fillStyle = randomColor({
    format: 'rgba',
    alpha: 0.85
  })
  ctx.lineWidth = 2

  roundRect(ctx, 10, 10, canvas.width - 20, canvas.height - 20, 15, true, true)
  ctx.strokeStyle = '#fff'
  roundRect(ctx, 11, 11, canvas.width - 22, canvas.height - 22, 15, false, true)

  ctx.font = '13px Pokemon Classic'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.strokeText(word, canvas.width / 2 + 2, canvas.height / 2 - 1)
  ctx.fillText(word, canvas.width / 2 + 2, canvas.height / 2 - 1)


  return canvas.toBuffer('image/png')
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}