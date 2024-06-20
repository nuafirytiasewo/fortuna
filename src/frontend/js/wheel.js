import * as PIXI from 'pixi.js';
import { Sector } from './sector';
import { BORDER_COLOR, WHEEL_FILL_COLOR } from './constants';

export class Wheel {
    constructor(container, screenWidth, screenHeight, amountSegments) {
        this.container = container;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.amountSegments = amountSegments;

        //определяем диаметр колеса (среднее арифметическое между высотой и шириной жкрана / 1.7)
        this.diameterWheelBase = (screenWidth / 1.7 + screenHeight / 1.7) / 2;
        this.radiusWheelBase = this.diameterWheelBase / 2;
        // толщина линии и колеса (диаметр колеса / 140)
        this.borderWheel = this.diameterWheelBase / 140;

        //основа для колеса
        this.wheelBase = new PIXI.Graphics();
        //вычисляем угол сегментов в радианах
        this.angleStep = (2 * Math.PI) / this.amountSegments;

        // //вывод
        // console.log("Диаметр основного колеса: " + this.diameterWheelBase);
    }

    create() {
        // Основа для колеса
        this.wheelBase.lineStyle(this.borderWheel, BORDER_COLOR, 1);
        this.wheelBase.beginFill(WHEEL_FILL_COLOR, 1);
        this.wheelBase.drawCircle(0, 0, this.radiusWheelBase);
        this.wheelBase.endFill();

        this.wheelBase.x = this.container.width / 2;
        this.wheelBase.y = this.container.height / 2;

        this.container.addChild(this.wheelBase);

        // цикл для рисования секторов
        for (let i = 0; i < this.amountSegments; i++) {
            //рисуем сектор
            const sector = new Sector(this.borderWheel, this.radiusWheelBase, this.angleStep, i);
            sector.create();
            //добавляем сектор на основу для колеса
            this.wheelBase.addChild(sector.sector);
        }
    }
}
