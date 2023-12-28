// function simpleQuery(key, dict, type,callback) {
//     var q = new Query();
//     q.query({
//         word:key,
//         api:dict,
//         callback:callback
//     });
// }


import {Word} from "./database";

interface CibaResponse {
    word_name: string;
    is_CRI: number;
    exchange: Exchange;
    symbols: Symbol[];
    items: string[];
}

interface Symbol {
    ph_en: string;
    ph_am: string;
    ph_other: string;
    ph_en_mp3: string;
    ph_am_mp3: string;
    ph_tts_mp3: string;
    parts: Part[];
}

interface Part {
    part: string;
    means: string[];
}

interface Exchange {
    word_pl: string[];
    word_past: string[];
    word_done: string[];
    word_ing: string[];
    word_third: string[];
    word_er: string;
    word_est: string;
}

const query = async (name: string): Promise<CibaResponse> => {
    return fetch(`http://dict-co.iciba.com/api/dictionary.php?key=FA00E25D175874FFA4D7B6765EE65026&type=json&w=${name}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
}

export const queryWord = async (name: string): Promise<Word> => {
    return query(name)
        .then(response => {
            let symbol = response.symbols[0]
            if (symbol) {
                return {
                    name: response.word_name,
                    explain: symbol.parts.map(it => ({part: it.part, means: it.means})),
                    ps: symbol.ph_am,
                    pron: symbol.ph_am_mp3
                }
            } else {
                return {
                    name: response.word_name,
                    explain: [],
                    ps: "",
                    pron: ""
                }
            }
        })
}

// var API = {
//     powerword:{
//         type:'dict',
//         url:'http://dict-co.iciba.com/api/dictionary.php',
//         data:'key=FA00E25D175874FFA4D7B6765EE65026&w=?',
//         method:'get',
//         dataType:'xml',
//         parse:function (res) {
//             var xml = res, ret = {tt:[]}, element;
//             element = xml.getElementsByTagName('acceptation');
//             if (element.length) {
//                 $.each(element, function (index, item) {
//                     var pos = item.previousSibling.previousSibling;
//                     ret.tt.push({
//                         pos:(pos.tagName.toLowerCase() === 'pos' || pos.tagName.toLowerCase() === 'fe') ? pos.firstChild.nodeValue : '',
//                         acceptation:item.firstChild.nodeValue
//                     });
//                 });
//
//                 element = xml.getElementsByTagName('ps')[0];
//                 ret.ps = element ? element.firstChild.nodeValue : '';
//
//                 element = xml.getElementsByTagName('pron')[0];
//                 ret.pron = element ? element.firstChild.nodeValue.trim() : '';
//
//                 return ret;
//             }
//         }
//     }
//    bing: {
//        type: 'dict',
//        url: 'http://dict.bing.com.cn/io.aspx',
//        data: 't=dict&ut=default&ulang=ZH-CN&tlang=EN-US&q=?',
//        method: 'post',
//        dataType: 'text',
//        parse: function (res) {
//            var ret = {tt:[]}, element;
//            res = JSON.parse(res).ROOT;
//            if (res.DEF) {
//                ret.ps = res.PROS.PRO ? (res.PROS.PRO.length ? res.PROS.PRO[0].$ : res.PROS.PRO.$) : '';
//
//                ret.pron = res.AH ? 'http://media.engkoo.com:8129/en-us/' + res.AH.$ + '.mp3' : '';
//
//                element = res.DEF[0].SENS;
//                if (element) {
//                    if (!element.length) {element = [element];}
//                    $.each(element, function (index, item) {
//                        var t;
//                        if (item.SEN.length) {
//                            t = [];
//                            for (var i = 0; i < item.SEN.length ; i += 1) {
//                                t.push(item.SEN[i].D.$);
//                            }
//                            t = t.join(',')
//                        }
//                        else {
//                            t = item.SEN.D.$;
//                        }
//
//                        ret.tt.push({
//                            pos: item.$POS + '.',
//                            acceptation: t
//                        });
//                    });
//                    return ret;
//                }
//            }
//        }
//    }
// };


// Query = Class(API, {
//
//     init:function (args) {
//
//     },
//
//     query:function (options) {
//         var self = this,
//             word = options.word,
//             api = options.api,
//             callback = options.callback,
//             data = this[api].data.replace('?', encodeURIComponent(word));
//
//         $.ajax({
//             url:self[api].url,
//             type:self[api].method,
//             data:data,
//             dataType:self[api].dataType,
//             success:function (response) {
//                 var result = self[api].parse(response), dicts = [];
//                 for (var key in API) {
//                     if (API[key].type === self[api].type) {
//                         dicts.push(key);
//                     }
//                 }
//                 dicts.splice(dicts.indexOf(api), 1);
//                 dicts.unshift(api);
//                 if (result) {
//                     result.key = word;
//                     result.dicts = dicts;
//                     result.type = self[api].type;
//                     callback(result);
//                 }
//                 else {
//                     callback({key:word, dicts:dicts, type:self[api].type, tt:[
//                             {pos:'', acceptation:'查询不到结果'}
//                         ]});
//                 }
//             },
//             error:function (response) {
//                 var dicts = [];
//                 for (var key in API) {
//                     if (API[key].type === self[api].type) {
//                         dicts.push(key);
//                     }
//                 }
//                 dicts.splice(dicts.indexOf(api), 1);
//                 dicts.unshift(api);
//                 callback({key:word, dicts:dicts, type:self[api].type, tt:[
//                         {pos:'', acceptation:'出错了!'}
//                     ]});
//             }
//         });
//     }
//
// });