import * as PIXI from 'pixi.js';
import { BORDER_COLOR, DIAMOND_TEXTURE , AMOUNT_SECTORS , TEXT_STYLE , SIZE_DIAMOND_COEFF , SIZE_AMOUNT_DIAMOND_COEFF} from './constants';

export class Sector {
    constructor(borderWheel, radiusWheelBase, angleStep, index) {
        this.borderWheel = borderWheel;
        this.radiusWheelBase = radiusWheelBase;
        this.angleStep = angleStep;
        this.index = index;
        this.sector = new PIXI.Graphics();
    }

    create() {
        // граница сектора (толщина, цвет, прозрачность)
        this.sector.lineStyle(this.borderWheel, BORDER_COLOR);
        //рандомный цвет
        const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        this.sector.beginFill("0x" + randomColor, 1);

        // рассчитываем углы для текущего и следующего секторов
        let startAngle = this.angleStep * this.index;
        let endAngle = this.angleStep * (this.index + 1);

        // начало сектора (перемещение пера в эту точку - середину колеса)
        this.sector.moveTo(0, 0);

        // линия к первой точке на окружности
        //координаты для того чтобы вычислить где будет точка на окружности колеса
        let x1 = this.radiusWheelBase * Math.cos(startAngle);
        let y1 = this.radiusWheelBase * Math.sin(startAngle);

        //проводим линию к точке, к которой уже проведена линия 1
        this.sector.lineTo(x1, y1);
        //дуга до следующей точки
        this.sector.arc(0, 0, this.radiusWheelBase, startAngle, endAngle);
        //обратно возвращаемся к центру колеса
        this.sector.lineTo(0, 0);
        //замыкаем фигуру
        this.sector.closePath();
        //заканчиваем заполнение
        this.sector.endFill();

        //выполняем функции по добавлению текста и алмазов на сектор
        this.addDiamond(startAngle, endAngle);
        this.addText(startAngle, endAngle);
    }

    //добавление алмаза на сектор
    addDiamond(startAngle, endAngle) {
        // средний угол для текущего сектора
        let middleAngle = (startAngle + endAngle) / 2;
        // вычисляем координаты для того чтобы алмаз был в середине сектора
        let diamondX = (this.radiusWheelBase / 2) * Math.cos(middleAngle);
        let diamondY = (this.radiusWheelBase / 2) * Math.sin(middleAngle);

        // создаем спрайт для алмаза
        const diamond = new PIXI.Sprite(DIAMOND_TEXTURE);
        // устанавливаем координаты для алмаза
        diamond.x = diamondX;
        diamond.y = diamondY;
        // центр спрайта будет находиться в координатах (diamondX, diamondY)
        diamond.anchor.set(0.5);
        //чем больше сегментов, тем меньше алмаз и наоборот
        diamond.scale.x = 1 / (AMOUNT_SECTORS * SIZE_DIAMOND_COEFF);
        diamond.scale.y = 1 / (AMOUNT_SECTORS * SIZE_DIAMOND_COEFF);
        console.log("Размер алмаза " + diamond.scale.x + " " + diamond.scale.y);
        // правильный наклон относительно секторов
        diamond.rotation = middleAngle + Math.PI / 2;
        //добавляем алмаз на сектор
        this.sector.addChild(diamond);
    }

    //добавление алмаза на сектор
    addText(startAngle, endAngle) {
        // средний угол для текущего сектора
        let middleAngle = (startAngle + endAngle) / 2;
        // случайное значение от 0.01 до 100
        let randomValue = Math.random() * (100 - 0.01) + 0.01;
        // округление до двух знаков после запятой
        randomValue = randomValue.toFixed(2);

        //сколько будет алмазов на секторе
        const amountDiamond = new PIXI.Text(randomValue, TEXT_STYLE);
        // вычисляем координаты текста чтобы были немного выше алмаза
        // (r/5)*4 потому что мы смещаемся вверх на 4/5 
        amountDiamond.x = (this.radiusWheelBase / 5 * 4) * Math.cos(middleAngle);
        amountDiamond.y = (this.radiusWheelBase / 5 * 4) * Math.sin(middleAngle);
        // центр спрайта будет находиться в координатах (amountDiamondX, amountDiamondY)
        amountDiamond.anchor.set(0.5);
        //чем больше сегментов, тем меньше текст колва алмазов и наоборот
        amountDiamond.scale.x = 1 / (AMOUNT_SECTORS * SIZE_AMOUNT_DIAMOND_COEFF);
        amountDiamond.scale.y = 1 / (AMOUNT_SECTORS * SIZE_AMOUNT_DIAMOND_COEFF);
        console.log("Размер алмаза " + amountDiamond.scale.x + " " + amountDiamond.scale.y);
        // правильный наклон относительно секторов
        amountDiamond.rotation = middleAngle + Math.PI / 2;
        //добавляем текст на сектор
        this.sector.addChild(amountDiamond);
    }
}
