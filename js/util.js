'use strict';
// вспомогательные методы
window.util = (function () {

  return {
    // возвращает случ элемент из массива
    getRandomValueFromArray: function (values) {
      return values[Math.floor(Math.random() * values.length)];
    },

    // возвращает рандомный массив из элементов переданного массива
    getRandomArrayFromArray: function (values) {
      return values.slice(Math.floor(Math.random() * values.length));
    },

    // возвращает путь к изображению из массива
    getImagePath: function (values) {
      return values.shift(values);
    },

    // возвращает рандомное число от 0 до переданного числа
    getRandomNumber: function (number) {
      return Math.floor(Math.random() * number);
    },

    // возвращает рандомное число в диапазоне от numberMinimun до numberMaximum
    getRandomInteger: function (numberMinimun, numberMaximum) {
      var number = numberMinimun + Math.random() * (numberMaximum + 1 - numberMinimun);
      return Math.floor(number);
    },

    // добаляет все узлам атрибут disabled
    setAttributeDisable: function (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute('disabled', true);
      }
    },

    // удаляет все узлам атрибут disabled
    removeAttributeDisable: function (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].removeAttribute('disabled');
      }
    },
  };

})();
