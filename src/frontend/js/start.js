import * as PIXI from 'pixi.js';
import { Wheel } from './wheel';
import { UI } from './UI';
import { AMOUNT_SECTORS } from './constants';

export class Main {
    constructor(app) {
        this.app = app;

        // контейнер для колеса
        this.containerMain = new PIXI.Container();

        // перемещение контейнера в центр экрана и установка координат x и y контейнера в середину экрана приложения.
        this.containerMain.x = app.screen.width / 2;
        this.containerMain.y = app.screen.height / 2;

        // здесь устанавливается точка поворота (pivot) контейнера в его центр. 
        // это означает, что любые трансформации (например, вращение или масштабирование), 
        // примененные к контейнеру, будут происходить относительно его центра.
        this.containerMain.pivot.x = this.containerMain.width / 2;
        this.containerMain.pivot.y = this.containerMain.height / 2;

        app.stage.addChild(this.containerMain);

        // Инициализация колеса и остального UI
        this.wheel = new Wheel(this.containerMain, app.screen.width, app.screen.height, AMOUNT_SECTORS);
        this.ui = new UI(app, this.wheel);

        // //вывод
        // console.log("Размеры окна: " + app.screen.width + " " + app.screen.height);
        // //вывод
        // console.log("Координаты контейнера: " + this.containerMain.x + " " + this.containerMain.y);
    }

    start() {
        this.wheel.create();
        this.ui.create();
    }
}
