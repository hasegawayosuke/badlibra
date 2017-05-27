"use strict";

const fs = require("fs");
const waf = require("./waf.js");
const qs = require("querystring");
const sqlite3 = require("sqlite3");

const _user = "長谷川";

let db;
let templates;

function padLeft(s, len, padding){
    if (typeof s !== "string") s = ""+s;
    return Array(len - s.length + 1).join(padding || "0") + s;
}

function toJSTDateString( d ){
    if( d === undefined ) d = new Date();
    d = new Date( d.getTime() + 9 * 60 * 60 * 1000 );
    let s4 = function( n ){ return /([\d]{4})$/.exec( "000" + n )[ 1 ]; };
    let s2 = function( n ){ return /([\d]{2})$/.exec( "0" + n )[ 1 ]; };
    return `${s4(d.getUTCFullYear())}/${s2(1+d.getUTCMonth())}/${s2(d.getUTCDate())} ${s2(d.getUTCHours())}:${s2(d.getUTCMinutes())}:${s2(d.getUTCSeconds())}`;
}

function init () {
    db = new sqlite3.Database(`${__dirname}/history.db`, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            throw new Error(err);
        }
    });
    templates = {
        row : fs.readFileSync(`${__dirname}/tmpl/row.html`, "utf-8"),
        history : fs.readFileSync(`${__dirname}/tmpl/history.html`, "utf-8"),
        contact : fs.readFileSync(`${__dirname}/tmpl/contact.html`, "utf-8"),
        contact1 : fs.readFileSync(`${__dirname}/tmpl/contact1.html`, "utf-8"),
        contact2 : fs.readFileSync(`${__dirname}/tmpl/contact2.html`, "utf-8"),
    };
}


const handlers = [
    {
        pattern : "/",
        method : "GET",
        callback : (conn) =>{
            conn.res.redirect( "./history" );
        },
    },
    {
        pattern : "/history",
        method : "GET",
        callback : (conn) => {
            let htmlParams = {};
            let params = qs.parse(conn.location.search.substring(1));
            let q = params.q || "";
            let sql = `SELECT * FROM history WHERE title LIKE '%${q}%' AND user = '${_user}'`;
            conn.res.writeHead(200, { "Content-Type" : "text/html; charset=utf-8" });
            if (/^\d{6}$/.test(params.d)) {
                sql += ` AND start LIKE '${params.d.substr(0,4)}-${params.d.substr(4,2)}%'`;
            }
            sql += " ORDER BY start;";
            console.log( params );
            
            db.all( sql, (err,rows) => {
                let s = "";
                let html;
                try{
                    if( err ){
                        s = sql + "<br>" + err;
                    }
                    if( rows && typeof rows === "object" ){
                        for (let i = 0; i < rows.length; i++) {
                            s += waf.render(templates.row, rows[i]);
                        }
                    }
                } catch(e) {
                    console.log(e);
                    s = e;
                }
                htmlParams.table = s;
                htmlParams[ "selected" + params.d ] = "selected";
                htmlParams.q = q;
                htmlParams.user = _user;
                if (params.d) {
                    htmlParams.range = `${(params.d||"").substr(0,4)}年${(params.d||"").substr(4)}月`;
                }else{
                    htmlParams.range = `全て`;
                }
                html = waf.render(templates.history,htmlParams);
                conn.res.end(html);
            });
        },
    },
    {
        pattern : "/contact",
        method : "GET",
        callback : (conn) => {
            let htmlParams = {
                user : _user,
            };
            let html;
            
            conn.res.writeHead(200, { "Content-Type" : "text/html; charset=utf-8" });
            html = waf.render(templates.contact,htmlParams);
            conn.res.end(html);
        }
    },
    {
        pattern : "/contact",
        method : "POST",
        callback : (conn) => {
            let html;
            let htmlParams = {
                user : _user,
                time : toJSTDateString(),
            };
            conn.res.writeHead(200, { "Content-Type" : "text/html; charset=utf-8" });
            htmlParams.text = conn.body.text;
            console.log( conn.body );
            if( conn.body.send === "1" ){
                html = waf.render(templates.contact2,htmlParams);
            }else{
                html = waf.render(templates.contact1,htmlParams);
            }

            conn.res.end(html);
        }
    }
];

const wafConfig = {
    origin : undefined,
//  basic : "user:pass",
    session : false,     
    xfo : true,
    xcto : true, 
    staticFiles : [ "/static/" ],
    protectCsrf : false,
};


function main(){
    let port = ( process.argv[ 2 ] | 0 ) || process.env.PORT || 8080;
    let server = waf.createServer( wafConfig, handlers );
    console.log( "Starting httpd on port " + port );
    server.listen( port );
}

init();
main();

