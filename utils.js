// https://localcoder.org/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
// http://scaledinnovation.com/analytics/splines/aboutSplines.html
export const drawCurve = (ctx, points, tension) => {
    // ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    var t = (tension != null) ? tension : 1;
    for (var i = 0; i < points.length - 1; i++) {
        var p0 = (i > 0) ? points[i - 1] : points[0];
        var p1 = points[i];
        var p2 = points[i + 1];
        var p3 = (i != points.length - 2) ? points[i + 2] : p2;

        var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
        var cp1y = p1.y + (p2.y - p0.y) / 6 * t;

        var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
        var cp2y = p2.y - (p3.y - p1.y) / 6 * t;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    // ctx.stroke();
}

export const createLinearGradient = (context, x0, y0, x1, y1, colorStops) => {
    const gradient = context.createLinearGradient(x0, y0, x1, y1);
    colorStops.forEach( (cs, i) => {
        gradient.addColorStop(i/(colorStops.length-1), cs);
    })

    return gradient;
}