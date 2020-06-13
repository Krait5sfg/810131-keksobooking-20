'use strict';
// модуль поведения страницы
(function () {

  var mapPinMainElement = document.querySelector('.map__pin--main');

  // состояние страницы по-умолчанию:
  // - заполненый инпут address - неактивное состояние
  var isPageActiveFlag = false;
  window.formPage.setAddressValue(isPageActiveFlag, mapPinMainElement, window.formPage.addressElement);
  switchPageRegime(isPageActiveFlag);

  // переход в активное состояние при нажатии на элементе
  mapPinMainElement.addEventListener('mousedown', onMapPinMainElementPress);
  mapPinMainElement.addEventListener('keydown', onMapPinMainElementPress);

  // обработчик на элемент по клику мыши или по нажатию Enter
  function onMapPinMainElementPress(evt) {
    if (evt.button === 0 || evt.key === 'Enter') {
      isPageActiveFlag = true;
      switchPageRegime(isPageActiveFlag);
      window.formPage.setAddressValue(isPageActiveFlag, mapPinMainElement, window.formPage.addressElement);

      mapPinMainElement.removeEventListener('mousedown', onMapPinMainElementPress);
      mapPinMainElement.removeEventListener('keydown', onMapPinMainElementPress);
    }
  }

  // переключает страницу в неактивное состояние и из неактивного в активное
  function switchPageRegime(isPageActive) {
    var mapElement = document.querySelector('.map');
    var adFormElement = document.querySelector('.ad-form');
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
    }
  }

})();
