'use strict';
// модуль основной формы
window.formPage = (function () {

  var WIDTH_MARK = 65;
  var HEIGHT_MARK = 82;

  var addressElement = document.querySelector('#address');

  // синхронизация Типа жилья с Ценой за ночь
  var typeElement = document.querySelector('#type'); // select тип жилья
  var priceElement = document.querySelector('#price'); // инпут Цена за ночь
  var minPriceForHouse = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var wrongMessage = {
    1: '1 комната — для 1 гостя',
    2: '2 комнаты — для 2 гостей или для 1 гостя',
    3: '3 комнаты — для 3 гостей, для 2 гостей или для 1 гостя',
    100: '100 комнат — не для гостей'
  };

  typeElement.addEventListener('input', onTypeElementInput);

  // синхронизация Время заезда и Время выезда
  var timeInElement = document.querySelector('#timein');
  var timeOutElement = document.querySelector('#timeout');

  timeInElement.addEventListener('input', onTimeElementInput);
  timeOutElement.addEventListener('input', onTimeElementInput);

  // синхронизация инпута Количество комнат и инпута Количество мест
  var roomNumberElement = document.querySelector('#room_number');
  var capacityElement = document.querySelector('#capacity');
  var countRoom = 1;
  var countGuest = 1;

  roomNumberElement.addEventListener('input', onRoomNumberElementAndCapacityElementInput);
  capacityElement.addEventListener('input', onRoomNumberElementAndCapacityElementInput);

  function onRoomNumberElementAndCapacityElementInput(evt) {
    if (evt.target.id === 'room_number') {
      countRoom = parseInt(evt.target.value, 10);
    } else {
      countGuest = parseInt(evt.target.value, 10);
    }
    if (countGuest > countRoom || countRoom === 100 && countGuest !== 0 || countRoom !== 100 && countGuest === 0) {
      capacityElement.setCustomValidity(wrongMessage[countRoom]);
    } else {
      capacityElement.setCustomValidity('');
    }
  }

  function onTypeElementInput(evt) {
    priceElement.setAttribute('min', minPriceForHouse[evt.target.value]);
    priceElement.setAttribute('placeholder', minPriceForHouse[evt.target.value]);
  }

  function onTimeElementInput(evt) {
    var id = evt.target.id;
    var select;
    if (id === 'timein') {
      select = timeOutElement;
    } else if (id === 'timeout') {
      select = timeInElement;
    }
    select.value = evt.target.value;
  }

  return {
    addressElement: addressElement,
    priceElement: priceElement,

    // заполняет значение инпута address
    setAddressValue: function (isPageActive, mainPin, inputAddress) {
      var leftValue = parseInt(mainPin.style.left, 10);
      var topValue = parseInt(mainPin.style.top, 10);
      if (!isPageActive) {
        // если страница в неактивном режиме то вычисляются координаты серидины метки
        // в неактивном высота и ширина метки одинаковы
        inputAddress.value = (Math.round(leftValue + (WIDTH_MARK / 2))) + ' , ' + (Math.round(topValue + (WIDTH_MARK / 2)));
      }
      if (isPageActive) {
        // если страница в активном режиме то вычисляются координаты острого конца метки
        inputAddress.value = (Math.round(leftValue + (WIDTH_MARK / 2))) + ' , ' + (topValue + HEIGHT_MARK);
      }
    },
  };

})();
