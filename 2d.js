const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const utils = require('./utils.js');


const settings = {
  dimensions: [ 2200, 3000 ],
  // animate: true,
  fps: 30
};

const params = {
  rows: 30,
  cols: 20,
  scaleMax: 0.1,
  noiseFreq: 0.002,

  bgColor: "#f4f1de",
  fgColor: "#3d405b",
  colors: ["#f4f1de","#e07a5f","#3d405b","#81b29a","#f2cc8f"],
}

const sketch = ({ context, width, height }) => {

  const dim = Math.min(width, height);
  const centerX = width * 0.5;
  const centerY = height * 0.5;

  const gridW = width * 0.8;
  const gridH = height * 0.8;
  const margW = (width - gridW) * 0.5;
  const margH = (height - gridH) * 0.5;
  const cellW = gridW / params.cols;
  const cellH = gridH / params.rows;

  return ({ frame }) => {
    context.fillStyle = params.bgColor;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = params.fgColor;
    context.lineWidth = dim * 0.005;
    
    for( y = 0; y < params.rows; y++ ) {      // rows
      const ampl = (y/params.rows) * params.scaleMax * gridH;

      context.save();
      context.translate( margW, margH );

      let points = [];
      for( x = 0; x < params.cols; x++ ) {    // cols

        const xn = x * cellW;
        const yn = y * cellH;

        // noise
        const n = random.noise2D( xn, yn + frame*10, params.noiseFreq );
        const nn = math.mapRange(n, -1, 1, 0, ampl )

        points.push({ x: xn, y: yn + nn });
      }
      utils.drawCurve( context, points );

      context.restore();
    }

  };
};

canvasSketch(sketch, settings);
