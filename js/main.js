'use strict';
// модуль поведения страницы
(function () {

  var mapPinMainElement = document.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');

  var startLocationMapPinMainElement = {
    x: mapPinMainElement.offsetLeft,
    y: mapPinMainElement.offsetTop
  };

  // состояние страницы по-умолчанию:
  // - заполненый инпут address - неактивное состояние
  var isPageActiveFlag = false;
  window.formPage.setAddressValue(isPageActiveFlag, mapPinMainElement, window.formPage.addressElement);
  switchPageRegime(isPageActiveFlag);

  // переход в активное состояние страницы при нажатии на элементе
  mapPinMainElement.addEventListener('mousedown', onMapPinMainElementClick);
  mapPinMainElement.addEventListener('keydown', onMapPinMainElementEnter);

  // отправка данных формы на сервер
  adFormElement.addEventListener('submit', onAdFormElementSumbit);

  // обработчики на элемент по клику мыши или по нажатию Enter
  function onMapPinMainElementEnter(evt) {
    if (evt.key === 'Enter') {
      switchToActiveModePage();
    }
  }

  function onMapPinMainElementClick(evtClick) {
    if (evtClick.button === 0) {
      switchToActiveModePage();
    }
  }

  // переключает страницу в активный режим
  function switchToActiveModePage() {
    isPageActiveFlag = true;
    switchPageRegime(isPageActiveFlag);
    window.formPage.setAddressValue(isPageActiveFlag, mapPinMainElement, window.formPage.addressElement);

    mapPinMainElement.removeEventListener('mousedown', onMapPinMainElementClick);
    mapPinMainElement.removeEventListener('keydown', onMapPinMainElementEnter);
  }

  // переключает страницу в неактивное состояние и из неактивного в активное
  function switchPageRegime(isPageActive) {
    var mapElement = document.querySelector('.map');
    var mapFiltersElement = document.querySelector('.map__filters');

    // false переводит в неактивное состояние:
    if (!isPageActive) {

      // проверяем если блок .map содержит .map--faded, если нет - добавляем
      if (!mapElement.classList.contains('map--faded')) {
        mapElement.classList.add('map--faded');
      }

      // проверяем если блок .ad-form содержит .ad-form-disabled, если нет - добавляем
      if (!adFormElement.classList.contains('ad-form--disabled')) {
        adFormElement.classList.add('ad-form--disabled');
      }

      // вешаем disabled на все инпуты и select формы .ad-form
      window.util.setAttributeDisable(adFormElement.querySelectorAll('input'));
      window.util.setAttributeDisable(adFormElement.querySelectorAll('select'));

      // вешаем disabled на все инпуты и select формы .map__filters
      window.util.setAttributeDisable(mapFiltersElement.querySelectorAll('input'));
      window.util.setAttributeDisable(mapFiltersElement.querySelectorAll('select'));
    } else if (isPageActive) {

      // true переводит в активное состояние:
      mapElement.classList.remove('map--faded');
      adFormElement.classList.remove('ad-form--disabled');

      // удаляем disabled на все инпуты и select формы .ad-form
      window.util.removeAttributeDisable(adFormElement.querySelectorAll('input'));
      window.util.removeAttributeDisable(adFormElement.querySelectorAll('select'));

      // удаляем disabled на все инпуты и select формы .map__filters
      window.util.removeAttributeDisable(mapFiltersElement.querySelectorAll('input'));
      window.util.removeAttributeDisable(mapFiltersElement.querySelectorAll('select'));

      // добавляет метки на карту
      window.map.pushElementsInPage();

      // на основную метку вешаем перемещение
      mapPinMainElement.addEventListener('mousedown', onMapPinMainMouseDown);
    }
  }

  // обработчик нажатия мыши на основную метку
  function onMapPinMainMouseDown(evtMouseDown) {
    evtMouseDown.preventDefault();
    // var mapPinMainElement = document.querySelector('.map__pin--main');

    // стартовые координаты
    var startCoords = {
      x: evtMouseDown.clientX,
      y: evtMouseDown.clientY
    };

    document.querySelector('.map__pins').addEventListener('mousemove', onMapMouseMove);
    document.querySelector('.map__pins').addEventListener('mouseup', onMapMouseUp);

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

      document.querySelector('.map__pins').removeEventListener('mousemove', onMapMouseMove);
      document.querySelector('.map__pins').removeEventListener('mouseup', onMapMouseUp);
    }
  }

  // обработчик отправки данных формы на сервер
  function onAdFormElementSumbit(evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adFormElement), onLoad, onError);
  }

  // функция успешной отправки данных на сервер. переключает страницу в неактивный режим
  function onLoad() {

    // включение неактивного режима
    isPageActiveFlag = false;
    switchPageRegime(isPageActiveFlag);

    // главная возвращается на стартовые позиции
    mapPinMainElement.style.left = startLocationMapPinMainElement.x + 'px';
    mapPinMainElement.style.top = startLocationMapPinMainElement.y + 'px';

    // у главной метки удаляются события перемещения
    mapPinMainElement.removeEventListener('mousedown', onMapPinMainMouseDown);

    // гл.метка добавляются события нажатия на метку, которые переводят стр. в активный режим
    mapPinMainElement.addEventListener('mousedown', onMapPinMainElementClick);
    mapPinMainElement.addEventListener('keydown', onMapPinMainElementEnter);

    // удаляются все неосновные метки с карты
    window.map.removeElementsFromPage();

    // делается reset формы
    adFormElement.reset();

    // устанавливаем стартовые значения полей, которые не затронул reset формы
    window.formPage.setAddressValue(isPageActiveFlag, mapPinMainElement, window.formPage.addressElement);
    window.formPage.priceElement.placeholder = 1000;

    // сообщение об успешной отправке
    var successElement = document.querySelector('#success').content.cloneNode(true);
    var mainElement = document.querySelector('main');
    mainElement.appendChild(successElement);

    // события закрывающие сообщение об успешной отправке
    document.addEventListener('keydown', onDocumentKeyDown);
    document.addEventListener('click', onDocumentClick);

    function closeSuccessMessage() {
      document.querySelector('.success').remove();
      document.removeEventListener('keydown', onDocumentKeyDown);
      document.removeEventListener('click', onDocumentClick);
    }

    function onDocumentKeyDown(evt) {
      if (evt.key === 'Escape') {
        closeSuccessMessage();
      }
    }

    function onDocumentClick(evt) {
      if (evt.button === 0) {
        closeSuccessMessage();
      }
    }
  }

  // функция запускается при ошибке отправки основной формы
  function onError() {

    // сообщение об ошибке
    var errorElement = document.querySelector('#error').content.cloneNode(true);
    var mainElement = document.querySelector('main');
    mainElement.appendChild(errorElement);

    // события закрывающие сообщение об ошибке
    document.querySelector('.error__button').addEventListener('click', onErrorButtonClick);
    document.addEventListener('keydown', onDocumentKeyDown);
    document.addEventListener('click', onDocumentClick);

    function closeErrorMessage() {
      document.querySelector('.error').remove();
      document.removeEventListener('keydown', onDocumentKeyDown);
      document.removeEventListener('click', onDocumentClick);
    }

    function onErrorButtonClick(evt) {
      if (evt.button === 0) {
        closeErrorMessage();
      }
    }

    function onDocumentKeyDown(evt) {
      if (evt.key === 'Escape') {
        closeErrorMessage();
      }
    }

    function onDocumentClick(evt) {
      if (evt.button === 0) {
        closeErrorMessage();
      }
    }
  }
})();
