import * as PIXI from 'pixi.js'; 
import { Sector } from './sector'; 
import { BORDER_COLOR, WHEEL_FILL_COLOR } from './constants'; 

//Класс Wheel отвечает за создание и управление колесом
export class Wheel {
    //конструктор принимает контейнер, ширину экрана, высоту экрана и количество сегментов в качестве параметров
    constructor(container, screenWidth, screenHeight, amountSegments) {
        this.container = container;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.amountSegments = amountSegments; //сохранение количества сегментов
        this.sectors = []; //инициализация массива секторов

        //определяем диаметр колеса (среднее арифметическое между высотой и шириной жкрана / 1.7)
        this.diameterWheelBase = (screenWidth / 1.7 + screenHeight / 1.7) / 2;
        this.radiusWheelBase = this.diameterWheelBase / 2;
        // толщина линии и колеса (диаметр колеса / 140)
        this.borderWheel = this.diameterWheelBase / 140;
        //вычисляем угол сегментов в радианах
        this.angleStep = (2 * Math.PI) / this.amountSegments;

        // //вывод
        // console.log("Диаметр основного колеса: " + this.diameterWheelBase);
    }

    //метод create создает графическое представление колеса
    create() {
        this.wheelBase = new PIXI.Graphics();
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
            this.sectors.push(sector); // добавление сектора в массив секторов
            //добавляем сектор на основу для колеса
            this.wheelBase.addChild(sector.sector);
        }
    }

    //метод getSector возвращает сектор по индексу
    getSector(index) {
        if (index >= 0 && index < this.sectors.length) { //проверка допустимости индекса
            return this.sectors[index]; //возврат сектора
        } else {
            console.error(`Index ${index} is out of bounds for sectors array.`); // вывод ошибки в консоль
            return null;
        }
    }
}