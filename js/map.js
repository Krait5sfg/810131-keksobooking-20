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

      // вставляет карточку на карту
      // mapPins.insertAdjacentElement('afterend', window.card.getElementCard(randomsObjects[0]));

      // вставляет на страницу метки для карты
      mapPins.appendChild(fragment);
    },
  };

})();
