import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ antialias: true, resizeTo: window });

globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);

//контейнер для колеса
const containerMain = new PIXI.Container();

// Перемещение контейнера в центр экрана и установка координат x и y контейнера в середину экрана приложения.
containerMain.x = app.screen.width / 2;
containerMain.y = app.screen.height / 2;

// Здесь устанавливается точка поворота (pivot) контейнера в его центр. 
// Это означает, что любые трансформации (например, вращение или масштабирование), 
// примененные к контейнеру, будут происходить относительно его центра.
containerMain.pivot.x = containerMain.width / 2;
containerMain.pivot.y = containerMain.height / 2;

//вывод
console.log("Размеры окна: " + app.screen.width + " " + app.screen.height);
//вывод
console.log("Координаты контейнера: " + containerMain.x + " " + containerMain.y);



//определяем диаметр колеса (ширина жкрана / 3)
const diameterWheelBase = app.screen.width / 3;
//вывод
console.log("Диаметр основного колеса: " + diameterWheelBase);
// толщина линии и колеса (диаметр колеса / 140)
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

// Перемещение основы колеса в центр контейнера и установка координат x и y в середину контейнера.
wheelBase.x = containerMain.width / 2;
wheelBase.y = containerMain.height / 2;
console.log("Координаты основного колеса: " + wheelBase.x + " " + wheelBase.y);
console.log("Размер основного колеса: " + wheelBase.width + " " + wheelBase.height);

//линия, разделяющая сегменты
const lineSegment = new PIXI.Graphics();
// граница линии (толщина, цвет, прозрачность)
lineSegment.lineStyle(borderWheel, 0xfeeb77);
// где линия начинается (относительно колеса, по x в 0, а по y - в точке, значение которой равно радиус колеса)
lineSegment.moveTo(0, diameterWheelBase / 2);
// где линия заканчивается
lineSegment.lineTo(0, 0);
//заканчиваем заполнение
lineSegment.endFill();



//круг в центре (кнопка)
const wheelButton = new PIXI.Graphics();
// граница круга (толщина, цвет, прозрачность)
wheelButton.lineStyle(0);
// заполнение(цвет,прозрачность)
wheelButton.beginFill(0xde3249, 1);
//рисование круга(коорд x коорд y)
wheelButton.drawCircle(0, 0, (diameterWheelBase / 2) / 10);
//заканчиваем заполнение
wheelButton.endFill();



//добавляем линию на основу для колеса
wheelBase.addChild(lineSegment);

//добавляем основу для колеса
containerMain.addChild(wheelBase);

//добавляем круг на основу для колеса
containerMain.addChild(wheelButton);

//добавляем контейнер на сцену
app.stage.addChild(containerMain);

// обработчик
app.ticker.add((delta) =>
{
    // вращение контейнера
    containerMain.rotation += 0.01 * delta;
});