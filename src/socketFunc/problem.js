const { getUser } = require("../utils/Users");
const puppeteer = require('puppeteer');
module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("codeforces-problem",async(link)=>{
      let selectorDiv = `<div>Please input correct url</div>`
      let problem;
      if(link.includes("codeforces")){
        problem = await codeforces(link);
      }else{
        problem = selectorDiv;
      }
      const user = getUser(socket.id)
      console.log(user)
      io.to(user.room).emit('problem',problem);
    })
  });
};

async function codeforces(URL){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL);
  const text = await page.evaluate(function(){
    return document.querySelector(`#pageContent > div.problemindexholder > div.ttypography`)
    .outerHTML
  })
  await browser.close();

  return text;
}
