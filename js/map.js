'use strict';
// метки для карты
window.map = (function () {

  var ELEMENT_COUNT = 8; // количество элементов которое надо сгенерировать на карте

  return {
    // Отрисовывает метки на карте
    pushElementsInPage: function () {
      // шаблон метки на карте
      var templatePin = document.querySelector('#pin').content;

      // место вставки элементов (меток на карте)
      var mapPins = document.querySelector('.map__pins');

      // фрагмент
      var fragment = document.createDocumentFragment();

      // массив с моками
      var randomsObjects = [];

      for (var i = 0; i < ELEMENT_COUNT; i++) {
        randomsObjects[i] = window.data.getRandomObject();
        var newElement = window.pin.getElementPin(templatePin, randomsObjects[i]);
        fragment.appendChild(newElement);
      }

      // вставляет на страницу метки для карты
      mapPins.appendChild(fragment);

      // реализация отображения карточки при клике на метку
      var mapPinsElements = document.querySelectorAll('.map__pin');
      if (mapPinsElements) {
        for (var j = 0; j < mapPinsElements.length; j++) {
          // убираем элемент основную метку
          if (mapPinsElements[j].classList.contains('map__pin--main')) {
            continue;
          } else {
            // на все другие вешаем событие click которое сравнивает строку изображение аватара
            // и изображение в массиве объектов
            mapPinsElements[j].addEventListener('click', onPinClick);
            mapPinsElements[j].addEventListener('keydown', onPinKeyDown);
          }
        }
      }

      // обработчик при клике на метку или при нажатии Enter на метку
      function onPinClick(evt) {
        openCard(evt);
      }

      function onPinKeyDown(evt) {
        if (evt.key === 'Enter') {
          evt.preventDefault();
          openCard(evt);
        }
      }

      function openCard(evt) {
        var targetElement;
        if (evt.target.nodeName === 'BUTTON') {
          targetElement = evt.target.querySelector('img');
        } else {
          targetElement = evt.target;
        }
        var indexString = targetElement.src.indexOf('img');
        var stringIndentifyPin = targetElement.src.slice(indexString);
        for (var k = 0; k < randomsObjects.length; k++) {
          if (randomsObjects[k].author.avatar === stringIndentifyPin) {
            var cardElement = window.card.getElementCard(randomsObjects[k]);
            mapPins.insertAdjacentElement('afterend', cardElement);
          }
        }

      }
    },

  };

})();
