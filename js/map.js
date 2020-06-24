'use strict';
// модуль карты, меток для карты
window.map = (function () {

  var mapPinMainElement = document.querySelector('.map__pin--main');
  var mapPinsElement = document.querySelector('.map__pins'); // блок на карте для меток
  var mapElement = document.querySelector('.map'); // карта
  var mapFiltersElement = document.querySelector('.map__filters');

  var startLocationMapPinMainElement = {
    x: mapPinMainElement.offsetLeft,
    y: mapPinMainElement.offsetTop
  };

  // ограничения для перемещения метки
  var boundMainPin = {
    upper: 48,
    lower: 548,
    left: -30,
    right: 1165
  };

  // переменная для меток на карте, заполнится после активации страницы
  var mapPinsElements = [];

  // переменная для активной метки, значение появляется при клике на метку
  var activeElement;

  // обработчики закрытия карточки по клику на крестике и нажатия кнопки Escape
  // перенесены наверх чтобы был доступ к ним из обоих функций в return
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

  // Отрисовывает метки на карте
  function pushElementsInPage() {
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

    // функция получает данные с сервера, выводит на основании данных метки на карту
    // вешает события на обычную метку
    function onLoad(response) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < response.length; i++) {
        // проверка на поле offer в данных с сервера
        if (response[i].offer) {
          objects[i] = response[i];
          var newElement = window.pin.getElementPin(templatePin, objects[i]);
          newElement.querySelector('.map__pin').addEventListener('click', onMapPinClick);
          newElement.querySelector('.map__pin').addEventListener('keydown', onMapPinKeyDown);
          fragment.appendChild(newElement);
        } else {
          continue;
        }
      }
      mapPins.appendChild(fragment);

      // массив с метками, нужен для отображения отдельной карточки
      mapPinsElements = document.querySelectorAll('.map__pin');
    }

    function onError(error) {
      throw new Error(error);
    }
  }

  // обработчик перемещения по карте основной метки
  function onMapPinMainMouseDown(evtMouseDown) {
    evtMouseDown.preventDefault();

    // стартовые координаты
    var startCoords = {
      x: evtMouseDown.clientX,
      y: evtMouseDown.clientY
    };

    mapPinsElement.addEventListener('mousemove', onMapMouseMove);
    mapPinsElement.addEventListener('mouseup', onMapMouseUp);

    function onMapMouseMove(evtMove) {
      evtMove.preventDefault();

      // смещение
      var shift = {
        x: startCoords.x - evtMove.clientX,
        y: startCoords.y - evtMove.clientY
      };

      if ((mapPinMainElement.offsetTop - shift.y) <= boundMainPin.upper) {
        mapPinMainElement.style.top = boundMainPin.upper + 'px';
      } else if ((mapPinMainElement.offsetTop - shift.y) >= boundMainPin.lower) {
        mapPinMainElement.style.top = boundMainPin.lower + 'px';
      } else if ((mapPinMainElement.offsetLeft - shift.x) <= boundMainPin.left) {
        mapPinMainElement.style.left = boundMainPin.left + 'px';
      } else if ((mapPinMainElement.offsetLeft - shift.x) >= boundMainPin.right) {
        mapPinMainElement.style.left = boundMainPin.right + 'px';
      } else {
        mapPinMainElement.style.top = (mapPinMainElement.offsetTop - shift.y) + 'px';
        mapPinMainElement.style.left = (mapPinMainElement.offsetLeft - shift.x) + 'px';
      }

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

      mapPinsElement.removeEventListener('mousemove', onMapMouseMove);
      mapPinsElement.removeEventListener('mouseup', onMapMouseUp);
    }
  }

  // обработчики на элемент по клику мыши или по нажатию Enter
  function onMapPinMainElementEnter(evt) {
    if (evt.key === 'Enter') {
      window.main.switchToActiveModePage();
    }
  }

  function onMapPinMainElementMouseDown(evtClick) {
    if (evtClick.button === 0) {
      window.main.switchToActiveModePage();
    }
  }

  return {
    mapPinMainElement: mapPinMainElement,

    // ресет карты
    resetMap: function () {

      // главная возвращается на стартовые позиции
      mapPinMainElement.style.left = startLocationMapPinMainElement.x + 'px';
      mapPinMainElement.style.top = startLocationMapPinMainElement.y + 'px';

      // удаляем метки
      var mapPins = document.querySelector('.map__pins');
      var mapPinsChildrens = mapPins.children;
      var numberElements = mapPinsChildrens.length;
      var count = 0;
      var startIndexForRemoving = 2;
      while (count < numberElements - startIndexForRemoving) {
        mapPins.removeChild(mapPinsChildrens[startIndexForRemoving]);
        count++;
      }

      // удаляем карточку если открыта
      if (document.querySelector('.map__card')) {
        document.querySelector('.map__card').remove();
      }

      // удаляет событие, случай когда отправка формы происходит при открытой карточке
      document.removeEventListener('keydown', onPopupEscape);
    },

    // карта в неактивный режим
    switchMapToNoActive: function () {

      // проверяем если блок .map содержит .map--faded, если нет - добавляем
      if (!mapElement.classList.contains('map--faded')) {
        mapElement.classList.add('map--faded');
      }

      // вешаем disabled на все инпуты и select формы .map__filters
      window.util.setAttributeDisable(mapFiltersElement.querySelectorAll('input'));
      window.util.setAttributeDisable(mapFiltersElement.querySelectorAll('select'));

      // переход в активное состояние страницы при нажатии на гл.метке
      mapPinMainElement.addEventListener('mousedown', onMapPinMainElementMouseDown);
      mapPinMainElement.addEventListener('keydown', onMapPinMainElementEnter);

      // у главной метки удаляются события перемещения
      mapPinMainElement.removeEventListener('mousedown', window.map.onMapPinMainMouseDown);
    },

    // карта в активный режим
    switchMapToActive: function () {
      mapElement.classList.remove('map--faded');

      // удаляем disabled на все инпуты и select формы .map__filters
      window.util.removeAttributeDisable(mapFiltersElement.querySelectorAll('input'));
      window.util.removeAttributeDisable(mapFiltersElement.querySelectorAll('select'));

      // на основную метку вешаем перемещение
      mapPinMainElement.addEventListener('mousedown', onMapPinMainMouseDown);

      // удаляет с главной метки событие переключения режима страницы
      mapPinMainElement.removeEventListener('mousedown', onMapPinMainElementMouseDown);
      mapPinMainElement.removeEventListener('keydown', onMapPinMainElementEnter);

      // добавляет метки на карту
      pushElementsInPage();
    },
  };

})();
