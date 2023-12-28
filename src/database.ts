import Dexie, {Table} from "dexie";

export interface Word {
    id?: number,
    name: string,
    explain: Explain[],
    ps: string,
    pron: string,
}

export interface Explain {
    part: string,
    means: string[]
}

class WordDatabase extends Dexie {
    public words!: Table<Word, number>; // id is number in this case

    public constructor() {
        super("FriendDatabase");
        this.version(1).stores({
            words: "++id,name,explain,ps,pron"
        });
    }
}

const db = new WordDatabase();

export const save = async (word: Word) => {
   await db.words.add(word).catch(e => console.log(`save failure ${e}`))
}

export const del = async (word: Word) => {
    if (word.id) {
        db.words.delete(word.id).catch(e => console.log(`delete failure ${e}`))
    } else {
        console.log("delete, word id is nil")
    }
}

export const getAll = async () => {
   return db.words.toArray()
}