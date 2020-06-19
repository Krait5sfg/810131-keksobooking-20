'use strict';
// модуль отдельной метки на карте
window.pin = (function () {

  return {
    // возвращает один элемент (метку на карте) на основе переданного шаблона c данными из объекта
    getElementPin: function (sample, object) {
      var newElement = sample.cloneNode(true);
      var mapPin = newElement.querySelector('.map__pin');
      var img = newElement.querySelector('img');

      // смещение
      // координаты без смещения распологают элемент верхним левым углом на точке
      // чтобы элемент указывала на точку, его надо поднять на всю высоту и сместить влево на половину ширины
      var offsetX = 50 / 2;
      var offsetY = 70;

      // координаты метки с учетом смещения
      mapPin.style.left = object.location.x - offsetX + 'px';
      mapPin.style.top = object.location.y - offsetY + 'px';

      // путь к картинке
      img.setAttribute('src', object.author.avatar);
      // alt картинки
      img.setAttribute('alt', object.offer.title);

      return newElement;
    },
  };

})();
