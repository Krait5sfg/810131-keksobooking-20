'use strict';
// метки для карты
window.map = (function () {

  var ELEMENT_COUNT = 8; // количество элементов которое надо сгенерировать на карте
  var mapElement = document.querySelector('.map');

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
      // и перемещения основной метки
      var mapPinsElements = document.querySelectorAll('.map__pin');
      if (mapPinsElements) {
        for (var j = 0; j < mapPinsElements.length; j++) {

          // если метка основная вешаем на нее обработчик перемещения
          if (mapPinsElements[j].classList.contains('map__pin--main')) {
            mapPinsElements[j].addEventListener('mousedown', onMapPinMainMouseDown);
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
        // проверяет где произошло событие (img или button)
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

            // реализация закрытия карточки
            cardElement.querySelector('.popup__close').addEventListener('click', onPopupClick);
            document.addEventListener('keydown', onPopupEscape);

            // если карточка открыта - удаляем
            if (document.querySelector('.map__card')) {
              closeCard();
            }

            // выводит карточку на страницу
            mapPins.insertAdjacentElement('afterend', cardElement);
          }
        }

      }

      // обработчики закрытия карточки по клику на крестике
      // и нажатия кнопки Escape
      function onPopupClick() {
        closeCard();
      }

      function onPopupEscape(evt) {
        if (evt.key === 'Escape') {
          closeCard();
        }
      }

      function closeCard() {
        // удаляет карточку
        mapElement.removeChild(document.querySelector('.map__card'));
      }

      // обработчик нажатия мыши на основную метку
      function onMapPinMainMouseDown(evtMouseDown) {
        evtMouseDown.preventDefault();
        var mapPinMainElement = document.querySelector('.map__pin--main');

        // стартовые координаты
        var startCoords = {
          x: evtMouseDown.clientX,
          y: evtMouseDown.clientY
        };

        mapPins.addEventListener('mousemove', onMapMouseMove);
        mapPins.addEventListener('mouseup', onMapMouseUp);

        function onMapMouseMove(evtMove) {
          evtMove.preventDefault();

          // смещение
          var shift = {
            x: startCoords.x - evtMove.clientX,
            y: startCoords.y - evtMove.clientY
          };

          mapPinMainElement.style.top = (mapPinMainElement.offsetTop - shift.y) + 'px';
          mapPinMainElement.style.left = (mapPinMainElement.offsetLeft - shift.x) + 'px';

          // вставляем данные метки в инпут c учетом смещения (т.е. считаем острый конец)
          // вычисления идут от левого верхнего угла метки
          window.formPage.setAddressValue(true, mapPinMainElement, window.formPage.addressElement);

          startCoords = {
            x: evtMove.clientX,
            y: evtMove.clientY
          };
        }

        function onMapMouseUp(evtUp) {
          evtUp.preventDefault();

          mapPins.removeEventListener('mousemove', onMapMouseMove);
          mapPins.removeEventListener('mouseup', onMapMouseUp);
        }
      }
    },

  };

})();
