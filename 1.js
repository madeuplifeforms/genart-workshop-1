const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const color = require('canvas-sketch-util/color');
const math = require('canvas-sketch-util/math');

const TWO_PI = 2 * Math.PI;

const settings = {
  dimensions: [ 2400, 1400 ]
};

const params = {
  steps: 50,
  bgColor: "#3d405b",
  colors: ["#f4f1de","#e07a5f","#3d405b","#81b29a","#f2cc8f"],
  colorsWeights: [6, 1, 0, 3, 1],
  maxShiftPerStep: 0.3
}

const colorsParsed = params.colors.map( c => color.parse(c) );

const sketch = ({ context, width, height  }) => {

  const dim = Math.max(width, height);                  // smaller dimension
  const rMax = Math.sqrt(width*width + height*height);  // max radius
  const rStep = rMax / params.steps;                    // radius step

  const centerX = width / 2;
  const centerY = height;
  const margin = dim * 0.1;

  // gradient helper
  const createGradient = (r, color, hueMod, satMod, lightMod) => {
    const gradient = context.createLinearGradient(-r, r, r, -r);
    gradient.addColorStop(0, `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`);
    gradient.addColorStop(1, `hsl(${color[0] + hueMod}, ${color[1] + satMod}%, ${color[2] + lightMod}%)`);

    return gradient;
  }

  const getRandomColor = () => {
    return colorsParsed[random.weighted(params.colorsWeights)];
  }

  const drawArc = (i) => {
    context.save();

    let r, h, s, l, c;
    context.lineWidth = rStep * (1 + params.maxShiftPerStep * 3);

    // radius
    r = rStep * (params.steps - i);

    const color = getRandomColor().hsla;
    h = color[0];
    s = color[1];
    l = color[2];

    // apply color
    context.strokeStyle = createGradient(r, color, -10, -10, -30);
    context.fillStyle = context.strokeStyle;

    // shadow
    context.shadowColor = `rgba(0, 0, 0, 0.3)`;
    context.shadowBlur = dim * 0.2 / params.steps;
    context.shadowOffsetX = dim * 0.003;

    // blur
    context.filter = `blur(${math.clamp(r-rMax/5, 0, rMax)/60}px)`;

    // full arc
    context.beginPath();
    context.arc( 0, 0, r, 0, TWO_PI );

    context.stroke();
    context.shadowColor = 'transparent';
    if( i === params.steps - 1 ) {
      context.fill();
    }

    context.restore();
  }

  const addGrain = () => {
    context.save();
    let grainAlpha;

    const id = context.getImageData(0, 0, width, height);
    const pixels = id.data;
    for( let x = 0; x < width; x++ ) {
      for( let y = 0; y < height; y++ ) {
        grainAlpha = random.range(-1, 1) * 255 * 0.1;    // max 8% darken/lighten

        pixels[y * width * 4 + x * 4 + 0] += grainAlpha;
        pixels[y * width * 4 + x * 4 + 1] += grainAlpha;
        pixels[y * width * 4 + x * 4 + 2] += grainAlpha;
        // pixels[y * width * 4 + x * 4 + 3] // alpha
      }
    }
  
    context.putImageData(id, 0, 0);
    context.restore();
  }

  return () => {

    // background / clear prev
    context.fillStyle = createGradient(
      Math.max(width/2, height/2), 
      color.parse(params.bgColor).hsla, 
      -10, -10, -20
    );
    context.fillRect(0, 0, width, height);


    // translate to center
    context.translate( centerX, centerY );

    const shiftMax = rStep * params.maxShiftPerStep;

    for( let i = params.steps; i >= 0; i-- ) {
      // if(Math.random() < 0.8) continue;

      context.save();
      context.translate( random.range(-shiftMax, shiftMax), random.range(-shiftMax, shiftMax) );
      drawArc( i );
      context.restore();
    }

    // grain
    addGrain();
  };
};

canvasSketch(sketch, settings);
