'use strict';
// метки для карты
window.map = (function () {

  var mapElement = document.querySelector('.map');

  // переменная для меток на карте, заполнится после активации страницы
  var mapPinsElements = [];

  // переменная для активной метки, значение появляется при клике на метку
  var activeElement;

  return {

    // Отрисовывает метки на карте
    pushElementsInPage: function () {
      // шаблон метки на карте
      var templatePin = document.querySelector('#pin').content;

      // место вставки элементов (меток на карте)
      var mapPins = document.querySelector('.map__pins');

      // массив с объектами полученными с сервера
      var objects = [];

      // получение данных с сервера, onLoad создает метки из этих данных
      window.backend.load(onLoad, onError);

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

          // если button - тогда это активный элемент, на него будем вешать класс map__pin--active
          activeElement = evt.target;

          // и находим дочерний img
          targetElement = evt.target.querySelector('img');
        } else {

          // если img, тогда активный элемент его родитель
          activeElement = evt.target.parentNode;
          targetElement = evt.target;
        }

        // находим какая метка какому соответствует объекту по alt метки
        var alt = targetElement.alt;
        var startIndexCount = 1;
        for (var k = 0; k < objects.length; k++) {

          // начиная с элемента с индексом 1 удаляем со всем меток массива mapPinsElements класс map__pin--active
          mapPinsElements[startIndexCount].classList.remove('map__pin--active');
          startIndexCount++;

          if (objects[k].offer.title === alt) {
            var cardElement = window.card.getElementCard(objects[k]);

            // реализация закрытия карточки
            cardElement.querySelector('.popup__close').addEventListener('click', onPopupClick);
            document.addEventListener('keydown', onPopupEscape);

            // если карточка уже открыта то при клике на другую метку текущая карточка закроется
            if (document.querySelector('.map__card')) {
              closeCard();
            }

            // выводит карточку на страницу
            mapPins.insertAdjacentElement('afterend', cardElement);
          }
        }

        // добавляем текущему активному элементу map__pin--active
        activeElement.classList.add('map__pin--active');
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

        // удаляем map__pin--active с метки
        activeElement.classList.remove('map__pin--active');
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

      // функция получает данные с сервера, выводит на основании данных метки на карту
      // вешает события на обычную метку и основную
      function onLoad(response) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < response.length; i++) {
          objects[i] = response[i];
          var newElement = window.pin.getElementPin(templatePin, objects[i]);
          fragment.appendChild(newElement);
        }
        mapPins.appendChild(fragment);

        // реализация отображения карточки при клике на метку
        // и перемещения основной метки
        mapPinsElements = document.querySelectorAll('.map__pin'); // массив с метками

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
      }

      function onError(error) {
        throw new Error(error);
      }
    },

  };

})();
