import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ antialias: true, resizeTo: window });

globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);

//контейнер
const container = new PIXI.Container();
//добавляем контейнер на сцену
app.stage.addChild(container);
//вывод
console.log("Размеры окна: " + app.screen.width + " " + app.screen.height);
// Перемещение контейнера в центр экрана и установка координат x и y контейнера в середину экрана приложения.
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;
//вывод
console.log("Координаты контейнера: " + container.x + " " + container.y);
// Здесь устанавливается точка поворота (pivot) контейнера в его центр. 
// Это означает, что любые трансформации (например, вращение или масштабирование), 
// примененные к контейнеру, будут происходить относительно его центра.
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;


//определяем диаметр колеса
const diameterWheelBase = app.screen.width / 3;
//вывод
console.log("Диаметр основного колеса: " + diameterWheelBase);
// толщина линии и колеса
const borderWheel = diameterWheelBase / 140;

//основа для колеса
const wheelBase = new PIXI.Graphics();
// граница круга (толщина, цвет, прозрачность)
wheelBase.lineStyle(borderWheel, 0xfeeb77, 1);
// заполнение(цвет,прозрачность)
wheelBase.beginFill(0x650a5a, 1);
//рисование круга(коорд x коорд y)
wheelBase.drawCircle(0, 0, diameterWheelBase / 2);
//заканчиваем заполнение
wheelBase.endFill();
//добавляем основу для колеса
container.addChild(wheelBase);
// Перемещение основы колеса в центр контейнера и установка координат x и y в середину контейнера.
wheelBase.x = container.width / 2;
wheelBase.y = container.height / 2;
console.log("Координаты основного колеса: " + container.x + " " + container.y);
// точка поворота в центре основы колеса
wheelBase.pivot.x = wheelBase.width / 2;
wheelBase.pivot.y = wheelBase.height / 2;

//круг в центре (кнопка)
const wheelMini = new PIXI.Graphics();
// граница круга (толщина, цвет, прозрачность)
wheelMini.lineStyle(0);
// заполнение(цвет,прозрачность)
wheelMini.beginFill(0xde3249, 1);
//рисование круга(коорд x коорд y)
wheelMini.drawCircle(0, 0, (diameterWheelBase / 2) / 10);
//заканчиваем заполнение
wheelMini.endFill();
//добавляем круг на основу для колеса
wheelBase.addChild(wheelMini);
// Перемещение центрального круга в центр основы колеса и установка координат x и y в середину основы колеса.
wheelMini.x = wheelBase.width / 2;
wheelMini.y = wheelBase.height / 2;
console.log("Координаты кнопки: " + container.x + " " + container.y);
// точка поворота в центре основы колеса
wheelMini.pivot.x = wheelMini.width / 2;
wheelMini.pivot.y = wheelMini.height / 2;

// console.log(wheelChild.height);

//линия, разделяющая сегменты
const lineSegment = new PIXI.Graphics();
// граница линии (толщина, цвет, прозрачность)
lineSegment.lineStyle(borderWheel, 0xfeeb77);
// где линия начинается
lineSegment.moveTo(-wheelBase.width / 2, -wheelBase.height / 2);
// где линия заканчивается
lineSegment.lineTo(wheelBase.width / 2, wheelBase.height / 2);
//заканчиваем заполнение
lineSegment.endFill();
//добавляем линию на основу для колеса
wheelBase.addChild(lineSegment);


// обработчик
app.ticker.add((delta) =>
{
    // вращение контейнера
    container.rotation -= 0.01 * delta;
});