import {del, getAll, Word} from "./database";

const table = document.querySelector('table'),
    checkAll: HTMLInputElement = document.querySelector('input[name="checkAll"]'),
    deleteBtn = document.querySelector('button#delete'),
    exportBtn = document.querySelector('button#export');

checkAll.addEventListener("click", () => toggleAll())
deleteBtn.addEventListener("click", () => deleteSelected())
exportBtn.addEventListener("click", () => exportAllWords())


let words: Word[]
const showAll = async () => {
    words = await getAll();
    words.forEach(it => addWordRow(it))
}

showAll()

const exportAllWords = async () => {
    const words = await getAll()
    const content = generateTxt(words)
    saveTextAsFile(content, "new-words", "text/plain")
}

const toggleAll = () => {
    let rowCount = table.rows.length;
    for (let i = 1; i < rowCount; i++) {
        let singleBox = table.rows[i].cells[0].childNodes[0] as HTMLInputElement;
        singleBox.checked = checkAll.checked;
    }
}

const addWordRow = (word: Word) => {
    const row = table.insertRow();
    const firstCell = row.insertCell();
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.name = "checkItem";
    firstCell.appendChild(checkBox);

    row.insertCell().innerHTML = word.name;
    row.insertCell().innerHTML = word.ps;
    const explain = word.explain.map(it => it.part + it.means.join(";")).join("<br/>")
    row.insertCell().innerHTML = explain;
    row.insertCell().innerHTML = null;
}

const deleteSelected = async () => {
    try {
        let rowCount = table.rows.length;
        for (let i = rowCount - 1; i >= 1; i--) {
            let row = table.rows[i];
            let word = words[i - 1];
            let checkbox = row.cells[0].childNodes[0] as HTMLInputElement;
            if (checkbox && checkbox.checked) {
                await del(word)
                words = words.filter(it => it.id != word.id)
                table.deleteRow(i)
            }
        }
    } catch (e) {
        console.log(`delete error ${e}`)
    }
}

const generateTxt = (words: Word[]) => {
    let str = '';
    words.forEach(word => {
        let trans = word.explain.map(it => it.part + it.means.join(";")).join("\n#")
        str += "+" + word.name + "\r\n"
            + "#" + trans + "\r\n"
            + "&" + word.ps + "\r\n" + "$1\r\n";
    })
    return str
}

const saveTextAsFile = (textToWrite: string, fileNameToSaveAs: string, fileType: string) => {
    let textFileAsBlob = new Blob([textToWrite], {type: fileType});
    let downloadLink = document.createElement('a');
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Download File';


    if (webkitURL != null) {
        downloadLink.href = webkitURL.createObjectURL(
            textFileAsBlob
        );
    } else {
        downloadLink.href = URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

