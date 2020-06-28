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

  var filter = {
    housingType: 'any',
    housingPrice: 'any',
    housingRooms: 'any',
    housingGuests: 'any',
    wifi: 'any',
    dishwasher: 'any',
    washer: 'any',
    parking: 'any',
    elevator: 'any',
    conditioner: 'any',
  };

  function onHousingTypeElementInput(evt) {
    filter.housingType = evt.target.value;
    renderPinsAndRemoveCard();
  }

  function onHousingPriceElementInput(evt) {
    filter.housingPrice = evt.target.value;
    renderPinsAndRemoveCard();
  }

  function onHousingRoomsElementInput(evt) {
    filter.housingRooms = evt.target.value;
    renderPinsAndRemoveCard();
  }

  function onHousingGuestsElementInput(evt) {
    filter.housingGuests = evt.target.value;
    renderPinsAndRemoveCard();
  }

  function onFilterWiFiElementInput(evtCheckbox) {
    getCheckboxValue(evtCheckbox);
    renderPinsAndRemoveCard();
  }

  function onFilterDishwasherElementInput(evtCheckbox) {
    getCheckboxValue(evtCheckbox);
    renderPinsAndRemoveCard();
  }

  function onFilterWasherElementInput(evtCheckbox) {
    getCheckboxValue(evtCheckbox);
    renderPinsAndRemoveCard();
  }

  function onFilterParkingElementInput(evtCheckbox) {
    getCheckboxValue(evtCheckbox);
    renderPinsAndRemoveCard();
  }

  function onFilterElevatorElementInput(evtCheckbox) {
    getCheckboxValue(evtCheckbox);
    renderPinsAndRemoveCard();
  }

  function onFilterConditionerElement(evtCheckbox) {
    getCheckboxValue(evtCheckbox);
    renderPinsAndRemoveCard();
  }

  function renderPinsAndRemoveCard() {
    window.renderPins.renderPins(); // отрисовка меток
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').remove();// удаляет карточку если карточка открыта
    }
  }

  function getCheckboxValue(evtCheckbox) {
    if (evtCheckbox.target.checked) {
      filter[evtCheckbox.target.value] = evtCheckbox.target.value;
    } else {
      filter[evtCheckbox.target.value] = 'any';
    }
  }

  return {
    filter: filter,

    resetFilterForm: function () {

      mapFiltersElement.reset();
      filter.housingType = 'any';
      filter.housingPrice = 'any';
      filter.housingRooms = 'any';
      filter.housingGuests = 'any';
      filter.wifi = 'any';
      filter.dishwasher = 'any';
      filter.washer = 'any';
      filter.parking = 'any';
      filter.elevator = 'any';
      filter.conditioner = 'any';
      housingTypeElement.removeEventListener('input', onHousingTypeElementInput);
      housingPriceElement.removeEventListener('input', onHousingPriceElementInput);
      housingRoomsElement.removeEventListener('input', onHousingRoomsElementInput);
      housingGuestsElement.removeEventListener('input', onHousingGuestsElementInput);
      filterWiFiElement.removeEventListener('input', onFilterWiFiElementInput);
      filterDishwasherElement.removeEventListener('input', onFilterDishwasherElementInput);
      filterWasherElement.removeEventListener('input', onFilterWasherElementInput);
      filterParkingElement.removeEventListener('input', onFilterParkingElementInput);
      filterElevatorElement.removeEventListener('input', onFilterElevatorElementInput);
      filterConditionerElement.removeEventListener('input', onFilterConditionerElement);
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

    setEventListenerOnElementsFilterForm: function () {
      housingTypeElement.addEventListener('input', onHousingTypeElementInput);
      housingPriceElement.addEventListener('input', onHousingPriceElementInput);
      housingRoomsElement.addEventListener('input', onHousingRoomsElementInput);
      housingGuestsElement.addEventListener('input', onHousingGuestsElementInput);
      filterWiFiElement.addEventListener('input', onFilterWiFiElementInput);
      filterDishwasherElement.addEventListener('input', onFilterDishwasherElementInput);
      filterWasherElement.addEventListener('input', onFilterWasherElementInput);
      filterParkingElement.addEventListener('input', onFilterParkingElementInput);
      filterElevatorElement.addEventListener('input', onFilterElevatorElementInput);
      filterConditionerElement.addEventListener('input', onFilterConditionerElement);
    },

    testFilter: function () {
      var object = {};
      for (var key in filter) {
        if (filter.hasOwnProperty(key) && filter[key] !== 'any') {
          object[key] = filter[key];
        }
      }
      return object;
    }
  };
})();
