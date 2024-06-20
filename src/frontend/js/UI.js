import * as PIXI from 'pixi.js';
import { TEXT_STYLE, SPEED_ROTATION_WHEEL, TEXT, BUTTON_TEXT, BUTTON_COLOR , DIAMOND_TEXTURE } from './constants';

export class UI {
    constructor(app, wheel) {
        this.app = app;
        this.wheel = wheel;
        this.speedRotationWheel = SPEED_ROTATION_WHEEL;
        this.start = true;
    }

    create() {
        //круг в центре (кнопка)
        const wheelButton = new PIXI.Graphics();
        // граница круга (толщина, цвет, прозрачность)
        wheelButton.lineStyle(0);
        // заполнение(цвет,прозрачность)
        wheelButton.beginFill(BUTTON_COLOR, 1);
        //рисование круга(коорд x коорд y радиус)
        wheelButton.drawCircle(0, 0, this.wheel.radiusWheelBase / 8);
        //заканчиваем заполнение
        wheelButton.endFill();
        // Перемещение контейнера в центр экрана и установка координат x и y контейнера в середину экрана приложения.
        wheelButton.x = this.app.screen.width / 2;
        wheelButton.y = this.app.screen.height / 2;

        //текст на кнопке
        const buttonText = new PIXI.Text(BUTTON_TEXT, TEXT_STYLE);
        buttonText.anchor.set(0.5);
        buttonText.scale.x = this.wheel.radiusWheelBase / 800;
        buttonText.scale.y = this.wheel.radiusWheelBase / 800;
        wheelButton.addChild(buttonText);

        //добавляем кнопку на сцену
        this.app.stage.addChild(wheelButton);

        //обработка нажатий на кнопку
        wheelButton.eventMode = 'static';
        wheelButton.cursor = 'pointer';
        wheelButton.on('pointerdown', this.onClick.bind(this));

        //сколько алмазов всего у пользователя
        const totalDiamonds = new PIXI.Text(TEXT, TEXT_STYLE);
        totalDiamonds.anchor.set(0.5);
        totalDiamonds.x = this.app.screen.width / 2 + this.app.screen.width / 4;
        totalDiamonds.y = this.app.screen.height / 2 - this.app.screen.height / 4 - this.app.screen.height / 8;
        totalDiamonds.scale.x = this.wheel.radiusWheelBase / 400;
        totalDiamonds.scale.y = this.wheel.radiusWheelBase / 400;
        //добавляем количество алмазов у пользователя на сцену
        this.app.stage.addChild(totalDiamonds);
        
        // создаем спрайт для алмаза
        const iconDiamond = new PIXI.Sprite(DIAMOND_TEXTURE);
        // устанавливаем координаты для алмаза
        iconDiamond.x = this.app.screen.width / 2 + this.app.screen.width / 4 + this.app.screen.width / 8;
        iconDiamond.y = this.app.screen.height / 2 - this.app.screen.height / 4 - this.app.screen.height / 8;
        // центр спрайта будет находиться в координатах (diamondX, diamondY)
        iconDiamond.anchor.set(0.5);
        iconDiamond.scale.x = this.wheel.radiusWheelBase / 400;
        iconDiamond.scale.y = this.wheel.radiusWheelBase / 400;
        //добавляем алмаз на сцену
        this.app.stage.addChild(iconDiamond);
    }

    //при нажатии на кнопку
    onClick() {
        if (this.start) {
            // обработчик
            this.app.ticker.add((delta) => {
                // вращение контейнера
                this.wheel.container.rotation += this.speedRotationWheel * delta;
            });
        } else {
            this.app.ticker.add((delta) => {
                this.wheel.container.rotation += this.speedRotationWheel * delta;
            });
        }
        this.start = !this.start;
    }

    getTextStyle() {
        return TEXT_STYLE;
    }
}
