'use strict';
// модуль основной формы
window.formPage = (function () {

  var WIDTH_MARK = 65;
  var HEIGHT_MARK = 82;
  var adFormElement = document.querySelector('.ad-form'); // форма
  var addressElement = document.querySelector('#address');
  var adFormSubmitElement = document.querySelector('.ad-form__submit'); // кнопка ОПУБЛИКОВАТЬ
  var adFormResetElement = document.querySelector('.ad-form__reset'); // кнопка ОЧИСТИТЬ
  var mapPinMainElement = window.map.mapPinMainElement; // основная метка
  var mainFormCheckboxes = adFormElement.querySelectorAll('input[type=checkbox]');
  var addressElementRegime = {
    noActive: false,
    active: true
  };
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

  // отправка данных на сервер
  function onAdFormElementSumbit(evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adFormElement), onLoad, onError);
  }

  // сообщение на страницу об успешной отправке и переключение режима страницы
  function onLoad() {

    window.main.switchToNoActiveModePage();

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

  // выводит на страницу сообщение об ошибке
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

  // заполняет значение инпута address
  function setAddressValue(isPageActive) {
    var leftValue = parseInt(mapPinMainElement.style.left, 10);
    var topValue = parseInt(mapPinMainElement.style.top, 10);

    // если страница в неактивном режиме то вычисляются координаты серидины метки
    // если страница в активном режиме то вычисляются координаты острого конца метки
    addressElement.value = !isPageActive ?
      (Math.round(leftValue + (WIDTH_MARK / 2))) + ' , ' + (Math.round(topValue + (WIDTH_MARK / 2))) :
      (Math.round(leftValue + (WIDTH_MARK / 2))) + ' , ' + (topValue + HEIGHT_MARK);
  }

  // обработчики событий на кнопке reset формы
  function onAdFormResetElementClick(evt) {
    evt.preventDefault();
    window.main.switchToNoActiveModePage();
  }

  function onAdFormResetElementKeyDown(evtKey) {
    if (evtKey === 'Enter') {
      evtKey.preventDefault();
      window.main.switchToNoActiveModePage();
    }
  }

  function onCheckboxElementKeyDown(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      window.util.toggleCheckedAttribute(evt.target);
    }
  }

  return {
    adFormElement: adFormElement,
    adFormSubmitElement: adFormSubmitElement,
    adFormResetElement: adFormResetElement,

    // ресет формы
    resetForm: function () {
      adFormElement.reset();
      countRoom = 1;
      countGuest = 1;
      priceElement.placeholder = 1000;
      setAddressValue(addressElementRegime.noActive);
    },

    // переключает форму в неактивный режим
    switchFormToNoActive: function () {

      // проверяем если блок .ad-form содержит .ad-form-disabled, если нет - добавляем
      if (!adFormElement.classList.contains('ad-form--disabled')) {
        adFormElement.classList.add('ad-form--disabled');
      }

      // вешаем disabled на все инпуты и select формы .ad-form
      window.util.setAttributeDisable(adFormElement.querySelectorAll('input'));
      window.util.setAttributeDisable(adFormElement.querySelectorAll('select'));

      // вешаем disabled на кнопку отправки формы и кнопку reset формы
      adFormSubmitElement.setAttribute('disabled', true);
      adFormResetElement.setAttribute('disabled', true);

      // стартовое значение поля Адрес
      setAddressValue(addressElementRegime.noActive);

      // удаляются события с формы
      adFormElement.removeEventListener('submit', onAdFormElementSumbit);

      // удаляются события с кнопки формы reset
      adFormResetElement.removeEventListener('click', onAdFormResetElementClick);
      adFormResetElement.removeEventListener('keydown', onAdFormResetElementKeyDown);

      mainFormCheckboxes.forEach(function (checkboxElement) {
        checkboxElement.removeEventListener('keydown', onCheckboxElementKeyDown);
        checkboxElement.removeAttribute('checked');
      });
    },

    // переключает форму в активный режим
    switchFormToActive: function () {
      adFormElement.classList.remove('ad-form--disabled');

      // удаляем disabled на все инпуты и select формы .ad-form
      window.util.removeAttributeDisable(adFormElement.querySelectorAll('input'));
      window.util.removeAttributeDisable(adFormElement.querySelectorAll('select'));

      // удаляем disabled c кнопки отправки формы и кнопки reset формы
      adFormSubmitElement.removeAttribute('disabled');
      adFormResetElement.removeAttribute('disabled');

      // вешаем на кнопку reset событие сброса формы и страницы в неактивное исходное состояние
      adFormResetElement.addEventListener('click', onAdFormResetElementClick);
      adFormResetElement.addEventListener('keydown', onAdFormResetElementKeyDown);

      mainFormCheckboxes.forEach(function (checkboxElement) {
        checkboxElement.addEventListener('keydown', onCheckboxElementKeyDown);
      });

      // вешаем событие отправки данных формы на сервер
      adFormElement.addEventListener('submit', onAdFormElementSumbit);

      setAddressValue(addressElementRegime.active);
    },

    setAddressValue: setAddressValue,
  };

})();
