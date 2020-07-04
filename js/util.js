'use strict';
// вспомогательные методы
window.util = (function () {

  return {
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
