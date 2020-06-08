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
var ELEMENT_COUNT = 8;
var yPositionRange = {
  'lowEdge': 130,
  'highEdge': 630
};

var pathsToImages = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];

// переключает карту из неактивного состояния в активное (временно)
document.querySelector('.map').classList.remove('map--faded');

// шаблон для метки на карте
var templatePin = document.querySelector('#pin').content;

// шаблон карточки
var templateCard = document.querySelector('#card').content;

// выводит ELEMENT_COUNT элементов на страницу
pushElementsInPage(templatePin, templateCard, ELEMENT_COUNT);

/*
* генерирует мок
*/
function getRandomObject() {

  var object = {
    'author': {
      'avatar': getImagePath(pathsToImages)
    },
    'offer': {
      'title': TITLE,
      'address': ADDRESS,
      'price': PRICE,
      'type': getRandomValueFromArray(TYPES),
      'rooms': ROOM_COUNT,
      'guests': GUEST_COUNT,
      'checkin': getRandomValueFromArray(TIMES),
      'checkout': getRandomValueFromArray(TIMES),
      'features': getRandomArrayFromArray(FEATURES),
      'description': DESCRIPTION,
      'photos': PHOTOS_LINKS
    },
    'location': {
      'x': getRandomNumber(WIDTH_BLOCK),
      'y': getRandomInteger(yPositionRange['lowEdge'], yPositionRange['highEdge'])
    }
  };

  return object;
}

/*
* возвращает случайный элемент из массива
*/
function getRandomValueFromArray(values) {
  return values[Math.floor(Math.random() * values.length)];
}

/*
* возвращает рандомный массив из элементов переданного массива
*/
function getRandomArrayFromArray(values) {
  return values.slice(Math.floor(Math.random() * values.length));
}

/*
* возвращает путь к изображению из массива
*/
function getImagePath(values) {
  return values.shift(values);
}

/*
* возвращает рандомное число от 0 до переданного числа
*/
function getRandomNumber(number) {
  return Math.floor(Math.random() * number);
}

/*
* возвращает рандомное число в диапазоне от numberMinimun до numberMaximum
*/
function getRandomInteger(numberMinimun, numberMaximum) {
  var number = numberMinimun + Math.random() * (numberMaximum + 1 - numberMinimun);
  return Math.floor(number);
}

/*
* возвращает один элемент (метку на карте) на основе переданного шаблона c данными из объекта
*/
function getElementPin(sample, object) {
  var newElement = sample.cloneNode(true);
  var mapPin = newElement.querySelector('.map__pin');
  var img = newElement.querySelector('img');

  // смещение
  // координаты без смещения распологают элемент верхним левым углом на точке
  // чтобы элемент указывала на точку, его надо поднять на всю высоту и сместить влево на половину ширины
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

/*
* возвращает один элемент (карточку) на основе переданного шаблона и объекта с данными
*/
function getElementCard(sample, object) {
  var newElement = sample.cloneNode(true);

  newElement.querySelector('.popup__title').textContent = object['offer']['title'];
  newElement.querySelector('.popup__text--address').textContent = object['offer']['address'];
  newElement.querySelector('.popup__text--price').textContent = object['offer']['price'] + '\u20bd/ночь';
  var types = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  newElement.querySelector('.popup__type').textContent = types[object['offer']['type']];
  newElement.querySelector('.popup__text--capacity').textContent = object['offer']['rooms'] + ' комнат для ' + object['offer']['guests'] + ' гостей';
  newElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + object['offer']['checkin'] + ', выезд до ' + object['offer']['checkout'];
  pushItemInList(newElement);
  newElement.querySelector('.popup__description').textContent = object['offer']['description'];
  pushImagesInPopupPhotos(newElement);
  newElement.querySelector('.popup__avatar').setAttribute('src', object['author']['avatar']);

  return newElement.firstElementChild;

  // функция создает список .popup__features на основе доступных удобств
  // работает только внутри getElementCard()
  function pushItemInList(element) {
    var popupFeaturesElement = element.querySelector('.popup__features');
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < object['offer']['features'].length; j++) {
      var liElement = document.createElement('li');
      liElement.setAttribute('class', 'popup__feature popup__feature--' + object['offer']['features'][j]);
      liElement.textContent = object['offer']['features'][j];
      fragment.appendChild(liElement);
    }
    popupFeaturesElement.innerHTML = '';
    popupFeaturesElement.appendChild(fragment);
  }

  // функция создает блок .popup__photos с фотографиями из списка offer.photos
  // работает только внутри getElementCard()
  function pushImagesInPopupPhotos(element) {
    var popupPhotosElement = element.querySelector('.popup__photos');
    var popupPhotoElement = element.querySelector('.popup__photo');
    var fragment = document.createDocumentFragment();
    for (var l = 0; l < object['offer']['photos'].length; l++) {
      popupPhotoElement.setAttribute('src', object['offer']['photos'][l]);
      fragment.appendChild(popupPhotoElement.cloneNode(true));
    }
    popupPhotosElement.innerHTML = '';
    popupPhotosElement.appendChild(fragment);
  }
}

/*
* принимает шаблон, количество объектов которое надо сделать
* в самой себе вызывает функцию getRandomObject() с переданными в нее константами
*/
function pushElementsInPage(samplePin, sampleCard, count) {
  // место вставки элементов (меток на карте)
  var mapPins = document.querySelector('.map__pins');

  // фрагмент
  var fragment = document.createDocumentFragment();

  // массив с моками
  var randomsObjects = [];

  for (var i = 0; i < count; i++) {
    randomsObjects[i] = getRandomObject();
    var newElement = getElementPin(samplePin, randomsObjects[i]);
    fragment.appendChild(newElement);
  }

  // вставляет карточку на страницу
  mapPins.insertAdjacentElement('afterend', getElementCard(sampleCard, randomsObjects[0]));

  // вставляет на страницу метки для карты
  mapPins.appendChild(fragment);
}
