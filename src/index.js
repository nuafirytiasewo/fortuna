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

let amountSegments = 10 // количество сегментов
let angelStep = (2 * Math.PI)/amountSegments //вычисляем угол сегментов в радианах (постоянная)
let listOfSegmentsCoordinates = {} // создаем список координат для рисования каждого сектора

//цикл для рисования линий, разделяющих сектора
for (let i = 0; i < amountSegments; i++)
{
    //линия, разделяющая секторы
    const sectorBorder = new PIXI.Graphics();
    // граница линии (толщина, цвет, прозрачность)
    sectorBorder.lineStyle(borderWheel, 0xfeeb77);
    // умножаем угол с каждой итерацией (секторы) на величину угла между ними
    let angel = angelStep * i
    //координаты для того чтобы вычислить где будет точка на окружности колеса 
    let xLine = radiusWheelBase * Math.cos(angel)
    let yLine = radiusWheelBase * Math.sin(angel)
    //записываем эти координаты для рисования сегментов
    listOfSegmentsCoordinates[i] = {
        "x" : xLine,
        "y" : yLine
    };
    // начало линии (перемещение пера в эту точку - середину колеса)
    sectorBorder.moveTo(0, 0);
    // конец линии - куда дальше рисовать (к окружности колеса)
    sectorBorder.lineTo(xLine, yLine);
    //заканчиваем заполнение
    sectorBorder.endFill();

    //добавляем линию на основу для колеса
    wheelBase.addChild(sectorBorder);
}

console.log(listOfSegmentsCoordinates); //вывод массива
console.log(Object.keys(listOfSegmentsCoordinates).length); //найти длину массива
console.log(listOfSegmentsCoordinates[4]["x"]); //вывели x координату одного из секторов

//цикл для рисования секторов
for (let i = 0; i < Object.keys(listOfSegmentsCoordinates).length; i++)
{
    //рисуем сектор
    const sector = new PIXI.Graphics();

    // граница сектора (толщина, цвет, прозрачность)
    sector.lineStyle(borderWheel, 0xfeeb77);
    sector.beginFill(0xff700b, 1);

    // начало сектора (перемещение пера в эту точку - середину колеса)
    sector.moveTo(0, 0);
    
    //проходимся по окружности и считаем крайние точки секторов:
    //находим точку на окружности, к которой проведена линия 1 и сразу же находим точку к которой проведена линия 2,
    //пока не найдем точку последней линии - следующей будет точка первой линии

    let x1 = listOfSegmentsCoordinates[i]["x"];
    let y1 = listOfSegmentsCoordinates[i]["y"];
    //проводим линию к точке, к которой уже проведена линия 1
    sector.lineTo(x1, y1);
    //если мы не наткнулись на последнюю линию
    if (i != Object.keys(listOfSegmentsCoordinates).length - 1)
    {
        // то ищем следующую точку, к которой проведена следующая линия
        let x2 = listOfSegmentsCoordinates[i+1]["x"];
        let y2 = listOfSegmentsCoordinates[i+1]["y"];
        //вывод
        console.log(x1 + "," + y1 + " and " + x2 + "," + y2);
        // проводим к ней кривую линию 
        sector.quadraticCurveTo(x1/x2, 0, x2, y2);
        
    }
    //если мы наткнулись на последнюю линию
    else 
    {
        // то ищем самую первую точку, к которой проведена линия 1
        let x2 = listOfSegmentsCoordinates[0]["x"];
        let y2 = listOfSegmentsCoordinates[0]["y"];
        //вывод
        console.log(x1 + "," + y1 + " and " + x2 + "," + y2);
        // проводим к ней кривую линию 
        sector.quadraticCurveTo(x1/x2, 0, x2, y2);
    }

    //обратно возвращаемся к центру колеса
    sector.lineTo(0, 0);
    //замыкаем фигуру
    sector.closePath();
    //заканчиваем заполнение
    sector.endFill();
    //добавляем линию на основу для колеса
    wheelBase.addChild(sector);
    
}

//круг в центре (кнопка)
const wheelButton = new PIXI.Graphics();
// граница круга (толщина, цвет, прозрачность)
wheelButton.lineStyle(0);
// заполнение(цвет,прозрачность)
wheelButton.beginFill(0xde3249, 1);
//рисование круга(коорд x коорд y)
wheelButton.drawCircle(0, 0, radiusWheelBase / 10);
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
}

// обработчик
app.ticker.add((delta) =>
{
    // вращение контейнера
    containerMain.rotation += 0.01 * delta;
});