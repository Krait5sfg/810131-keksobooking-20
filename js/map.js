'use strict';
// модуль карты
window.map = (function () {

  var mapPinMainElement = document.querySelector('.map__pin--main');
  var mapPinsElement = document.querySelector('.map__pins'); // блок на карте для меток
  var mapElement = document.querySelector('.map'); // карта

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

      switch (true) {
        case (mapPinMainElement.offsetTop - shift.y) <= boundMainPin.upper:
          mapPinMainElement.style.top = boundMainPin.upper + 'px';
          break;
        case (mapPinMainElement.offsetTop - shift.y) >= boundMainPin.lower:
          mapPinMainElement.style.top = boundMainPin.lower + 'px';
          break;
        case (mapPinMainElement.offsetLeft - shift.x) <= boundMainPin.left:
          mapPinMainElement.style.left = boundMainPin.left + 'px';
          break;
        case (mapPinMainElement.offsetLeft - shift.x) >= boundMainPin.right:
          mapPinMainElement.style.left = boundMainPin.right + 'px';
          break;
        default:
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
    mapPinsElement: mapPinsElement,

    // ресет карты
    resetMap: function () {

      // главная возвращается на стартовые позиции
      mapPinMainElement.style.left = startLocationMapPinMainElement.x + 'px';
      mapPinMainElement.style.top = startLocationMapPinMainElement.y + 'px';

      window.renderPins.deletePins();

      // удаляем карточку если открыта
      if (document.querySelector('.map__card')) {
        document.querySelector('.map__card').remove();
      }

      // удаляет событие, случай когда отправка формы происходит при открытой карточке
      document.removeEventListener('keydown', window.renderPins.onPopupEscape);

      window.filterForm.resetFilterForm();
    },

    // карта в неактивный режим
    switchMapToNoActive: function () {

      // проверяем если блок .map содержит .map--faded, если нет - добавляем
      if (!mapElement.classList.contains('map--faded')) {
        mapElement.classList.add('map--faded');
      }

      // вешаем disabled на все инпуты и select формы .map__filters
      window.filterForm.setDisableOnFilterFormInputs();

      // переход в активное состояние страницы при нажатии на гл.метке
      mapPinMainElement.addEventListener('mousedown', onMapPinMainElementMouseDown);
      mapPinMainElement.addEventListener('keydown', onMapPinMainElementEnter);

      // у главной метки удаляются события перемещения
      mapPinMainElement.removeEventListener('mousedown', window.map.onMapPinMainMouseDown);
    },

    // карта в активный режим
    switchMapToActive: function () {
      mapElement.classList.remove('map--faded');

      // добавляет метки на карту
      window.renderPins.pushElementsInPage();

      // на основную метку вешаем перемещение
      mapPinMainElement.addEventListener('mousedown', onMapPinMainMouseDown);

      // удаляет с главной метки событие переключения режима страницы
      mapPinMainElement.removeEventListener('mousedown', onMapPinMainElementMouseDown);
      mapPinMainElement.removeEventListener('keydown', onMapPinMainElementEnter);

      window.filterForm.setFilterToActive();
    },
  };

})();
