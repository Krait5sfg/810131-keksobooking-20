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
      'y': getRandomInteger(VALUES_FOR_Y[0], VALUES_FOR_Y[1])
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

  // HTML коллекция всей детей newElement
  var childrens = newElement.firstElementChild.children;
  for (var i = 0; i < childrens.length; i++) {
    // создаем селектор из последнего класса каждого chidlren
    var selectorForSeachElement = '.' + childrens[i].classList[childrens[i].classList.length - 1];
    // по этому селектору находим элемент и заполняем его
    setElement(selectorForSeachElement);
  }

  return newElement.firstElementChild;

  // функция находит элемент по селектору и в зависимости от селектора присваивает значение
  // работает только внутри getElementCard()
  function setElement(selector) {
    var element = newElement.querySelector(selector);
    switch (selector) {
      case ('.popup__title'):
        element.textContent = object['offer']['title'];
        break;
      case ('.popup__text--address'):
        element.textContent = object['offer']['address'];
        break;
      case ('.popup__text--price'):
        element.textContent = object['offer']['price'] + '\u20bd' + element.children[0].textContent;
        break;
      case ('.popup__type'):
        element.textContent = getOfferType();
        break;
      case ('.popup__text--capacity'):
        element.textContent = getCorrectString(object['offer']['rooms'], object['offer']['guests']);
        break;
      case ('.popup__text--time'):
        element.textContent = 'Заезд после ' + object['offer']['checkin'] + ', выезд до ' + object['offer']['checkout'];
        break;
      case ('.popup__features'):
        pushItemInList(element);
        break;
      case ('.popup__description'):
        element.textContent = object['offer']['description'];
        break;
      case ('.popup__photos'):
        pushImagesInPopupPhotos(element);
        break;
      case ('.popup__avatar'):
        element.setAttribute('src', object['author']['avatar']);
    }
  }

  // функция возвращает строку соответствующею типу предложения
  // работает только внутри getElementCard()
  function getOfferType() {
    var offerType = object['offer']['type'];
    if (offerType === 'flat') {
      offerType = 'Квартира';
    } else if (offerType === 'bungalo') {
      offerType = 'Бунгало';
    } else if (offerType === 'house') {
      offerType = 'Дом';
    } else if (offerType === 'palace') {
      offerType = 'Дворец';
    }
    return offerType;
  }

  // функция создает список .popup__features на основе доступных удобств и скрывает пустые элементы списка
  // работает только внутри getElementCard()
  function pushItemInList(element) {
    var elementsFeatures = element.querySelectorAll('.popup__feature');
    var countForSliceString = 31; // количество символов для slice() чтобы из класса каждого li получить последнее слово
    for (var j = 0; j < elementsFeatures.length; j++) {
      for (var k = 0; k < object['offer']['features'].length; k++) {
        if (elementsFeatures[j].classList.value.slice(countForSliceString) === object['offer']['features'][k]) {
          elementsFeatures[j].textContent = object['offer']['features'][k];
          break;
        }
      }
      if (!elementsFeatures[j].textContent) {
        elementsFeatures[j].style.display = 'none';
      }
    }
  }

  // функция создает блок .popup__photos с фотографиями из списка offer.photos
  // работает только внутри getElementCard()
  function pushImagesInPopupPhotos(element) {
    var popupPhotoElement = element.querySelector('.popup__photo');
    var fragment = document.createDocumentFragment();
    for (var l = 0; l < object['offer']['photos'].length; l++) {
      popupPhotoElement.setAttribute('src', object['offer']['photos'][l]);
      fragment.appendChild(popupPhotoElement.cloneNode(true));
    }
    element.innerHTML = '';
    element.appendChild(fragment);
  }
}

/*
* функция для получения строки с количеством гостей и комнат с правильным окончанием
* Например: 2 комнаты для 3 гостей, 1 комната для 1 гостя
*/
function getCorrectString(countRoom, countGuest) {
  var strings = [];
  strings[0] = countRoom;
  strings[2] = countGuest;
  var stringsRooms = [' комната для ', ' комнаты для ', ' комнат для '];
  countRoom = Math.abs(countRoom) % 100;
  var numberOne = countRoom % 10;
  if (countRoom > 10 && countRoom < 20) {
    strings[1] = stringsRooms[2];
  } else if (numberOne > 1 && numberOne < 5) {
    strings[1] = stringsRooms[1];
  } else if (numberOne === 1) {
    strings[1] = stringsRooms[0];
  } else {
    strings[1] = stringsRooms[2];
  }
  if (countGuest === 1) {
    strings[3] = ' гостя';
  } else {
    strings[3] = ' гостей';
  }
  return strings.join('');
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
