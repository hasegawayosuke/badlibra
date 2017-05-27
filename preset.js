"use strict";

const sqlite3 = require("sqlite3");

const items1 = [
    "今日から学ぶJavaScript", "Rubyではじめる効率化",
    "よくわかるC言語 第2版", "情報セキュリティ入門",
    "ゼロからのプログラミング", "JavaScript徹底入門",
    "厳選 セキュリティ対策集", "目からウロコのWindows"
];
const items2 = [
    "やせるおかず50選", "成功ダイエット",
    "体をつくる生活習慣", "簡単に作る毎晩のおかず",
    "家庭の健康","健康のための習慣作り",
    "やさしい野菜づくり","国内旅行決定版",
    "今年買う自転車","ペットと過ごす宿",
    "温泉100選","習慣化する貯金術","家庭の節税",
    "転職で変える人生","1冊まるごと北海道",
    "恋に効く菓子作り","だからあなたは嫌われる",
    "暮らしを豊かにする家具","占い入門","明日の旅",
    "老いても健康","お金の溜まる家","名探偵と密室殺人",
    "水の流れのように","本当においしいコーヒーを知っていますか",
    "大きな家の小さな殺人", "押忍！空手道！", 
    "恋の実るプログラミング","今の職場で満足ですか?",
    "失敗しない夕食選び", "人に好かれる眼鏡選び",
    "楽しい食事改善", "犬と過ごす週末",
];

const users = [ "田中", "鈴木", "山下" ];

function row( title, user ){
    var code = Math.floor(Math.random()*1000);
    var d1 = new Date((new Date("2015/01/01")).getTime()+Math.random() * 1000 * 60 * 60 * 24 * 700);
    var d2 = new Date(d1.getTime() + (Math.random() * 1000 * 60 * 60 * 24 )* 14);
    d1 = d1.toISOString().replace(/T.*/,"");
    d2 = d2.toISOString().replace(/T.*/,"");

    return {
        $title : title,
        $code : code,
        $user : user,
        $start : d1,
        $end : d2
    };
}

function init(){
    let db = new sqlite3.Database(`${__dirname}/history.db`, (err) => {
        if (err) {
            throw new Error(err);
        }
        db.run( "create table history (title text, code integer, user text, start text, end text);", ()=>{
            const  sql = "INSERT INTO history VALUES($title, $code, $user, $start, $end);";
            let i, r;
            let items = [];
            for( i = 0; i < items1.length; i++ ){
                r = row( items1[ i ], "長谷川" );
                items.push( r );
            }
            for( i = 0; i < items2.length; i++ ){
                r = row( items2[ i ], users[ Math.floor(Math.random()*3)] );
                items.push( r );
            }
            items.sort( (item1, item2)=>{
                if( item1.$start < item2.$start ) return -1;
                else if( item1.$start > item2.$start ) return 1;
                else return 0;
            });
            items.forEach( item=>{
                console.log( item );
                db.run( sql, item );
            } );
        });
    });
}
init();

