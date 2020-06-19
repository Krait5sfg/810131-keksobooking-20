'use strict';
// модуль для запросов на сервер
window.backend = (function () {
  var URL = 'https://javascript.pages.academy/keksobooking/data';
  var TIMEOUT_IN_MS = 10000;
  var StatusCode = {
    OK: 200
  };
  return {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = TIMEOUT_IN_MS;
      xhr.open('GET', URL);
      xhr.send();

      xhr.addEventListener('load', function () {
        if (xhr.status === StatusCode.OK) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });
    }
  };
})();
