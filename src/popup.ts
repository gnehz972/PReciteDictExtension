import {queryWord} from "./api";
import {save, Word} from "./database";

const searchBox: HTMLTextAreaElement = document.getElementById("search-box") as HTMLTextAreaElement
const content = document.getElementById('content-section')

const assembleSearchResult = (word: Word) => {
    let str = '', i, len;
    str += '<h2>' + word.name + '</h2>';
    if (word.pron) {
        str += `<img src="/assets/sound_blue.png" id="play" alt = "pron"><audio id="pron" src="${word.pron}"></audio>`;
    }

    if (word.explain.length > 0) {
        str += `<img src="/assets/add_new.png" id="add" alt = "add"/>`;
    }

    if (word.ps) {
        str += `<p alt = "ps"><span>/${word.ps}/</span></p>`;
    }

    for (i = 0, len = word.explain.length; i < len; i += 1) {
        str += `<p alt ="trans"><span>${word.explain[i].part}</span>${word.explain[i].means}</p>`;
    }

    return str;
}


let timeoutId: any;
const debounce = (fn: Function, ms = 500) => {
    return function (this: any, ...args: any[]) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => fn.apply(null, args), ms);
    };
};

const queryAndShow = async (search: string) => {
    if (search) {
        content.innerHTML = '<h1>processing...</h1>';
        const word = await queryWord(search).catch( e => {
            content.innerHTML = `<p>查询不到结果</p>`
            throw e
        })
        content.innerHTML = assembleSearchResult(word);
        document.getElementById("play")?.addEventListener("click", () => {
            (document.getElementById("pron") as HTMLAudioElement).play()
        })
        document.getElementById("add").addEventListener("click", async () => {
            await save(word);
            (document.getElementById("add") as HTMLImageElement).src = "/assets/added.png";
        })
    } else {
        content.innerHTML = '<h1>└(^o^)┘</h1>';
        content.style.height = '28px';
    }
}

searchBox.focus();
searchBox.addEventListener("input", async (e) => {
    const search = searchBox.value.trim()
    debounce(queryAndShow)(search)
});