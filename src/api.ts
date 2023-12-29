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