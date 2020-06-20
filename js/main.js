'use strict';
// модуль поведения страницы
(function () {

  var mapPinMainElement = window.map.mapPinMainElement;
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
    window.formPage.setAddressValue(isPageActiveFlag, mapPinMainElement, window.formPage.addressElement);

    mapPinMainElement.removeEventListener('mousedown', onMapPinMainElementMouseDown);
    mapPinMainElement.removeEventListener('keydown', onMapPinMainElementEnter);
  }

  // переключает страницу в неактивный режим
  function switchToNoactiveModePage() {

    // включение неактивного режима
    isPageActiveFlag = false;
    switchPageRegime(isPageActiveFlag);

    // главная возвращается на стартовые позиции
    mapPinMainElement.style.left = startLocationMapPinMainElement.x + 'px';
    mapPinMainElement.style.top = startLocationMapPinMainElement.y + 'px';

    // у главной метки удаляются события перемещения
    mapPinMainElement.removeEventListener('mousedown', window.map.onMapPinMainMouseDown);

    // гл.метка добавляются события нажатия на метку, которые переводят стр. в активный режим
    mapPinMainElement.addEventListener('mousedown', onMapPinMainElementMouseDown);
    mapPinMainElement.addEventListener('keydown', onMapPinMainElementEnter);

    // удаляются все неосновные метки с карты
    window.map.removeElementsFromPage();

    // делается reset формы
    adFormElement.reset();

    // устанавливаем стартовые значения полей, которые не затронул reset формы
    window.formPage.setAddressValue(isPageActiveFlag, mapPinMainElement, window.formPage.addressElement);
    window.formPage.priceElement.placeholder = 1000;

    // удаляются события с кнопки формы reset
    window.formPage.adFormResetElement.removeEventListener('click', onAdFormResetElementClick);
    window.formPage.adFormResetElement.removeEventListener('keydown', onAdFormResetElementKeyDown);

    // удаляются события с формы
    adFormElement.removeEventListener('submit', onAdFormElementSumbit);
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

      // вешаем disabled на кнопку отправки формы и кнопку reset формы
      window.formPage.adFormSubmitElement.setAttribute('disabled', true);
      window.formPage.adFormResetElement.setAttribute('disabled', true);
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

      // удаляем disabled c кнопки отправки формы и кнопки reset формы
      window.formPage.adFormSubmitElement.removeAttribute('disabled');
      window.formPage.adFormResetElement.removeAttribute('disabled');

      // вешаем на кнопку reset событие сброса формы и страницы в неактивное исходное состояние
      window.formPage.adFormResetElement.addEventListener('click', onAdFormResetElementClick);
      window.formPage.adFormResetElement.addEventListener('keydown', onAdFormResetElementKeyDown);

      // вешаем событие отправки данных формы на сервер
      adFormElement.addEventListener('submit', onAdFormElementSumbit);

      // добавляет метки на карту
      window.map.pushElementsInPage();

      // на основную метку вешаем перемещение
      mapPinMainElement.addEventListener('mousedown', window.map.onMapPinMainMouseDown);
    }
  }

  // обработчики событий на кнопке reset формы
  function onAdFormResetElementClick(evt) {
    evt.preventDefault();
    switchToNoactiveModePage();
  }

  function onAdFormResetElementKeyDown(evtKey) {
    if (evtKey === 'Enter') {
      evtKey.preventDefault();
      switchToNoactiveModePage();
    }
  }

  // обработчик отправки данных формы на сервер
  function onAdFormElementSumbit(evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adFormElement), onLoad, onError);
  }

  // функция успешной отправки данных на сервер. переключает страницу в неактивный режим
  function onLoad() {

    switchToNoactiveModePage();

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
