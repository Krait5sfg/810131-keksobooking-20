'use strict';
var TITLE = 'Заголовок предложения';
var ADDRESS = '600, 350';
var PRICE = 20000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ROOM_COUNT = 5;
var GUEST_COUNT = 2;
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = 'Описание предложения';
var PHOTOS_LINKS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var WIDTH_BLOCK = document.querySelector('.map__pins').clientWidth;
var VALUES_FOR_Y = [130, 630];
var ELEMENT_COUNT = 8;

var pathsToImages = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];

// переключает карту из неактивного состояния в активное (временно)
document.querySelector('.map').classList.remove('map--faded');

// шаблон элемента
var template = document.querySelector('#pin').content;

// выводит ELEMENT_COUNT элементов на страницу
pushElementsInPage(template, ELEMENT_COUNT);

// генерирует мок
function getRandomObject(avatars, title, address, price, types, roomCount, guestCount, times, features, description, photosLinks, widthBlock, valuesForY) {

  var object = {
    'author': {
      'avatar': getImagePath(avatars)
    },
    'offer': {
      'title': title,
      'address': address,
      'price': price,
      'type': getRandomValueFromArray(types),
      'rooms': roomCount,
      'guests': guestCount,
      'checkin': getRandomValueFromArray(times),
      'checkout': getRandomValueFromArray(times),
      'features': getRandomArrayFromArray(features),
      'description': description,
      'photos': getRandomArrayFromArray(photosLinks)
    },
    'location': {
      'x': getRandomNumber(widthBlock),
      'y': getRandomInteger(valuesForY[0], valuesForY[1])
    }
  };

  return object;
}

// возвращает случайный элемент из массива
function getRandomValueFromArray(values) {
  return values[Math.floor(Math.random() * values.length)];
}

// возвращает рандомный массив из элементов переданного массива
function getRandomArrayFromArray(values) {
  return values.slice(Math.floor(Math.random() * values.length));
}

// возвращает путь к изображению из массива
function getImagePath(values) {
  return values.shift(values);
}

// возвращает рандомное число от 0 до переданного числа
function getRandomNumber(number) {
  return Math.floor(Math.random() * number);
}

// возвращает рандомное число в диапазоне от numberMinimun до numberMaximum
function getRandomInteger(numberMinimun, numberMaximum) {
  var number = numberMinimun + Math.random() * (numberMaximum + 1 - numberMinimun);
  return Math.floor(number);
}

// возвращает один элемент на основе переданного шаблона c данными из объекта
function getElement(sample, object) {
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
  mapPin.style.left = object['location']['x'] - offsetX + 'px';
  mapPin.style.top = object['location']['y'] - offsetY + 'px';

  // путь к картинке
  img.setAttribute('src', object['author']['avatar']);
  // alt картинки
  img.setAttribute('alt', object['offer']['title']);

  return newElement;
}

// принимает шаблон, количество объектов которое надо сделать
// в самой себе вызывает функцию getRandomObject() с переданными в нее константами
function pushElementsInPage(sample, count) {
  // место вставки элементов
  var mapPins = document.querySelector('.map__pins');

  // фрагмент
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var newElement = getElement(sample, getRandomObject(pathsToImages, TITLE, ADDRESS, PRICE, TYPES, ROOM_COUNT, GUEST_COUNT, TIMES, FEATURES, DESCRIPTION, PHOTOS_LINKS, WIDTH_BLOCK, VALUES_FOR_Y));
    fragment.appendChild(newElement);
  }

  // вставляет на страницу элементы
  mapPins.appendChild(fragment);
}
