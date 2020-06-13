'use strict';
// модуль для создания данных
window.data = (function () {

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

  var yPositionRange = {
    'lowEdge': 130,
    'highEdge': 630
  };
  var pathsToImages = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];

  return {

    // генерирует мок
    getRandomObject: function () {
      var object = {
        'author': {
          'avatar': window.util.getImagePath(pathsToImages)
        },
        'offer': {
          'title': TITLE,
          'address': ADDRESS,
          'price': PRICE,
          'type': window.util.getRandomValueFromArray(TYPES),
          'rooms': ROOM_COUNT,
          'guests': GUEST_COUNT,
          'checkin': window.util.getRandomValueFromArray(TIMES),
          'checkout': window.util.getRandomValueFromArray(TIMES),
          'features': window.util.getRandomArrayFromArray(FEATURES),
          'description': DESCRIPTION,
          'photos': PHOTOS_LINKS
        },
        'location': {
          'x': window.util.getRandomNumber(WIDTH_BLOCK),
          'y': window.util.getRandomInteger(yPositionRange['lowEdge'], yPositionRange['highEdge'])
        }
      };
      return object;
    },
  };

})();
