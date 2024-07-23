import * as PIXI from 'pixi.js';
import { TEXT_STYLE, INITIAL_SPEED_ROTATION_WHEEL, MAX_SPEED_ROTATION_WHEEL, TEXT, BUTTON_TEXT_START, BUTTON_TEXT_STOP, BUTTON_COLOR, DIAMOND_TEXTURE, ARROW_COLOR, ARROW_SIZE } from './constants';

//Класс UI отвечает за создание интерфейса пользователя
export class UI {
    //конструктор принимает приложение (app) и колесо (wheel) в качестве параметров
    constructor(app, wheel) {
        this.app = app; //сохранение ссылки на приложение
        this.wheel = wheel; //сохранение ссылки на колесо
        this.speedRotationWheel = Math.random() * (0.15 - INITIAL_SPEED_ROTATION_WHEEL) + INITIAL_SPEED_ROTATION_WHEEL; //начальная скорость вращения колеса
        this.maxSpeedRotationWheel = Math.random() * (0.9 - MAX_SPEED_ROTATION_WHEEL) + MAX_SPEED_ROTATION_WHEEL; //максимальная скорость вращения колеса
        this.start = true; //флаг, указывающий на начальное состояние кнопки "Старт"
        this.arrow = null; //указатель на графику стрелки
        this.totalDiamonds = 100; //начальное количество алмазов
        this.totalDiamondsText = null; //указатель на текстовое поле с общим количеством алмазов
        this.isSpinning = false; //флаг, указывающий на то, что колесо крутится
        this.isStopped = true; //флаг, указывающий на то, что колесо остановлено
        this.deceleration = 0.98; //коэффициент замедления
        this.acceleration = 1.05; //коэффициент ускорения

        this.wheelButton = null; //указатель на кнопку
        this.buttonText = null; //указатель на текст кнопки
    }

    //метод create создает элементы интерфейса
    create() {
        //создание кнопки
        this.wheelButton = new PIXI.Graphics();
        this.wheelButton.lineStyle(0); //без обводки
        this.wheelButton.beginFill(BUTTON_COLOR, 1); //заливка цветом BUTTON_COLOR
        this.wheelButton.drawCircle(0, 0, this.wheel.radiusWheelBase / 8); //рисование круга
        this.wheelButton.endFill();
        this.wheelButton.x = this.app.screen.width / 2; //позиционирование по горизонтали
        this.wheelButton.y = this.app.screen.height / 2; //позиционирование по вертикали

        //создание текста кнопки
        this.buttonText = new PIXI.Text(BUTTON_TEXT_START, TEXT_STYLE);
        this.buttonText.anchor.set(0.5); //центрирование текста
        this.buttonText.scale.x = this.wheel.radiusWheelBase / 800; //масштабирование текста по X
        this.buttonText.scale.y = this.wheel.radiusWheelBase / 800; //масштабирование текста по Y
        this.buttonText.x = 0; //позиционирование по горизонтали
        this.buttonText.y = 0; //позиционирование по вертикали

        this.wheelButton.addChild(this.buttonText); //добавление текста к кнопке

        this.app.stage.addChild(this.wheelButton); //добавление кнопки на сцену
        this.wheelButton.interactive = true; //включение интерактивности
        this.wheelButton.buttonMode = true; //режим кнопки
        this.wheelButton.on('pointerdown', this.onClick.bind(this)); //добавление обработчика клика

        //создание текста с общим количеством алмазов
        this.totalDiamondsText = new PIXI.Text(this.totalDiamonds, TEXT_STYLE);
        this.totalDiamondsText.anchor.set(0.5); //центрирование текста
        this.totalDiamondsText.x = this.app.screen.width / 2 + this.app.screen.width / 4; //позиционирование по горизонтали
        this.totalDiamondsText.y = this.app.screen.height / 2 - this.app.screen.height / 4 - this.app.screen.height / 8; //позиционирование по вертикали
        this.totalDiamondsText.scale.x = this.wheel.radiusWheelBase / 400; //масштабирование текста по X
        this.totalDiamondsText.scale.y = this.wheel.radiusWheelBase / 400; //масштабирование текста по Y
        this.app.stage.addChild(this.totalDiamondsText); //добавление текста на сцену
        
        //создание иконки алмаза
        const iconDiamond = new PIXI.Sprite(DIAMOND_TEXTURE);
        iconDiamond.x = this.app.screen.width / 2 + this.app.screen.width / 4 + this.app.screen.width / 8; //позиционирование по горизонтали
        iconDiamond.y = this.app.screen.height / 2 - this.app.screen.height / 4 - this.app.screen.height / 8; //позиционирование по вертикали
        iconDiamond.anchor.set(0.5); //центрирование иконки
        iconDiamond.scale.x = this.wheel.radiusWheelBase / 400; //масштабирование иконки по X
        iconDiamond.scale.y = this.wheel.radiusWheelBase / 400; //масштабирование иконки по Y
        this.app.stage.addChild(iconDiamond); //добавление иконки на сцену

        //создание стрелки
        this.arrow = new PIXI.Graphics();
        this.arrow.beginFill(ARROW_COLOR); //заливка цветом ARROW_COLOR
        this.arrow.moveTo(-ARROW_SIZE, 0); //начало треугольника
        this.arrow.lineTo(ARROW_SIZE, 0); //вторая точка треугольника
        this.arrow.lineTo(0, -ARROW_SIZE * 2); //вершина треугольника
        this.arrow.lineTo(-ARROW_SIZE, 0); //завершение треугольника
        this.arrow.endFill();
        this.arrow.x = this.app.screen.width / 2; //позиционирование по горизонтали
        this.arrow.y = this.app.screen.height / 2 - this.wheel.radiusWheelBase; //позиционирование по вертикали
        this.arrow.rotation = Math.PI; //поворот стрелки
        this.app.stage.addChild(this.arrow); //добавление стрелки на сцену
    }

    //метод onClick обрабатывает нажатие кнопки
    onClick() {
        if (this.isStopped && this.start) { //если колесо остановлено и кнопка в состоянии "Старт"
            if (this.totalDiamonds >= 50) { //проверяем, достаточно ли алмазов для вращения
                this.totalDiamonds -= 50; //списываем 50 алмазов
                this.totalDiamondsText.text = this.totalDiamonds; //обновляем текст с общим количеством алмазов
                this.app.ticker.add(this.accelerateWheel, this); //добавление функции ускорения к тикеру
                this.isSpinning = true; //установка флага вращения
                this.isStopped = false; //установка флага, что колесо не остановлено
                this.buttonText.text = BUTTON_TEXT_STOP; //изменение текста кнопки на "Стоп"
                this.start = false; //изменение состояния кнопки
            } else {
                console.log("Недостаточно алмазов для вращения."); //сообщаем, если недостаточно алмазов
            }
        } else if (this.isSpinning && !this.start) { //если колесо вращается и кнопка в состоянии "Стоп"
            this.isSpinning = false; //остановка вращения
            this.buttonText.text = BUTTON_TEXT_START; //изменение текста кнопки на "Старт"
            this.start = true; //изменение состояния кнопки
            this.app.ticker.add(this.decelerateWheel, this); //добавление функции замедления к тикеру
        }
    }

    //метод accelerateWheel отвечает за ускорение колеса
    accelerateWheel(delta) {
        if (this.isSpinning) { //если колесо вращается
            this.speedRotationWheel = Math.min(this.speedRotationWheel * this.acceleration, this.maxSpeedRotationWheel); //увеличение скорости вращения с учетом максимальной скорости
            this.wheel.container.rotation += this.speedRotationWheel * delta; //вращение контейнера колеса

            if (this.speedRotationWheel >= this.maxSpeedRotationWheel) { //если достигнута максимальная скорость
                this.app.ticker.remove(this.accelerateWheel, this); //удаление функции ускорения из тикера
                this.app.ticker.add(this.rotateWheel, this); //добавление функции постоянного вращения к тикеру
            }
        }
    }

    //метод rotateWheel отвечает за постоянное вращение колеса
    rotateWheel(delta) {
        if (this.isSpinning) { //если колесо вращается
            this.wheel.container.rotation += this.speedRotationWheel * delta; //вращение контейнера колеса
        }
    }

    //метод decelerateWheel отвечает за замедление колеса
    decelerateWheel(delta) {
        this.speedRotationWheel *= this.deceleration; //уменьшение скорости вращения
        this.wheel.container.rotation += this.speedRotationWheel * delta; //вращение контейнера колеса

        if (Math.abs(this.speedRotationWheel) < 0.001) { //если скорость практически нулевая
            this.speedRotationWheel = 0; //установка скорости в 0
            this.app.ticker.remove(this.decelerateWheel, this); //удаление функции замедления из тикера
            this.calculateWinningSector(); //вычисление выигрышного сектора
            this.resetWheel(); //сброс состояния колеса
        }
    }

    // метод calculateWinningSector вычисляет выигрышный сектор
    calculateWinningSector() {
        const currentRotation = (this.wheel.container.rotation + 2 * Math.PI) % (2 * Math.PI); //получаем текущий угол вращения колеса
        const sectors = this.wheel.sectors; //получаем все секторы
    
        const arrowAngle = (-this.arrow.rotation + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI); //вычисляем угол стрелки
        const targetAngle = (arrowAngle - currentRotation + 2 * Math.PI) % (2 * Math.PI); //вычисляем целевой угол, на котором остановится стрелка
    
        for (let sector of sectors) { //проходим по всем секторам
            const sectorStartAngle = (sector.angleStep * sector.index + 2 * Math.PI) % (2 * Math.PI); //вычисляем начальный угол сектора
            const sectorEndAngle = (sector.angleStep * (sector.index + 1) + 2 * Math.PI) % (2 * Math.PI); //вычисляем конечный угол сектора
    
            if (sectorEndAngle < sectorStartAngle) { //если сектор пересекает границу 0/2π
                if (targetAngle >= sectorStartAngle || targetAngle < sectorEndAngle) { //если целевой угол попадает в этот сектор
                    const amountDiamonds = sector.getAmountDiamonds(); //получаем количество алмазов для этого сектора
                    console.log("Вы выиграли " + amountDiamonds + " алмазов"); //выводим количество выигранных алмазов
                    this.totalDiamonds += parseInt(amountDiamonds); //добавляем выигранные алмазы к общему количеству
                    this.totalDiamondsText.text = this.totalDiamonds; //обновляем текст с общим количеством алмазов
                    return; //выходим из функции
                }
            } else { //если сектор не пересекает границу 0/2π
                if (targetAngle >= sectorStartAngle && targetAngle < sectorEndAngle) { //если целевой угол попадает в этот сектор
                    const amountDiamonds = sector.getAmountDiamonds(); //получаем количество алмазов для этого сектора
                    console.log("Вы выиграли " + amountDiamonds + " алмазов"); //выводим количество выигранных алмазов
                    this.totalDiamonds += parseInt(amountDiamonds); //добавляем выигранные алмазы к общему количеству
                    this.totalDiamondsText.text = this.totalDiamonds; //обновляем текст с общим количеством алмазов
                    return; //выходим из функции
                }
            }
        }
    
        console.log("Сектор не найден."); //если ни один сектор не найден
    }

    //метод resetWheel сбрасывает состояние колеса
    resetWheel() {
        this.start = true; //установка состояния кнопки в "Старт"
        this.isStopped = true; //установка флага остановки колеса
        this.buttonText.text = BUTTON_TEXT_START; //изменение текста кнопки на "Старт"
        this.isSpinning = false; //установка флага, что колесо не вращается
        this.speedRotationWheel = INITIAL_SPEED_ROTATION_WHEEL; //сброс скорости вращения к начальной
        this.app.ticker.remove(this.rotateWheel, this); //удаление функции постоянного вращения из тикера
    }

    //метод getTextStyle возвращает стиль текста
    getTextStyle() {
        return TEXT_STYLE;
    }
}
