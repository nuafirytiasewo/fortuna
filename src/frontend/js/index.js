import * as PIXI from 'pixi.js';
import { Main } from './start';

const app = new PIXI.Application({ 
    antialias: true,  //включаем сглаживание
    backgroundColor: 0x000000 //устанавливаем черный фон
});
globalThis.__PIXI_APP__ = app;
document.body.appendChild(app.view);

const main = new Main(app);
main.start();


//функция для масштабирования и центрирования canvas
function resizeCanvas() {
    const viewportWidth = window.innerWidth; //ширина окна браузера
    const viewportHeight = window.innerHeight; //высота окна браузера
    const scale = Math.min(viewportWidth / app.screen.width, viewportHeight / app.screen.height); //вычисляем масштаб
    const scaledWidth = app.screen.width * scale; //масштабированная ширина
    const scaledHeight = app.screen.height * scale; //масштабированная высота

    app.view.style.width = `${scaledWidth}px`; //устанавливаем ширину canvas
    app.view.style.height = `${scaledHeight}px`; //устанавливаем высоту canvas
    app.view.style.position = 'absolute'; //устанавливаем позиционирование
    app.view.style.left = `${(viewportWidth - scaledWidth) / 2}px`; //центрируем по горизонтали
    app.view.style.top = `${(viewportHeight - scaledHeight) / 2}px`; //центрируем по вертикали
}

//обработчик для изменения размера окна
window.addEventListener('resize', resizeCanvas);

//инициализация размера canvas
resizeCanvas();