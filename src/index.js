import * as PIXI from 'pixi.js';


const app = new PIXI.Application({ antialias: true, resizeTo: window });

document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();



// круг без границы
graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
graphics.beginFill(0xde3249, 1);
graphics.drawCircle(100, 250, 50);
graphics.endFill();

// круг с границей
graphics.lineStyle(2, 0xfeeb77, 1);
graphics.beginFill(0x650a5a, 1);
graphics.drawCircle(250, 250, 50);
graphics.endFill();

//линия
graphics.lineStyle(20, 0x33ff00);
graphics.moveTo(30, 30);
graphics.lineTo(600, 300);

graphics.endFill();

app.stage.addChild(graphics);


