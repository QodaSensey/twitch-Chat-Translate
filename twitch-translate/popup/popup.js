function onError(error) {
  console.log(error);
}

// Получаем имя канал из адресной строки
function getTwitchChanel() {
     
}

// Кнопка Добавить
function openAddTranslate(event) {
  console.log(`Add button click`);
}

// Кнопка Удалить
function openDeleteTranslate(event) {
  console.log(`Delete button click`);
}

// Кнопка Автоперевод
function openAutoTranslate(event) {
  console.log(`AutoTranslate button click`);
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

// "main"

document.querySelector("#options").addEventListener("click", openOptions);
document.querySelector("#add_translate").addEventListener("click", openAddTranslate);
document.querySelector("#delete_translate").addEventListener("click", openDeleteTranslate);
document.querySelector("#auto_translate").addEventListener("click", openAutoTranslate);

