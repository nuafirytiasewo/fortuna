## ⚙️ Подготовка проекта

```
npm i
```
## ✅ Запуск проекта

```
npm start
```
## Как я это сделал?

1. Инициализировал проект

```
npm init -y
```

2. Установил Webpack

```
npm i webpack webpack-cli webpack-dev-server --save-dev
```
3. Создал ключевые файлы

![image](https://github.com/nuafirytiasewo/pixijs/assets/103138302/ffe5e642-dbd6-4a3c-b771-7c22b9c874be)

4. Добавил в файл webpack.config.js данный код:

```
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: { 
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname), // Указываем корневую директорию проекта
    },
    compress: true,
    port: 9000,
    open: true,
  },
}
```

5. Добавил в файл index.html данный код:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="main.js"></script>
</body>
</html>
```

6. Установил последнюю версию pixijs 7
```
npm i pixi.js@7 --save-dev
```
7. В файл package.json добавил (заменил) данный код:
```
"scripts": {
    "start": "webpack-dev-server --mode development",
    "build": "webpack --mode production"
  },
```
8. Запустил

```
npm start
```
