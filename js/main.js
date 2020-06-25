'use strict';
// модуль поведения страницы
window.main = (function () {

  // состояние страницы по-умолчанию:
  window.formPage.switchFormToNoActive();
  window.map.switchMapToNoActive();

  // переключает страницу в активный режим
  function switchToActiveModePage() {
    window.formPage.switchFormToActive();
    window.map.switchMapToActive();
  }

  // переключает страницу в неактивный режим
  function switchToNoActiveModePage() {
    window.formPage.switchFormToNoActive();
    window.map.switchMapToNoActive();

    // ресет карты
    window.map.resetMap();

    // делается reset формы
    window.formPage.resetForm();
  }

  return {
    switchToNoActiveModePage: switchToNoActiveModePage,
    switchToActiveModePage: switchToActiveModePage
  };
})();
