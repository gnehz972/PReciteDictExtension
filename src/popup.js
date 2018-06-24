/**
 * Created with IntelliJ IDEA.
 * User: Michael
 * Date: 13-3-16
 * Time: 下午11:16
 * To change this template use File | Settings | File Templates.
 */

var searchbox = document.querySelector('textarea'),
    content = document.querySelector('section'),
    dictApi = 'powerword',
    data;


function showTranslation(reslut) {
    data = reslut;
    content.innerHTML = parseResult(reslut);
}


function parseResult(data) {
    var str = '', i, len;
    str += '<h2>' + data.key + '</h2>';
    if (data.pron) {
        str += '<img src="' + '/assets/sound_blue.png' + '" alt = ' + '"pron"' + '"><audio src="' + data.pron + '"></audio>';
    }
    if (data.tt[0].acceptation != '查询不到结果')
        str += '<img src="' + '/assets/add_new.png' + '" alt = ' + '"add"/>';
    if (data.ps) {
        str += '<p alt = "ps"><span>[ ' + data.ps + ' ]</span></p>';
    }
    for (i = 0, len = data.tt.length; i < len; i += 1) {
        str += '<p alt ="trans"><span>' + data.tt[i].pos + '</span> ' + data.tt[i].acceptation + '</p>';
    }
    return str;
}


searchbox.focus();
searchbox.addEventListener('input', function (e) {
    var diff = this.scrollHeight - this.offsetHeight, key;
    if (diff) {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

    key = this.value.trim();

    if (key.length > 0) {
        setTimeout(function () {
            if (e.target.value.trim() === key) {
                content.innerHTML = '<h1>processing...</h1>';
                chrome.extension.getBackgroundPage().simpleQuery(key, dictApi, "dict", showTranslation);
            }
        }, 1000);
    }
    else {
        content.innerHTML = '<h1>└(^o^)┘</h1>';
        this.style.height = '28px';
    }
}, false);

function onInsertSuccess() {
    var add = document.querySelector('img[alt = "add"]')
    add.src = '/assets/added.png';
}


delegate(content, 'img[alt = "pron"]', 'click', function () {
    this.nextSibling.play();
});

delegate(content, 'img[alt = "add"]', 'click', function () {
    var test = document.querySelector('textarea');
    var word = data.key;
    var ps = data.ps;
    var pron = data.pron;
    var translation = '';
    for (i = 0, len = data.tt.length; i < len; i += 1) {
        translation += data.tt[i].pos + data.tt[i].acceptation;
    }
    var sentence = '';
//    console.log(word);
//    console.log(translation);
//    console.log(ps);
//    console.log(pron);
    chrome.extension.getBackgroundPage().insertNewWord(word, translation, ps, pron, sentence, onInsertSuccess);
});


function delegate(node, selector, type, handler) {
    node.delegate || (node.delegate = {});
    node.delegate[selector] = {handler:handler};
    delegate.nodeList || (delegate.nodeList = []);
    if (delegate.nodeList.indexOf(node) === -1) {
        node.addEventListener(type, function (e) {
            var target = e.target, key, tmp;
            do {
                for (key in node.delegate) {
                    tmp = node.delegate[key];
                    if (Array.prototype.indexOf.call(node.querySelectorAll(key), target) > -1) {
                        delete e.target;
                        e.target = target;
                        tmp.handler.call(target, e);
                        return;
                    }
                }
                target = target.parentNode;
            }
            while (target && target !== this);
        }, false);
        delegate.nodeList.push(node);
    }
}