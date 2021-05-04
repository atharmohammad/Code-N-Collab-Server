const { getUser } = require("../utils/Users");
const puppeteer = require('puppeteer');

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("codeforces-problem",async(link)=>{
      let problem;
      if(link == null || link == undefined){
        console.log('link not defined')
      }
      else if(link.includes("codeforces.com")){
        problem = await codeforces(link);
      }else if(link.includes('codechef.com')){
        problem = await codechef(link);
      }else if(link.includes('geeksforgeeks.org')){
        problem = await geeksforgeeks(link);
      }else if(link.includes("atcoder.jp")){
        problem = await atcoder(link);
      }else if(link.includes("cses.fi")){
        problem = await cses(link);
      }
      else{
        problem = giveSelectorDiv();
      }
      
      const user = getUser(socket.id)
      if(!user){
        return;
      }
      if(!problem){
        problem =  `<div className='error'>
        Please input correct url !<br/> Make sure Url is from following websites : geeksforgeeks , codeforces , codechef , atcoder,cses
        </div>`;
      }
      console.log(problem)
      io.to(user.room).emit('problem',problem);
    })
  });
};

async function codeforces(URL){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL);
  const text = await page.evaluate(async function(){
    try{
      return document.querySelector(`#pageContent > div.problemindexholder > div.ttypography`)
      .outerHTML;
    }catch(e){
      return '';
    }
  })
  await browser.close();

  return text;
}

async function codechef(URL){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL);
  const text = await page.evaluate(function(){
    try{
      return document.querySelector("#content-regions > section.content-area.small-8.columns.pl0").outerHTML
    }catch(e){
      return '';
    }
  })
  await browser.close();

  return text;
}

async function geeksforgeeks(URL){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL);
  const text = await page.evaluate(function(){
    try{
      return document.querySelector("#problems > div.problem-statement").outerHTML
    }catch(e){
      return '';
    }
  })
  await browser.close();

  return text;
}

async function atcoder(URL){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL);
  const text = await page.evaluate(function(){
    try{
      return document.querySelector("#task-statement > span > span.lang-en").outerHTML
    }catch(e){
      return '';
    }
  })
  await browser.close();

  return text;
}

async function cses(URL){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL);
  const text = await page.evaluate(function(){
    try{
      return document.querySelector("body > div.skeleton > div.content-wrapper > div.content").outerHTML

    }catch(e){
      return '';
    }
  })
  await browser.close();

  return text;
}
