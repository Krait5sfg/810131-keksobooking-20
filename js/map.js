'use strict';
// метки для карты
window.map = (function () {

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
      function onMapPinClick(evt) {
        openCard(evt);
      }

      function onMapPinKeyDown(evt) {
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

            // если карточка уже открыта то при клике на другую метку текущая карточка закроется
            if (document.querySelector('.map__card')) {
              closeCard();
            }

            // выводит карточку на страницу
            mapPins.insertAdjacentElement('afterend', cardElement);
          }
        }

        // добавляем карточке события на закрытие
        cardElement.querySelector('.popup__close').addEventListener('click', onPopupClick);
        document.addEventListener('keydown', onPopupEscape);

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
        document.removeEventListener('keydown', onPopupEscape);

        // удаляет карточку
        if (document.querySelector('.map__card')) {
          document.querySelector('.map__card').remove();
        }

        // удаляем map__pin--active с метки
        activeElement.classList.remove('map__pin--active');
      }

      // функция получает данные с сервера, выводит на основании данных метки на карту
      // вешает события на обычную метку
      function onLoad(response) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < response.length; i++) {
          objects[i] = response[i];
          var newElement = window.pin.getElementPin(templatePin, objects[i]);
          fragment.appendChild(newElement);
        }
        mapPins.appendChild(fragment);

        // реализация отображения карточки при клике на метку
        mapPinsElements = document.querySelectorAll('.map__pin'); // массив с метками

        if (mapPinsElements) {
          for (var j = 0; j < mapPinsElements.length; j++) {

            // если метка не основная вешаем на нее click, которое сравнивает строку изображения аватара
            if (!mapPinsElements[j].classList.contains('map__pin--main')) {
              mapPinsElements[j].addEventListener('click', onMapPinClick);
              mapPinsElements[j].addEventListener('keydown', onMapPinKeyDown);
            }
          }
        }
      }

      function onError(error) {
        throw new Error(error);
      }
    },

    // функция используется при переводе стр в неактивный режим при успешной отправке формы
    removeElementsFromPage: function () {

      // удаляем метки
      var mapPins = document.querySelector('.map__pins');
      var mapPinsChildrens = mapPins.children;
      var length = mapPinsChildrens.length;
      var count = 0;
      var startIndexForRemoving = 2;
      while (count < length - startIndexForRemoving) {
        mapPins.removeChild(mapPinsChildrens[startIndexForRemoving]);
        count++;
      }

      // удаляем карточку если открыта
      if (document.querySelector('.map__card')) {
        document.querySelector('.map__card').remove();
      }
    },

  };

})();
