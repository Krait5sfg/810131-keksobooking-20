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
  function renderPins(filteredObjectsFromFilterForm) {

    // фильтрация
    if (!filteredObjectsFromFilterForm) {
      filteredObjects = objects.slice(0, MAX_COUNT_PIN);
    } else {
      filteredObjects = filteredObjectsFromFilterForm;
    }

    // удаляем метки перед новой отрисовкой если есть
    if (mapPinsElements.length) {
      deletePins();
    }

    // если карточка уже открыта - то при новой отрисовке меток закроется
    if (document.querySelector('.map__card')) {
      closeCard();
    }

    var templatePinElement = document.querySelector('#pin').content;// шаблон метки на карте
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < filteredObjects.length; i++) {
      var newElement = window.pin.getElementPin(templatePinElement, filteredObjects[i]);
      newElement.querySelector('.map__pin').addEventListener('click', onMapPinClick);
      newElement.querySelector('.map__pin').addEventListener('keydown', onMapPinKeyDown);
      fragment.appendChild(newElement);
    }
    mapPinsElement.appendChild(fragment);

    // массив с метками, нужен для отображения отдельной карточки
    mapPinsElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
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
    var altAttribute = targetElement.alt;
    for (var k = 0; k < filteredObjects.length; k++) {

      // удаляем со всем меток массива mapPinsElements класс map__pin--active
      mapPinsElements[k].classList.remove('map__pin--active');

      if (filteredObjects[k].offer.title === altAttribute) {
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
    document.querySelector('.map__card').remove();

    // удаляем map__pin--active с метки
    activeElement.classList.remove('map__pin--active');
  }

  // удаляет метки
  function deletePins() {
    var mapPinsElementChildrens = mapPinsElement.children;
    var countElement = mapPinsElementChildrens.length;
    var count = 0;
    var startIndexForRemoving = 2;
    while (count < countElement - startIndexForRemoving) {
      mapPinsElement.removeChild(mapPinsElementChildrens[startIndexForRemoving]);
      count++;
    }
  }

  return {
    objects: objects,
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
