/*
Значения по умолчанию
*/
var tSettings = {
  tInterval: 1000, //Интервал перевода
  tAPI:'Google Translate', //Используемый API 
  tLanguage:'ru-RU', // Язык перевода
  tChanel : new Map()
}

/*
Сообщение об ошибке
*/
function onError(e) {
  console.error(e);
}

/*
Проверяем наличие значений
иначе по умолчанию
*/
function checkStoredSettings(storedSettings) {
  console.log(`Start Check Storage`);
  if (!storedSettings.tSettings) {
    console.log(`Default Settings`);
    browser.storage.local.set({tSettings});
  }
}

const gettingStoredSettings = browser.storage.local.get();
console.log(`Check storage`);
gettingStoredSettings.then(checkStoredSettings, onError);
