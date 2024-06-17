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
const radiusWheelBase = diameterWheelBase / 2;
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
wheelBase.drawCircle(0, 0, radiusWheelBase);
//заканчиваем заполнение
wheelBase.endFill();

// Перемещение основы колеса в центр контейнера и установка координат x и y в середину контейнера.
wheelBase.x = containerMain.width / 2;
wheelBase.y = containerMain.height / 2;
console.log("Координаты основного колеса: " + wheelBase.x + " " + wheelBase.y);
console.log("Размер основного колеса: " + wheelBase.width + " " + wheelBase.height);

wheelBase.eventMode = 'static';
wheelBase.cursor = 'pointer';
wheelBase.on('pointerdown', onClick);

let amountSegments = 12 // количество сегментов
let angleStep = (2 * Math.PI)/amountSegments //вычисляем угол сегментов в радианах (постоянная)
let listOfSegmentsCoordinates = {} // создаем список координат для рисования каждого сектора
console.log("Пробегаемся по линиям (рисуем линии): ");

// Цикл для рисования секторов
for (let i = 0; i < amountSegments; i++) {
    //рисуем сектор
    const sector = new PIXI.Graphics();

    // граница сектора (толщина, цвет, прозрачность)
    sector.lineStyle(borderWheel, 0xfeeb77);
    //рандомный цвет
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    sector.beginFill("0x" + randomColor, 1);

    // Рассчитываем углы для текущего и следующего секторов
    let startAngle = angleStep * i;
    let endAngle = angleStep * (i + 1);

    // начало сектора (перемещение пера в эту точку - середину колеса)
    sector.moveTo(0, 0);

    // Линия к первой точке на окружности
    //координаты для того чтобы вычислить где будет точка на окружности колеса 
    let x1 = radiusWheelBase * Math.cos(startAngle);
    let y1 = radiusWheelBase * Math.sin(startAngle);

    //проводим линию к точке, к которой уже проведена линия 1
    sector.lineTo(x1, y1);
    // Дуга до следующей точки
    sector.arc(0, 0, radiusWheelBase, startAngle, endAngle);
    //обратно возвращаемся к центру колеса
    sector.lineTo(0, 0);
    //замыкаем фигуру
    sector.closePath();
    //заканчиваем заполнение
    sector.endFill();
    //добавляем сектор на основу для колеса
    wheelBase.addChild(sector);
    
    // средний угол для текущего сектора.
    let middleAngle = (startAngle + endAngle) / 2;
    // вычисляем координаты для того чтобы алмаз был в середине сектора
    let diamondX = (radiusWheelBase / 2) * Math.cos(middleAngle);
    let diamondY = (radiusWheelBase / 2) * Math.sin(middleAngle);

    // загружаем текстуру для алмаза
    const diamondTexture = PIXI.Texture.from('src/images/diamond.png');
    // создаем спрайт для алмаза
    const diamond = new PIXI.Sprite(diamondTexture);
    // устанавливаем координаты для алмаза
    diamond.x = diamondX;
    diamond.y = diamondY;
    // центр спрайта будет находиться в координатах (diamondX, diamondY).
    diamond.anchor.set(0.5);
    //добавляем сектор на основу для колеса
    sector.addChild(diamond);
}

//круг в центре (кнопка)
const wheelButton = new PIXI.Graphics();
// граница круга (толщина, цвет, прозрачность)
wheelButton.lineStyle(0);
// заполнение(цвет,прозрачность)
wheelButton.beginFill(0xde3249, 1);
//рисование круга(коорд x коорд y)
wheelButton.drawCircle(0, 0, radiusWheelBase / 8);
//заканчиваем заполнение
wheelButton.endFill();


//добавляем основу для колеса
containerMain.addChild(wheelBase);
//добавляем круг на основу для колеса
containerMain.addChild(wheelButton);
//добавляем контейнер на сцену
app.stage.addChild(containerMain);


function onClick()
{
    console.log("Нажато");
    // обработчик
    app.ticker.add((delta) =>
    {
        // вращение контейнера
        containerMain.rotation += 0.15 * delta;
    });
}

