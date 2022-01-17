// Сохраняем параметры в storage
function saveOptions(e) {
  console.log(`Save button click`);
  // Список каналов
  var chTemp = new Map();
  var ch_table = document.getElementById("twitch-table").value.split("\n");
    for (var rowX = 0; rowX < ch_table.length; rowX++) {
      var chRow = ch_table[rowX].split(",");
      chTemp.set(chRow[0], chRow[1]);
    }
  browser.storage.local.set({
    tSettings: {
      tInterval: document.querySelector("#time_translate").value, //Интервал перевода
      tAPI: document.querySelector("#tt-api").value, //Используемый API
      tLanguage: document.querySelector("#tt-language").value, // Язык перевода
      tChanel: chTemp // Список каналов
    }  
  });
}

function clearOptions() {
// Очищаем таблицу каналов
  console.log(`Clear button click`);
  document.querySelector("#twitch-table").value = "";
}

function updateUI(restoredSettings) {
  console.log(`updateUI function run`);
  document.querySelector("#time_translate").value = restoredSettings.tSettings.tInterval;    
  document.querySelector("#tt-api").value = restoredSettings.tSettings.tAPI;
  document.querySelector("#tt-language").value = restoredSettings.tSettings.tLanguage;
  document.getElementById("twitch-table").value = "";
  var chR = restoredSettings.tSettings.tChanel;
  var txArea = ''
  for (let key of chR.keys()) {
    txArea = txArea + key + ', ' + chR.get(key) + '\n'
  }
  document.getElementById("twitch-table").value = txArea
}

function onError(e) {
  console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

document.getElementById("clear").addEventListener("click", clearOptions);
document.getElementById("save").addEventListener("click", saveOptions);
