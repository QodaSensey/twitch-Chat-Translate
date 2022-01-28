function onError(error) {
  console.log(error);
}

// Получаем имя канала из адресной строки
function getTwitchChanel(activeURL) {
  console.log(`getTwitchChanel`);
  let url = new URL(activeURL);
  // Делаем кнопки не активные
  document.getElementById("add_translate").disabled = true;
  document.getElementById("delete_translate").disabled = true;
  document.getElementById("auto_translate").disabled = true;
  // Если активная вкладка Твич, получаем имя канала
  if (url.hostname == 'www.twitch.tv' && url.pathname != "/") {
    curChanel = url.pathname.slice(1);
    // Если канал есть в списке
    if (stCh.has(curChanel)) {
      document.getElementById("add_translate").disabled = true;
      document.getElementById("delete_translate").disabled = false;
      document.getElementById("auto_translate").disabled = false;
      // Проверка на автоперевод
      if (stCh.get(curChanel) == '1') {
        document.getElementById("auto_translate").innerHTML = "Автоперевод вкл"
      } else {
        document.getElementById("auto_translate").innerHTML = "Автоперевод выкл"
      }
    } else {
        document.getElementById("add_translate").disabled = false;
        document.getElementById("delete_translate").disabled = true;
        document.getElementById("auto_translate").disabled = true;
    }
  }
}

// Кнопка Добавить
function openAddTranslate(event) {
  console.log(`Add button click`);
  document.getElementById("add_translate").disabled = true;
  document.getElementById("delete_translate").disabled = false;
  document.getElementById("auto_translate").disabled = false;
  document.getElementById("auto_translate").innerHTML = "Автоперевод выкл";
  stCh.set(curChanel, '0');
  browser.storage.local.set({tChanel : stCh});
}

// Кнопка Удалить
function openDeleteTranslate(event) {
  console.log(`Delete button click`);
  document.getElementById("add_translate").disabled = false;
  document.getElementById("delete_translate").disabled = true;
  document.getElementById("auto_translate").disabled = true;
  document.getElementById("auto_translate").innerHTML = "Вкл/Выкл автоперевод";
  stCh.delete(curChanel);
  browser.storage.local.set({tChanel : stCh});
}

// Кнопка Автоперевод
function openAutoTranslate(event) {
  console.log(`AutoTranslate button click`);
  if (stCh.get(curChanel) == '1') {
    stCh.set(curChanel, '0');
    document.getElementById("auto_translate").innerHTML = "Автоперевод выкл";
  } else {
    stCh.set(curChanel, '1');
    document.getElementById("auto_translate").innerHTML = "Автоперевод вкл";
  }
  browser.storage.local.set({tChanel : stCh});
}

// Кнопка Настройки
function onOpened() {
  console.log(`Options page opened`);
}
function openOptions(event) {
  console.log(`Options button click`);
  var opening = browser.runtime.openOptionsPage();
  opening.then(onOpened, onError);
}

function logTabs(tabs) {
  curURL = tabs[0].url;
  console.log('0-'+curURL);
  gettingSettings2.then(onGot, onError);  
}

function onGot(item) {
  console.log('start onGot');
  stCh = item.tChanel;
  for (const [key, value] of stCh) {
    console.log(`${key}: ${value}`)
  }
  getTwitchChanel(curURL);
}


// "main"

console.log('Start popup.js');
document.getElementById("add_translate").disabled = true;
document.getElementById("delete_translate").disabled = true;
document.getElementById("auto_translate").disabled = true;  
let curURL = "";
let curChanel = "";
let stCh = new Map ();
const gettingSettings2 = browser.storage.local.get();
  
browser.tabs.query({currentWindow: true, active: true}).then(logTabs, onError);

document.querySelector("#options").addEventListener("click", openOptions);
document.querySelector("#add_translate").addEventListener("click", openAddTranslate);
document.querySelector("#delete_translate").addEventListener("click", openDeleteTranslate);
document.querySelector("#auto_translate").addEventListener("click", openAutoTranslate);
