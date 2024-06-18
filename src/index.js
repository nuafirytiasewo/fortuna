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

// загружаем текстуру для алмаза
const diamondTexture = PIXI.Texture.from('src/images/diamond.png');

//определяем диаметр колеса (среднее арифметическое между высотой и шириной жкрана / 1.7)
const diameterWheelBase = (app.screen.width / 1.7 + app.screen.height / 1.7) / 2;
const radiusWheelBase = diameterWheelBase / 2;
//вывод
console.log("Диаметр основного колеса: " + diameterWheelBase);
// толщина линии и колеса (диаметр колеса / 140)
const borderWheel = diameterWheelBase / 140;


//текст (сколько алмазов выпадет)
const textStyle = new PIXI.TextStyle({
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
});

//скорость вращения
const speedRotationWheel = 0.15;

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

let amountSegments = 5 // количество сегментов
let angleStep = (2 * Math.PI)/amountSegments //вычисляем угол сегментов в радианах (постоянная)

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

    // создаем спрайт для алмаза
    const diamond = new PIXI.Sprite(diamondTexture);
    // устанавливаем координаты для алмаза
    diamond.x = diamondX;
    diamond.y = diamondY;
    // центр спрайта будет находиться в координатах (diamondX, diamondY).
    diamond.anchor.set(0.5);
    //чем больше сегментов, тем меньше алмаз и наоборот
    // 0.4 - оптимальный коэффициент
    const sizeDiamond = 0.4;
    diamond.scale.x = 1 / (amountSegments * sizeDiamond);
    diamond.scale.y = 1 / (amountSegments * sizeDiamond);
    console.log("Размер алмаза " + diamond.scale.x + " " + diamond.scale.y);
    // правильный наклон относительно секторов
    diamond.rotation = middleAngle + Math.PI / 2;
    //добавляем алмаз на сектор
    sector.addChild(diamond);
    
    // случайное значение от 0.01 до 100
    let randomValue = Math.random() * (100 - 0.01) + 0.01;
    // округление до двух знаков после запятой
    randomValue = randomValue.toFixed(2);

    //сколько будет алмазов на секторе
    const amountDiamond = new PIXI.Text(randomValue, textStyle);

    // вычисляем координаты текста чтобы были немного выше алмаза
    // (r/5)*4 потому что мы смещаемся вверх на 4/5 
    amountDiamond.x = (radiusWheelBase / 5 * 4) * Math.cos(middleAngle);
    amountDiamond.y = (radiusWheelBase / 5 * 4) * Math.sin(middleAngle); // смещение текста вверх относительно алмаза

    // центр спрайта будет находиться в координатах (amountDiamondX, amountDiamondY).
    amountDiamond.anchor.set(0.5);
    //чем больше сегментов, тем меньше алмаз и наоборот
    // 0.3 - оптимальный коэффициент
    const sizeAmountDiamond = 0.3;
    amountDiamond.scale.x = 1 / (amountSegments * sizeAmountDiamond);
    amountDiamond.scale.y = 1 / (amountSegments * sizeAmountDiamond);
    console.log("Размер алмаза " + amountDiamond.scale.x + " " + amountDiamond.scale.y);
    // правильный наклон относительно секторов
    amountDiamond.rotation = middleAngle + Math.PI / 2;
    //добавляем текст на сектор
    sector.addChild(amountDiamond);
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

// Перемещение контейнера в центр экрана и установка координат x и y контейнера в середину экрана приложения.
wheelButton.x = app.screen.width / 2;
wheelButton.y = app.screen.height / 2;

//текст на кнопке
const buttonText = new PIXI.Text("Старт", textStyle);
buttonText.anchor.set(0.5);
buttonText.scale.x = radiusWheelBase / 800;
buttonText.scale.y = radiusWheelBase / 800;
wheelButton.addChild(buttonText);

//добавляем основу для колеса
containerMain.addChild(wheelBase);

//добавляем контейнер на сцену
app.stage.addChild(containerMain);

//добавляем кнопку на сцену
app.stage.addChild(wheelButton);


//сколько алмазов всего у пользователя
const totalDiamonds = new PIXI.Text("100", textStyle);
totalDiamonds.anchor.set(0.5);
totalDiamonds.x = app.screen.width / 2 + app.screen.width / 4;
totalDiamonds.y = app.screen.height / 2 - app.screen.height / 4 - app.screen.height / 8;
totalDiamonds.scale.x = radiusWheelBase / 400;
totalDiamonds.scale.y = radiusWheelBase / 400;
//добавляем количество алмазов у пользователя на сцену
app.stage.addChild(totalDiamonds);


// создаем спрайт для алмаза
const iconDiamond = new PIXI.Sprite(diamondTexture);
// устанавливаем координаты для алмаза
iconDiamond.x = app.screen.width / 2 + app.screen.width / 4 + app.screen.width / 8;
iconDiamond.y = app.screen.height / 2 - app.screen.height / 4 - app.screen.height / 8;
// центр спрайта будет находиться в координатах (diamondX, diamondY).
iconDiamond.anchor.set(0.5);
iconDiamond.scale.x = radiusWheelBase / 400;
iconDiamond.scale.y = radiusWheelBase / 400;
//добавляем алмаз на сцену
app.stage.addChild(iconDiamond);

//при нажатии на кнопку
var start = true;
function onClick(){
    if(start){
        console.log("Старт");
        // обработчик
        app.ticker.add((delta) =>
        {
            // вращение контейнера
            containerMain.rotation += speedRotationWheel * delta;
            console.log(speedRotationWheel);
        });
    } else {
        console.log("стоп");
        // обработчик
        app.ticker.add((delta) =>
        {
            // вращение контейнера
            containerMain.rotation += speedRotationWheel * delta;
        });
    }
    start = !start;
}
