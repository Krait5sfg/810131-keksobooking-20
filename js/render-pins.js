'use strict';

// фильтрация и отрисовка меток на карте
window.renderPins = (function () {
  var MAX_COUNT_PIN = 5;

  // массив с объектами полученными с сервера
  var objects = [];

  // массив для меток на карте, заполнится после активации страницы
  var mapPinsElements = [];

  // переменная для активной метки, значение появляется при клике на метку
  var activeElement;

  var mapPinsElement = window.map.mapPinsElement;

  // функция получает данные с сервера, выводит на основании данных метки на карту
  // вешает события на обычную метку
  function onLoad(response) {

    // шаблон метки на карте
    var templatePin = document.querySelector('#pin').content;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < response.length; i++) {

      // проверка на поле offer в данных с сервера
      if (response[i].offer) {
        objects[i] = response[i];
        var newElement = window.pin.getElementPin(templatePin, objects[i]);
        newElement.querySelector('.map__pin').addEventListener('click', onMapPinClick);
        newElement.querySelector('.map__pin').addEventListener('keydown', onMapPinKeyDown);
        fragment.appendChild(newElement);
      } else {
        continue;
      }
    }
    mapPinsElement.appendChild(fragment);

    // массив с метками, нужен для отображения отдельной карточки
    mapPinsElements = document.querySelectorAll('.map__pin');

    // удаляем disabled на все инпуты и select формы .map__filters если загрузились данные с сервера
    if (objects.length) {
      window.map.removeDisableFromFilterForm();
    }
  }

  function onError(error) {
    throw new Error(error);
  }

  // обработчик при клике на метку или при нажатии Enter на метку
  function onMapPinClick(evt) {
    openCard(evt);
  }

  function onMapPinKeyDown(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      openCard(evt);
    }
  }

  function openCard(evt) {
    var targetElement;

    // проверяет где произошло событие (img или button)
    if (evt.target.nodeName === 'BUTTON') {

      // если button - тогда это активный элемент, на него будем вешать класс map__pin--active
      activeElement = evt.target;

      // и находим дочерний img
      targetElement = evt.target.querySelector('img');
    } else {

      // если img, тогда активный элемент его родитель
      activeElement = evt.target.parentNode;
      targetElement = evt.target;
    }

    // находим какая метка какому соответствует объекту по alt метки
    var alt = targetElement.alt;
    var startIndexCount = 1;
    for (var k = 0; k < objects.length; k++) {

      // начиная с элемента с индексом 1 удаляем со всем меток массива mapPinsElements класс map__pin--active
      mapPinsElements[startIndexCount].classList.remove('map__pin--active');
      startIndexCount++;

      if (objects[k].offer.title === alt) {
        var cardElement = window.card.getElementCard(objects[k]);

        // если карточка уже открыта то при клике на другую метку текущая карточка закроется
        if (document.querySelector('.map__card')) {
          closeCard();
        }

        // выводит карточку на страницу
        mapPinsElement.insertAdjacentElement('afterend', cardElement);
      }
    }

    // добавляем карточке события на закрытие
    cardElement.querySelector('.popup__close').addEventListener('click', onPopupClick);
    document.addEventListener('keydown', onPopupEscape);

    // добавляем текущему активному элементу map__pin--active
    activeElement.classList.add('map__pin--active');
  }

  // обработчики закрытия карточки по клику на крестике и нажатия кнопки Escape
  function onPopupClick() {
    closeCard();
  }

  function onPopupEscape(evt) {
    if (evt.key === 'Escape') {
      closeCard();
    }
  }

  function closeCard() {
    document.removeEventListener('keydown', onPopupEscape);

    // удаляет карточку
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').remove();
    }

    // удаляем map__pin--active с метки
    activeElement.classList.remove('map__pin--active');
  }

  return {

    // Отрисовывает метки на карте
    pushElementsInPage: function () {
      // получение данных с сервера, onLoad создает метки из этих данных
      window.backend.load(onLoad, onError);
    },
    onPopupEscape: onPopupEscape
  };
})();
