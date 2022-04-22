const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2000, 2000 ]
};

const params = {
  rows: 20,
  cols: 20
}

const sketch = ({ context, width, height }) => {

  const dim = Math.min(width, height);
  const gridW = width * 0.8;
  const gridH = height * 0.8;
  const margW = (width - gridW) * 0.5;
  const margH = (height - gridH) * 0.5;
  const cellW = gridW / params.cols;
  const cellH = gridH / params.rows;

  return () => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);


    context.strokeStyle = `black`;

    for( x = 0; x < params.cols; x++ ) {
      for( y = 0; y < params.rows; y++ ) {
        context.save();

        context.lineWidth = dim * 0.002;

        // position
        context.translate( x * cellW, y * cellH);
        context.translate( margW, margH );

        // draw point
        context.moveTo(0,0);
        context.lineTo( cellW * 0.8, 0 );
        context.stroke();

        context.restore();
      }
    }

  };
};

canvasSketch(sketch, settings);
