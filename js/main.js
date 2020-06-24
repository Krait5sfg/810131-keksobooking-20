'use strict';
// модуль поведения страницы
window.main = (function () {

  var mapPinMainElement = window.map.mapPinMainElement;
  var adFormElement = window.formPage.adFormElement;

  // состояние страницы по-умолчанию:
  // - заполненый инпут address - неактивное состояние
  var isPageActiveFlag = false;
  switchPageRegime(isPageActiveFlag);

  // переход в активное состояние страницы при нажатии на гл.метке
  mapPinMainElement.addEventListener('mousedown', onMapPinMainElementMouseDown);
  mapPinMainElement.addEventListener('keydown', onMapPinMainElementEnter);

  // обработчики на элемент по клику мыши или по нажатию Enter
  function onMapPinMainElementEnter(evt) {
    if (evt.key === 'Enter') {
      switchToActiveModePage();
    }
  }

  function onMapPinMainElementMouseDown(evtClick) {
    if (evtClick.button === 0) {
      switchToActiveModePage();
    }
  }

  // переключает страницу в активный режим
  function switchToActiveModePage() {
    isPageActiveFlag = true;
    switchPageRegime(isPageActiveFlag);
    // window.formPage.setAddressValue(isPageActiveFlag);

    mapPinMainElement.removeEventListener('mousedown', onMapPinMainElementMouseDown);
    mapPinMainElement.removeEventListener('keydown', onMapPinMainElementEnter);
  }

  // переключает страницу в неактивный режим
  function switchToNoActiveModePage() {

    // включение неактивного режима
    isPageActiveFlag = false;
    switchPageRegime(isPageActiveFlag);

    // у главной метки удаляются события перемещения
    mapPinMainElement.removeEventListener('mousedown', window.map.onMapPinMainMouseDown);

    // гл.метка добавляются события нажатия на метку, которые переводят стр. в активный режим
    mapPinMainElement.addEventListener('mousedown', onMapPinMainElementMouseDown);
    mapPinMainElement.addEventListener('keydown', onMapPinMainElementEnter);

    // ресет карты
    window.map.resetMap();

    // делается reset формы
    window.formPage.resetForm();

    // стартовое значение поля Адрес
    // window.formPage.setAddressValue(isPageActiveFlag);

    // удаляются события с кнопки формы reset
    // adFormResetElement.removeEventListener('click', onAdFormResetElementClick);
    // adFormResetElement.removeEventListener('keydown', onAdFormResetElementKeyDown);

    // удаляются события с формы
    // adFormElement.removeEventListener('submit', onAdFormElementSumbit);
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

      // вешаем disabled на все инпуты и select формы .map__filters
      window.util.setAttributeDisable(mapFiltersElement.querySelectorAll('input'));
      window.util.setAttributeDisable(mapFiltersElement.querySelectorAll('select'));

      window.formPage.switchFormToNoActive();
    } else if (isPageActive) {

      // true переводит в активное состояние:
      mapElement.classList.remove('map--faded');
      adFormElement.classList.remove('ad-form--disabled');

      // удаляем disabled на все инпуты и select формы .map__filters
      window.util.removeAttributeDisable(mapFiltersElement.querySelectorAll('input'));
      window.util.removeAttributeDisable(mapFiltersElement.querySelectorAll('select'));

      // добавляет метки на карту
      window.map.pushElementsInPage();

      // на основную метку вешаем перемещение
      mapPinMainElement.addEventListener('mousedown', window.map.onMapPinMainMouseDown);
      window.formPage.switchFormToActive();
    }
  }

  return {
    // выводит на страницу сообщение об успешной отправке формы
    onLoad: function () {

      switchToNoActiveModePage();

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
    },

    // выводит на страницу сообщение об ошибке
    onError: function () {
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
    },

    switchToNoActiveModePage: switchToNoActiveModePage
  };
})();
