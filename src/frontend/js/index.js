import * as PIXI from 'pixi.js';
import { Main } from './start';

const app = new PIXI.Application({ antialias: true, resizeTo: window });
globalThis.__PIXI_APP__ = app;
document.body.appendChild(app.view);

const main = new Main(app);
main.start();
