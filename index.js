#! /usr/bin/env node
'use strict';

const http = require('http');
const request = require('request');
const fs = require('fs');
const ejs = require('ejs');

const top  = fs.readFileSync('./view/top.ejs', 'utf-8');
const home = fs.readFileSync('./view/home.ejs', 'utf-8');
const user = fs.readFileSync('./view/user.ejs', 'utf-8');

// end point
const url = 'https://versatileapi.herokuapp.com/api'
const port = 8000;

// TODO: クエリを取得する
let p = "/text/all";

const now = new Date();
const content = [];
const created_at = [];


// サーバーの起動
function create_server() {
  const server = http.createServer((req, res) => {
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`)
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
  // GET method
    if(req.method === "GET"){
      switch(req.url ){
        case '/':
          res.write(ejs.render(top, {

          }));
          break;
        case '/text/all':
          res.write(ejs.render(home, {
          content: content,
          created_at: created_at
        }));
         break;
        case '/user/all':
          res.write(ejs.render(user, {
          content: content,
          created_at: created_at
          }));
         break;
        default:
         break;
       }
       res.end();

    //POST method
      } else if(req.method === "POST") {
        let rawData = "";
      
    }
  })
  .on('error', err => {
    console.error(`Server Error ${err}`);
  })
  .on('clientError', err => {
    console.error(`Client Error ${err}`);
  })

  server.listen(port, () => {
  console.info('Listening on ' + port);
})

}

// API request
switch(p){
  case "/text/all":
    API_request(p);
    break;
  case "/user/all":
    API_request(p);
    break;
  default:
    break;
}


function API_request (p) {
  request({url: url + p, json: true}, (err, res, data) => {
    // エラーチェック
    if(err !== null){
      console.error(err);
      return(false);
    }
    /*-------------------------------------------------
    in data object
  
    { id: 'foo123456',
      _created_at: '2021-07-17T13:21:00.736+00:00',
      _updated_at: '2021-07-17T13:21:00.736+00:00',
      _user_id: 'foo123',
      text: 'hogehoge' },
  
    -------------------------------------------------  */
    console.info("statuscode:", res && res.statusCode);
    data.forEach((value) => {
      created_at.push(time_UTCtoJP(value._created_at));
      content.push(value);
    })
  });
  create_server();
} 


// UTC から 日本時間 にする
function time_UTCtoJP (str_date) {
  if(str_date === undefined ){
    return "";
  }
  const res = str_date.replace(/[^0-9]/g, '');
  const year = res.slice(0,4);
  const month = res.slice(4,6);
  const min = res.slice(10,12);
  const arr = to_hour(res.slice(6,8), res.slice(8,10));
  
  // int to String
  const now_date = `${year}年${month}月${arr[0]}日 ${arr[1]}時${min}分`
  
  function to_hour(day, hour) {
    let bef_day =  Number(day);
    let bef_hour = Number(hour) + 9;
    if(bef_hour >= 24){
      bef_hour -= 24;
      bef_day += 1;
    }
  
    return [bef_day, bef_hour];  
  }
  return now_date;
}