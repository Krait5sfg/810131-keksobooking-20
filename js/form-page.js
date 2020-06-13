'use strict';
window.formPage = (function () {

  var WIDTH_MARK = 65;
  var HEIGHT_MARK = 82;

  var addressElement = document.querySelector('#address');

  // синхронизация инпута Количество комнат и инпута Количество мест
  var roomNumberElement = document.querySelector('#room_number');
  var capacityElement = document.querySelector('#capacity');
  var optionsElements = capacityElement.children;
  var countRoom = 1;

  setAttributeDisableOnCapacity();

  roomNumberElement.addEventListener('input', function () {
    countRoom = parseInt(roomNumberElement.value, 10);
    setAttributeDisableOnCapacity();
  });

  // проверяет поле в Количество комнат и в зависимости от значения блокирует или разблокирует
  // поля в Количестве гостей
  function setAttributeDisableOnCapacity() {
    for (var i = 0; i < optionsElements.length; i++) {
      var fieldValue = parseInt(optionsElements[i].value, 10);
      optionsElements[i].setAttribute('disabled', true);
      if (fieldValue <= countRoom && fieldValue !== 0 && countRoom !== 100) {
        optionsElements[i].removeAttribute('disabled');
      } else if (fieldValue === 0 && countRoom === 100) {
        optionsElements[i].removeAttribute('disabled');
      }
    }
  }

  return {
    addressElement: addressElement,

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
