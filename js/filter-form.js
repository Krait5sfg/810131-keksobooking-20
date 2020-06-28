'use strict';

// модуль формы-фильтра на карте
window.filterForm = (function () {
  var mapFiltersElement = document.querySelector('.map__filters');
  var housingTypeElement = document.querySelector('#housing-type');
  var housingPriceElement = document.querySelector('#housing-price');
  var housingRoomsElement = document.querySelector('#housing-rooms');
  var housingGuestsElement = document.querySelector('#housing-guests');
  var filterWiFiElement = document.querySelector('#filter-wifi');
  var filterDishwasherElement = document.querySelector('#filter-dishwasher');
  var filterWasherElement = document.querySelector('#filter-washer');
  var filterParkingElement = document.querySelector('#filter-parking');
  var filterElevatorElement = document.querySelector('#filter-elevator');
  var filterConditionerElement = document.querySelector('#filter-conditioner');

  function filterSelect(select, item) {
    if (select.value !== 'any') {
      return select.value === item.toString();
    }
    return true;
  }

  function getFilteredObjects() {
    var filteredObjects = [];
    for (var i = 0; i < window.renderPins.objects.length; i++) {
      if (filteredObjects.length === 5) {
        break;
      }

      var object = window.renderPins.objects[i];
      if (filterSelect(housingTypeElement, object.offer.type) &&
        filterSelect(housingPriceElement, object.offer.price) &&
        filterSelect(housingRoomsElement, object.offer.rooms) &&
        filterSelect(housingGuestsElement, object.offer.guests)) {
        filteredObjects.push(object);
      }
    }
    return filteredObjects;
  }

  function onMapFiltersElementChange() {
    var filteredObjects = getFilteredObjects();
    window.renderPins.renderPins(filteredObjects);
  }

  return {
    mapFiltersElement: mapFiltersElement,

    resetFilterForm: function () {

      mapFiltersElement.reset();
      mapFiltersElement.removeEventListener('change', onMapFiltersElementChange);
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

    onMapFiltersElementChange: onMapFiltersElementChange
  };
})();
