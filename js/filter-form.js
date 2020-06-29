'use strict';

// модуль формы-фильтра на карте
window.filterForm = (function () {
  var TIMEOUT = 500;
  var mapFiltersElement = document.querySelector('.map__filters');
  var housingTypeElement = document.querySelector('#housing-type');
  var housingPriceElement = document.querySelector('#housing-price');
  var housingRoomsElement = document.querySelector('#housing-rooms');
  var housingGuestsElement = document.querySelector('#housing-guests');
  var checkboxes = mapFiltersElement.querySelectorAll('input[type=checkbox]');
  var lastTimeout;

  function filterSelect(select, objectValue) {
    switch (true) {
      case select.value === 'middle':
        return objectValue >= 10000 && objectValue <= 50000;
      case select.value === 'low':
        return objectValue < 10000;
      case select.value === 'high':
        return objectValue >= 50000;
      case select.value !== 'any':
        return select.value === objectValue.toString();
    }
    return true;
  }

  function filterCheckbox(objectFeatures) {
    var checkedCheckboxes = mapFiltersElement.querySelectorAll('.map__checkbox:checked');
    var fitResults = [];
    for (var j = 0; j < checkedCheckboxes.length; j++) {
      if (objectFeatures.includes(checkedCheckboxes[j].value)) {
        fitResults.push(checkedCheckboxes[j].value);
      } else {
        break;
      }
    }
    if (fitResults.length === checkedCheckboxes.length) {
      return objectFeatures;
    } else {
      return false;
    }
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
        filterSelect(housingGuestsElement, object.offer.guests) &&
        filterCheckbox(object.offer.features)) {
        filteredObjects.push(object);
      }
    }
    return filteredObjects;
  }

  function onMapFiltersElementChange() {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      var filteredObjects = getFilteredObjects();
      window.renderPins.renderPins(filteredObjects);
    }, TIMEOUT);
  }

  function onCheckboxElementKeyDown(evt) {
    if (evt.key === 'Enter') {
      window.util.toggleCheckedAttribute(evt.target);
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        var filteredObjects = getFilteredObjects();
        window.renderPins.renderPins(filteredObjects);
      }, TIMEOUT);
    }
  }

  return {
    mapFiltersElement: mapFiltersElement,

    resetFilterForm: function () {

      mapFiltersElement.reset();
      mapFiltersElement.removeEventListener('change', onMapFiltersElementChange);
      checkboxes.forEach(function (checkboxElement) {
        checkboxElement.removeEventListener('keydown', onCheckboxElementKeyDown);
        checkboxElement.removeAttribute('checked');
      });
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

    setFilterToActive: function () {
      mapFiltersElement.addEventListener('change', onMapFiltersElementChange);
      checkboxes.forEach(function (checkboxElement) {
        checkboxElement.addEventListener('keydown', onCheckboxElementKeyDown);
      });
    }
  };
})();
