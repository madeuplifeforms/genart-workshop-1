const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const color = require('canvas-sketch-util/color');
const math = require('canvas-sketch-util/math');

const TWO_PI = 2 * Math.PI;

const settings = {
  dimensions: [ 2000, 2000 ],
  // animate: true
};

const params = {
  steps: 50,
  bgColor: "#3d405b",
  colors: ["#f4f1de","#e07a5f","#3d405b","#81b29a","#f2cc8f"],
  colorsWeights: [60, 10, 0, 30, 10],
  // rows: 10,
  // cols: 200
}

const colorsParsed = params.colors.map( c => color.parse(c) );
// const cellX = settings.dimensions[0] / params.cols;
// const cellY = settings.dimensions[1] / params.rows;

const sketch = ({ context, width, height  }) => {

  const dim = Math.min(width, height);
  const rStep = dim / params.steps;

  const centerX = width / 2;
  const centerY = height / 2;
  const margin = dim * 0.1;

  // const hueShift = random.range(-50, 50);


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
    context.lineWidth = rStep * 1.2;

    // radius
    r = rStep * (params.steps - i);
    r *= 1/1.42;

    if( r >= 0.5 * ( dim - margin ) ) {
      context.restore();
      return;
    }

    // color
    // hue = Math.floor( 50 * Math.sin(TWO_PI * i/steps) + 60 + hueShift );
    // lightness = math.mapRange(i, 0, steps, 0, 80);

    const color = getRandomColor().hsla;
    h = color[0];
    s = color[1];
    l = color[2];

    // apply color
    // c = `hsla(${hue}, 50%, ${lightness}%, 1)`;
    // c = `hsl(${color[0]}, ${color[1]}, ${color[2]})`
    context.strokeStyle = createGradient(r, color, -10, -10, -30);

    // shadow
    context.shadowColor = `rgba(0, 0, 0, 0.4)`;
    context.shadowBlur = dim * 0.2 / params.steps;
    context.shadowOffsetX = dim * 0.005;

    // full arc
    context.beginPath();
    context.arc( 0, 0, r, 0, TWO_PI );
    context.stroke();

    context.shadowColor = 'transparent';

    // part arc
    // for( let i = 0; i < 1; i++ ) {
    //   c = `hsla(${h}, ${s}%, ${l}%, 0.2)`;

    //   gradient = createGradient(r, color, -10, -10, -30);

    //   context.strokeStyle = gradient;
    //   context.rotate(math.degToRad(random.range(0, 360)));
    //   context.beginPath();
    //   context.arc( 0, 0, r, 0, math.degToRad(random.range(0, 180)), math.degToRad(random.range(180, 360)) );
    //   context.stroke();
    // }

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

  return ({}) => {
    // background / clear prev
    // context.fillStyle = params.bgColor;
    context.fillStyle = createGradient(
      Math.max(width/2, height/2), 
      color.parse(params.bgColor).hsla, 
      -10, -10, -20
    );
    context.fillRect(0, 0, width, height);


    // translate to center
    context.translate( centerX, centerY );

    const shiftMax = rStep * 2.8;
    for( let i = params.steps; i >= 0; i-- ) {
      if(Math.random() < 0.8) continue;

      context.save();
      // context.translate( Math.pow(i, 2) * 0.5, 0 );
      context.translate( random.range(-shiftMax, shiftMax), random.range(-shiftMax, shiftMax) );

      drawArc( i );
      context.restore();
    }

    // grain
    addGrain();
  };
};

canvasSketch(sketch, settings);
