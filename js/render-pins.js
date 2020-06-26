'use strict';

// отрисовка меток на карте
window.renderPins = (function () {
  var MAX_COUNT_PIN = 5; // ограничение меток на карте

  // массив с объектами полученными с сервера
  var objects = [];

  // отфильтрованный массив c данными с сервера
  var filteredObjects = [];

  // массив для меток на карте, заполнится после активации страницы
  var mapPinsElements = [];

  // переменная для активной метки, значение появляется при клике на метку
  var activeElement;

  var mapPinsElement = window.map.mapPinsElement;

  // переменная счетчик для цикла выводящего метки на карту
  var takeNumber;

  // функция получает данные с сервера, выводит на основании данных метки на карту
  // вешает события на обычную метку
  function onLoad(response) {

    // проверка на поле offer в данных с сервера
    for (var i = 0; i < response.length; i++) {
      if (response[i].offer) {
        objects[i] = response[i];
      } else {
        continue;
      }
    }

    // удаляем disabled на все инпуты и select формы .map__filters если загрузились данные с сервера
    if (objects.length) {
      window.filterForm.removeDisableFromFilterForm();
    }

    // рендеринг меток на карту
    renderPins();
  }

  function onError(error) {
    throw new Error(error);
  }

  // функция отрисовки меток
  function renderPins() {

    // фильтрация
    filteredObjects = [];
    if (window.filterForm.filter.housingType === 'any') {
      filteredObjects = objects.slice(0, MAX_COUNT_PIN);
    }
    for (var j = 0; j < objects.length; j++) {
      if (objects[j].offer.type === window.filterForm.filter.housingType) {
        filteredObjects.push(objects[j]);
      } else if (filteredObjects.length === MAX_COUNT_PIN) {
        break;
      }
    }


    // if (window.filterForm.filter.housingType !== 'any') {
    //   filteredObjects = objects.filter(function (it) {
    //     return it.offer.type === window.filterForm.filter.housingType;
    //   });
    // } else {
    //   filteredObjects = objects;
    // }

    // удаляем метки перед новой отрисовкой если есть
    if (mapPinsElements.length) {
      deletePins();
    }

    var templatePin = document.querySelector('#pin').content;// шаблон метки на карте
    var fragment = document.createDocumentFragment();
    // takeNumber = filteredObjects.length > MAX_COUNT_PIN ? MAX_COUNT_PIN : filteredObjects.length;
    for (var i = 0; i < filteredObjects.length; i++) {
      var newElement = window.pin.getElementPin(templatePin, filteredObjects[i]);
      newElement.querySelector('.map__pin').addEventListener('click', onMapPinClick);
      newElement.querySelector('.map__pin').addEventListener('keydown', onMapPinKeyDown);
      fragment.appendChild(newElement);
    }
    mapPinsElement.appendChild(fragment);

    // массив с метками, нужен для отображения отдельной карточки
    mapPinsElements = document.querySelectorAll('.map__pin');
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
    for (var k = 0; k < filteredObjects.length; k++) {

      // начиная с элемента с индексом 1 удаляем со всем меток массива mapPinsElements класс map__pin--active
      mapPinsElements[startIndexCount].classList.remove('map__pin--active');
      startIndexCount++;

      if (filteredObjects[k].offer.title === alt) {
        var cardElement = window.card.getElementCard(filteredObjects[k]);

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

  // удаляет метки
  function deletePins() {
    var mapPins = document.querySelector('.map__pins');
    var mapPinsChildrens = mapPins.children;
    var numberElements = mapPinsChildrens.length;
    var count = 0;
    var startIndexForRemoving = 2;
    while (count < numberElements - startIndexForRemoving) {
      mapPins.removeChild(mapPinsChildrens[startIndexForRemoving]);
      count++;
    }
  }

  return {

    // Отрисовывает метки на карте
    pushElementsInPage: function () {
      // получение данных с сервера, onLoad создает метки из этих данных
      window.backend.load(onLoad, onError);
    },

    deletePins: deletePins,
    onPopupEscape: onPopupEscape,
    renderPins: renderPins
  };
})();
