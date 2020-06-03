'use strict';
var randomObjects = getRandomData();

// переключает карту из неактивного состояния в активное (временно)
document.querySelector('.map').classList.remove('map--faded');

// шаблон элемента
var template = document.querySelector('#pin').content;

// выводит моки на страницу
pushElementsInPage(template, randomObjects);

// генерирует моки
function getRandomData() {
  var randomData = [];

  var imgNumber = 1;
  var types = ['palace', 'flat', 'house', 'bungalo'];
  var times = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photosLins = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var widthBlock = document.querySelector('.map__pins').clientWidth;
  var valuesForY = [130, 630];

  for (var i = 0; i < 8; i++) {
    var object = {
      'author': {
        'avatar': 'img/avatars/user0' + imgNumber + '.png'
      },
      'offer': {
        'title': 'Заголовок предложения',
        'address': '600, 350',
        'price': 20000,
        'type': types[Math.floor(Math.random() * types.length)],
        'rooms': 5,
        'guests': 2,
        'checkin': times[Math.floor(Math.random() * times.length)],
        'checkout': times[Math.floor(Math.random() * times.length)],
        'features': features.slice(Math.floor(Math.random() * features.length)),
        'description': 'Описание предложения',
        'photos': photosLins.slice(Math.floor(Math.random() * photosLins.length))
      },
      'location': {
        'x': Math.floor(Math.random() * widthBlock),
        'y': randomInteger(valuesForY[0], valuesForY[1])
      }
    };
    randomData[i] = object;
    imgNumber++;
  }
  return randomData;
}

// возвращает рандомное число в диапазоне от min до max
function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

// создает один элемент на основе переданного шаблона
function getElement(sample, coordinates, avatar, title) {
  var newElement = sample.cloneNode(true);
  var mapPin = newElement.querySelector('.map__pin');
  var img = newElement.querySelector('img');

  /* смещение
  * координаты без смещения распологают элемент верхним левым углом на точке
  * чтобы элемент указывала на точку, его надо поднять на всю высоту и сместить влево на половину ширины
  */
  var offsetX = 50 / 2;
  var offsetY = 70;

  // координаты метки с учетом смещения
  mapPin.style.left = coordinates['x'] - offsetX + 'px';
  mapPin.style.top = coordinates['y'] - offsetY + 'px';

  // путь к картинке
  img.setAttribute('src', avatar);
  // alt картинки
  img.setAttribute('alt', title);

  return newElement;
}

// принимает шаблон и массив с объектами, выводит их страницу
function pushElementsInPage(sample, arrayObjects) {
  // место вставки элементов
  var mapPins = document.querySelector('.map__pins');

  // фрагмент
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arrayObjects.length; i++) {
    var newElement = getElement(sample, arrayObjects[i]['location'], arrayObjects[i]['author']['avatar'], arrayObjects[i]['offer']['title']);
    fragment.appendChild(newElement);
  }

  // вставляет на страницу элементы
  mapPins.appendChild(fragment);
}
