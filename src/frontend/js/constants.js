import * as PIXI from 'pixi.js';

export const TEXT_STYLE = {
    fontFamily: 'Arial',
    dropShadow: true,
    dropShadowAlpha: 0.8,
    dropShadowAngle: 2.1,
    dropShadowBlur: 4,
    dropShadowColor: '0x111111',
    dropShadowDistance: 10,
    fill: ['#ffffff'],
    stroke: '#004620',
    fontSize: 60,
    fontWeight: 'lighter',
    lineJoin: 'round',
    strokeThickness: 12,
};

//скорость вращения колеса
export const SPEED_ROTATION_WHEEL = 0.15;
//количество секторов
export const AMOUNT_SECTORS = 5;
//размер алмазов
export const SIZE_DIAMOND_COEFF = 0.4;
//размер количества алмазов
export const SIZE_AMOUNT_DIAMOND_COEFF = 0.3;
//цвет кнопки
export const BUTTON_COLOR = 0xde3249;
//цвет границ колеса
export const BORDER_COLOR = 0xfeeb77;
//цвет заполнения колеса
export const WHEEL_FILL_COLOR = 0x650a5a;
//сколько всего алмазов у пользователя
export const TEXT = "100";
//текст по умолчанию на кнопке
export const BUTTON_TEXT = "Старт";
// загружаем текстуру для алмаза
export const DIAMOND_TEXTURE = PIXI.Texture.from('src/frontend/images/diamond.png');