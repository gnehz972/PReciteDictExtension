/**
 * Created with IntelliJ IDEA.
 * User: Michael
 * Date: 13-3-17
 * Time: 下午6:55
 * To change this template use File | Settings | File Templates.
 */

var table = document.querySelector('table'),
    checkAll = document.querySelector('input[name="checkAll"]'),
    btnDelte = document.querySelector('button#delete'),
    btnExport = document.querySelector('button#export');

checkAll.onclick = checkOrUncheckAll;

btnDelte.onclick = deleteWord;

btnExport.onclick = exprtAllWords;

chrome.extension.getBackgroundPage().getAllWords(function (result) {
    for (var i = 0; i < result.rows.length; i++) {
        var item = result.rows.item(i);
//        console.log('-----' + item.word + '--' + item.ps + '---' + item.trans + '--' + item.sentence);
        var itemArray = new Array(item.word, item.ps, item.trans, item.sentence);
        addRow(itemArray);
    }
});

function exprtAllWords() {
    delFile();
    chrome.extension.getBackgroundPage().getAllWords(createFile);
}

function deleteWord() {
    deleteRow();
}


function checkOrUncheckAll() {
    var rowCount = table.rows.length;
    for (var i = 1; i < rowCount; i++) {
        var singleBox = table.rows[i].cells[0].childNodes[0];
        singleBox.checked = (checkAll.checked == true);
    }
}

function addRow(item) {
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var cell0 = row.insertCell(i + 1);
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.name = "checkItem";
    cell0.appendChild(checkBox);

    for (var i = 0; i < item.length; i++) {
        var cell = row.insertCell(i + 1);
        cell.innerHTML = item[i];
    }
}

function deleteRow() {
    try {
        var rowCount = table.rows.length;

        for (var i = 1; i < rowCount; i++) {
            var row = table.rows[i];
            var word = row.cells[1].innerHTML;
            var checkbox = row.cells[0].childNodes[0];
            if (null != checkbox && true == checkbox.checked) {
                chrome.extension.getBackgroundPage().delWord(word);
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}

function delFile() {
    window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs) {
        fs.root.getFile('newword.txt', {create:false}, function (fileEntry) {

            fileEntry.remove(function () {
                console.log('File removed.');
            }, errorHandler);

        }, errorHandler);
    }, errorHandler);
}


function createFile(result) {
    window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs) {
        fs.root.getFile('newword.txt', {create:true}, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {

                var str = '';
                for (var i = 0; i < result.rows.length; i++) {
                    var word = result.rows.item(i).word,
                        ps = result.rows.item(i).ps,
                        trans = result.rows.item(i).trans.trim();

                    if (trans.indexOf("\n") != -1) {
                        var cn = trans.split("\n");
                        var translation = cn[0];
                        for (var j = 1; j < cn.length; j++) {
                            translation = translation + "\n#" + cn[j];
                        }
                    } else {
                        translation = trans;
                    }
                    str += "+" + word + "\r\n"
                        + "#" + translation + "\r\n"
                        + "&" + ps + "\r\n" + "$1\r\n";
                }

                var blob = new Blob([str], {'type':'text/plain'});

                fileWriter.onwriteend = function () {
                    chrome.tabs.create({"url":fileEntry.toURL(), "selected":true}, function (tab) {
                    });
                };
                fileWriter.write(blob);
            }, errorHandler);
        }, errorHandler);
    });
}

function errorHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }

}


