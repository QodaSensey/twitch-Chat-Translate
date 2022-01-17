(function (){

    //API для перевода
    //Yandex Translate API
    let YANDEX_TRANSLATE_API={

    }

    //Google Translate API
    let GOOGLE_TRANSLATE_API={
        sl:'auto',// исходный язык
        tl:'ru-RU',//язык перевода
        translate:function(q,callback){
            let data = {
                client:"gtx",
                dt:"t",
                dj:1,
                ie:"UTF-8",
                sl:this.sl,
                tl:this.tl,
                q
            }
            Requests.get("http://translate.google.cn/translate_a/single?"+Qs.stringify(data)).then((res)=>{
                callback({
                    success:true,
                    result:res.sentences[0].trans
                })
            }).catch(()=>{
                callback({
                    success:false,
                    result:"Запрос не выполнен!"
                })
            })
        }
    }

    //Настройки перевода
    const Config ={
        translateInterval: 1000, //Интервал перевода
        api:GOOGLE_TRANSLATE_API, //Используемый API 
        autoTranslate:false, //Автоперевод
    }

    //Сайты для перевода
    const TRANSLATE_MODEL={
        "www.twitch.tv":{
            getChatContainer(){
                return $('div[data-test-selector="chat-scrollable-area__message-container"]')
            },
            getChatMessageContainer(dom){
                return $(dom).find('span.text-fragment')
            }
        }
    }

    const Requests = {
        request:function Requests(query){
            return new Promise((resolve, reject)=>{
                query.onload = function(res) {
                    if (res.status === 200) {
                        let text = res.responseText;
                        let json = JSON.parse(text);
                        resolve(json)
                    }else{
                        reject(res);
                    }
                }
                query.onerror = function(res){
                    reject(res)
                }
                GM_xmlhttpRequest(query);
            })
        },
        get:function(url){
            return this.request({
                method:"get",
                url:url
            })
        },
        post:function(url,data){
            return this.request({
                method:"post",
                url:url,
                data:data,
                headers:{ "Content-Type": "application/x-www-form-urlencoded" }
            })
        }
    }

    //Получение сайта для перевода
    function getChatContainer(){
        return TRANSLATE_MODEL[window.location.host].getChatContainer();
    }

    //Получение перевода
    function getChatMessage(content){
        let $chartsContainer = TRANSLATE_MODEL[window.location.host].getChatMessageContainer(content);
        if($chartsContainer.length>0)
        {
            if(Config.autoTranslate)
            {
                translateTasks.push($chartsContainer)
            }else{
                addTranslateButton($chartsContainer)
            }
        }
    }

    //华丽的分割
    const HR = `<div style="border-bottom: darkgray 1px solid"></div>`;

    //Кнопка Перевести
    function addTranslateButton(target){
        let text = target.text();
        target.html(`${text}${HR}<button mark="my-button-mark" style="border: snow 1px solid;background-color: dodgerblue;width: 100%;color: white"><b>Перевод</b></button>`)
        target.find('button[mark="my-button-mark"]').click(()=>{
            target.html(`${text}`);
            translate(target)
        })
    }

    //Кнопка Повтор
    function addRetryButton(target,text,message){
        target.html(`${text}${HR}<button mark="my-button-mark"><b style="border: snow 1px solid;background-color: wheat;width: 100%;color: red">${message}</b></button>"`)
        target.find('button[mark="my-button-mark"]').click(()=>{
            target.html(`${text}`);
            translate(target)
        })
    }

    //Перевод сообщения
    function translate(target){
        let text = target.text().trim();
        if(text.length === 0){
            return
        }
        target.html(`${text}${HR}<b style="color: dodgerblue">Начать перевод</b>`)
        Config.api.translate(text,(result)=>{
            if(result.success){
                target.html(`${text}${HR}<b style="color: green">${result.result}</b>`)
            }else{
                addRetryButton(target,text,`Перевод не удался：${result.result}`)
            }
            translateItem = undefined;
        })
    }

    //Прослушиватель сообщений
    function addEventListener(dom){
        console.log(dom)
        dom.on('DOMNodeInserted',(e)=>{
            getChatMessage(e.target)
        })
    }

    //Очередь для перевода
    const translateTasks = []
    let translateItem = undefined;
    //Инициализация
    function init (dom){
        setInterval(()=>{
            if(translateTasks.length > 0 && !translateItem)
            {
                translateItem = translateTasks.shift()
                translate(translateItem)
            }
        },Config.autoTranslate)
        addEventListener(dom)
    }

    //Выполните цикл, чтобы проверить, загружено ли диалоговое окно (???)
    function tryInit(){
        let t = setInterval(()=>{
            let $chats = getChatContainer();
            if($chats.length>0){
                init($chats)
                clearInterval(t)
            }
        },1000)
    }
    tryInit();
})