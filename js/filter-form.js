'use strict';

// модуль формы-фильтра на карте
window.filterForm = (function () {
  var mapFiltersElement = document.querySelector('.map__filters');
  var housingTypeElement = document.querySelector('#housing-type');
  var filter = {
    housingType: 'any',
  };


  function onHousingTypeElementInput(evt) {
    filter.housingType = evt.target.value;
    window.renderPins.renderPins();

    // удаляет карточку если карточка открыта
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').remove();
    }
  }

  return {
    housingTypeElement: housingTypeElement,
    filter: filter,
    resetFilterForm: function () {
      mapFiltersElement.reset();
      filter.housingType = 'any';
      housingTypeElement.removeEventListener('input', onHousingTypeElementInput);
    },

    // удаляем disabled на все инпуты и select формы .map__filters
    removeDisableFromFilterForm: function () {
      window.util.removeAttributeDisable(mapFiltersElement.querySelectorAll('input'));
      window.util.removeAttributeDisable(mapFiltersElement.querySelectorAll('select'));
    },

    // вешаем disabled на все инпуты и select формы .map__filters
    setDisableOnFilterFormInputs: function () {
      window.util.setAttributeDisable(mapFiltersElement.querySelectorAll('input'));
      window.util.setAttributeDisable(mapFiltersElement.querySelectorAll('select'));
    },

    onHousingTypeElementInput: onHousingTypeElementInput
  };
})();
