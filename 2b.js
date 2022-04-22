const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');


const settings = {
  dimensions: [ 1000, 1000 ]
};

const params = {
  rows: 20,
  cols: 20,
  scaleMax: 0.1,

  bgColor: "#f4f1de",
  fgColor: "#3d405b",
  colors: ["#f4f1de","#e07a5f","#3d405b","#81b29a","#f2cc8f"],
}

const TWO_PI = 2 * Math.PI;

const sketch = ({ context, width, height }) => {

  const dim = Math.min(width, height);
  const gridW = width * 0.8;
  const gridH = height * 0.8;
  const margW = (width - gridW) * 0.5;
  const margH = (height - gridH) * 0.5;
  const cellW = gridW / params.cols;
  const cellH = gridH / params.rows;

  return () => {
    context.fillStyle = params.bgColor;
    context.fillRect(0, 0, width, height);


    context.strokeStyle = params.fgColor;
    context.lineWidth = dim * 0.002;

    for( y = 0; y < params.rows; y++ ) {      // rows

      for( x = 0; x < params.cols; x++ ) {    // cols

        const xn = x * cellW;
        const yn = y * cellH;

        // noise
        const n = random.noise2D( xn, yn, 0.003 );
        const nn = math.mapRange(n, -1, 1, 0, params.scaleMax * gridH )

        context.save();

        // position
        context.translate( xn, yn);
        context.translate( margW, margH );
        context.translate( cellW * 0.5, cellH * 0.5 )
        context.translate( 0, nn );

        // draw point
        context.moveTo(0,0);
        context.arc(0, 0, dim * 0.002, 0, TWO_PI)
        context.stroke();

        context.restore();
      }
    }

  };
};

canvasSketch(sketch, settings);
