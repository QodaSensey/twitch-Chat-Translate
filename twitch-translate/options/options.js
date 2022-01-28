var tSettings = {
  tInterval: 1000, //Интервал перевода
  tAPI: "googleTrans", //Используемый API 
  tLanguage: "ru-RU", // Язык перевода
};
var tChanelTable = new Map(); // Список каналов для перевода

function onError(e) {
  console.error(e);
}

// Сохраняем параметры в storage
function saveOptions() {
  console.log(`Save button click`);
  // Общие параметры
  tSettings.tInterval = document.querySelector("#time_translate").value, //Интервал перевода
  tSettings.tAPI = document.querySelector("#tt-api").value, //Используемый API
  tSettings. tLanguage = document.querySelector("#tt-language").value // Язык перевода  
  browser.storage.local.set({tSettings});
  // Список каналов
  tChanelTable.clear();
  var ch_table = document.getElementById("twitch-table").value.split("\n");
  for (var rowX = 0; rowX < ch_table.length; rowX++) {
    var chRow = ch_table[rowX].split(",");
    tChanelTable.set(chRow[0], chRow[1].trim());
  }
  browser.storage.local.set({tChanel : tChanelTable});
}

// Возвращаем значения по умолчанию
function clearOptions() {
  console.log(`Clear button click`);
  tSettings.tInterval = 1000;
  tSettings.tAPI = "googleTrans";
  tSettings.tLanguage = "ru-RU";
  browser.storage.local.set({tSettings});
  tChanelTable.clear();
  browser.storage.local.set({tChanel : tChanelTable});
}

function updateUI(restoredSettings) {
  console.log(`updateUI function run`);
  tSettings.tInterval = restoredSettings.tSettings.tInterval;
  tSettings.tAPI = restoredSettings.tSettings.tAPI;
  tSettings.tLanguage = restoredSettings.tSettings.tLanguage;
  document.querySelector("#time_translate").value = tSettings.tInterval;
  document.querySelector("#tt-api").value = tSettings.tAPI;
  document.querySelector("#tt-language").value = tSettings.tLanguage;
  document.getElementById("twitch-table").value = "";
  tChanelTable = restoredSettings.tChanel;
  var txArea = ''
  for (let key of tChanelTable.keys()) {
    txArea = txArea + key + ', ' + tChanelTable.get(key) + '\n'
  }
  document.getElementById("twitch-table").value = txArea
}

console.log(`Start options.js`);
const gettingSettings = browser.storage.local.get();
gettingSettings.then(updateUI, onError);
document.getElementById("clear").addEventListener("click", clearOptions);
document.getElementById("save").addEventListener("click", saveOptions);
