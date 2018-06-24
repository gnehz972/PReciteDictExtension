/**
 * Created with IntelliJ IDEA.
 * User: Michael
 * Date: 13-3-16
 * Time: 下午10:53
 * To change this template use File | Settings | File Templates.
 */

var database = openDatabase('dict', '1.0', 'database', 5 * 1024 * 1024);
database.transaction(function (transaction) {
    transaction.executeSql('CREATE TABLE IF NOT EXISTS vocabulary (word NVARCHAR NOT NULL PRIMARY KEY ,trans NVARCHAR,ps NVARCHAR,pron NVARCHAR, sentence NVARCHAR, timestamp NVARCHAR)');
}, function (err) {
    console.log(err)
});


function insertNewWord(word, trans, ps, pron, sentence, onSuccess) {
    database.transaction(function (transaction) {
            transaction.executeSql('INSERT OR IGNORE INTO vocabulary(word,trans,ps,pron,sentence,timestamp) VALUES (?,?,?,?,?,?)'
                , [word, trans, ps, pron, sentence, (new Date().getTime())]);

        }, function (err) {
            console.log(err);
        }, onSuccess
    )
}

function delWord(word) {
    database.transaction(function (transaction) {
            transaction.executeSql('DELETE FROM vocabulary WHERE word =?'
                , [word]);

        }, function (err) {
            console.log(err);
            
        }
    )
}


function getAllWords(callback) {
    database.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM vocabulary',
            [],

            function (tran, result) {
                if (result.rows.length > 0) {
                    callback(result);
                }
            })
    }, function (err) {
        console.log(err);
    })
}


