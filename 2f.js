const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const color = require('canvas-sketch-util/color');
const utils = require('./utils.js');


const settings = {
  dimensions: [ 2000, 2000 ],
  animate: true,
  fps: 30,
  // duration: 5
};

const params = {
  rows: 20,
  cols: 20,
  scaleMax: 0.1,
  noiseFreq: 0.003,

  bgColor: "#e07a5f",
  fgColor: "#3d405b",
  colors: ["#f4f1de","#e07a5f","#3d405b","#81b29a","#f2cc8f"],
}

const sketch = ({ context, width, height }) => {

  const dim = Math.min(width, height);
  const centerX = width * 0.5;
  const centerY = height * 0.5;

  const gridW = width// * 0.8;
  const gridH = height// * 0.8;
  const margW = 0 //(width - gridW) * 0.5;
  const margH = 0 //(height - gridH) * 0.5;
  const cellW = gridW / params.cols;
  const cellH = gridH / params.rows;

  const colors = Array.from(Array(params.rows).keys()).map( i => color.parse(params.fgColor).hsl )

  return ({ frame }) => {
    // context.fillStyle = params.bgColor;
    const bgColor = color.parse( params.bgColor ).hsl;
    context.fillStyle = utils.createLinearGradient( context, 0, height, width, 0, [ 
      `hsla(${bgColor[0]}, ${bgColor[1]}%, ${bgColor[2] - 20}%, 1)`,
      `hsla(${bgColor[0] - 120}, ${bgColor[1] + 20}%, ${bgColor[2] + 30}%, 1)`
    ] );
    context.fillRect(0, 0, width, height);

    context.strokeStyle = params.fgColor;
    
    for( y = 0; y < params.rows; y++ ) {      // rows
      
      const ampl = (1 - (y/params.rows)) * params.scaleMax * gridH;
      context.lineWidth = (y/params.rows) * dim * 0.01;

      context.save();
      context.translate( margW, margH );

      const c = colors[y];
      context.fillStyle = `hsla(${c[0]}, ${c[1]}%, ${c[2]}%, ${math.mapRange(y, 0, params.rows, 0, 0.3)})`;
      context.strokeStyle = `hsla(${c[0]}, ${c[1]}%, ${c[2]}%, ${math.mapRange(y, 0, params.rows, 0, 0.1)})`

      let points = [], xn, yn, n, nn;
      for( x = 0; x <= params.cols; x++ ) {    // cols

        xn = x * cellW;
        yn = y * cellH;

        // noise
        n = random.noise2D( xn + frame*5, yn + frame*4, params.noiseFreq );
        nn = math.mapRange(n, -1, 1, 0, ampl )

        points.push({ x: xn, y: yn + nn });
      }
      context.beginPath();
      utils.drawCurve( context, points );
      // context.stroke();
      context.lineTo(xn, gridH)
      context.lineTo(0, gridH )
      context.lineTo(points[0].x, points[0].y)
      context.fill();

      context.restore();
    }

  };
};

canvasSketch(sketch, settings);
