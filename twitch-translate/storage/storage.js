/*
Значения по умолчанию
*/
var tSettings = {
  tInterval: 1000, //Интервал перевода
  tAPI: "googleTrans", //Используемый API 
  tLanguage: "ru-RU", // Язык перевода
};

var tChanel = new Map(); // Список каналов для перевода

/*
Сообщение об ошибке
*/
function onError(e) {
  console.error(e);
};

/*
Проверяем наличие значений
иначе по умолчанию
*/
function checkStoredSettings(storedSettings) {
  console.log(`Start Check Storage`);
  if (!storedSettings.tSettings) {
    console.log(`Default tSettings`);
    browser.storage.local.set({tSettings});
  };
  if (!storedSettings.tChanel) {
    console.log(`Default tChanel`);
    browser.storage.local.set({tChanel});
  }; 
}

const gettingStoredSettings = browser.storage.local.get();
console.log(`Check storage`);
gettingStoredSettings.then(checkStoredSettings, onError);
