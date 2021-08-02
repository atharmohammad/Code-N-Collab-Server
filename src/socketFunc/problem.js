const { getUser } = require("../utils/Users");
const puppeteer = require("puppeteer");

module.exports = function (io) {
  try {
    io.on("connection", (socket) => {
      socket.on("codeforces-problem", async (link) => {
        try {
          let problem = "";
          if (link == null || link == undefined) {
            //console.log("link not defined");
          } else if (link.includes("codeforces.com")) {
            problem = await codeforces(link);
          } else if (link.includes("codechef.com")) {
            problem = await codechef(link);
          } else if (link.includes("geeksforgeeks.org")) {
            problem = await geeksforgeeks(link);
          } else if (link.includes("atcoder.jp")) {
            problem = await atcoder(link);
          } else if (link.includes("cses.fi")) {
            problem = await cses(link);
          } else if (link.includes("codedrills.io")) {
            problem = await codeDrill(link);
          } else {
            problem = "";
          }

          const user = getUser(socket.id);
          if (!user) {
            return;
          }
          if (!problem) {
            problem = `<div className='error'>
        Please input correct url of the problem !<br/>And make sure Url is from following websites only: geeksforgeeks , codeforces , codechef , atcoder,cses, codeDrills
        </div>`;
          }
          io.to(user.room).emit("problem", problem);
        } catch (e) {
          console.log(e);
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};

async function codeforces(URL) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(URL);
    const text = await page.evaluate(async function () {
      return document.querySelector(
        `#pageContent > div.problemindexholder > div.ttypography`
      ).outerHTML;
    });
    await browser.close();
    return text;
  } catch (e) {
    return null;
  }
}

async function codechef(URL) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(URL);
    const text = await page.evaluate(function () {
      return document.querySelector(
        "#content-regions > section.content-area.small-8.columns.pl0"
      ).outerHTML;
    });
    await browser.close();

    return text;
  } catch (e) {
    return null;
  }
}

async function geeksforgeeks(URL) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(URL);
    const text = await page.evaluate(function () {
      return document.querySelector(
        "#problems > div.problem-statement"
      ).outerHTML;
    });
    await browser.close();
    return text;
  } catch {
    return null;
  }
}

async function atcoder(URL) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(URL);
    const text = await page.evaluate(function () {
      return document.querySelector(
        "#task-statement > span > span.lang-en"
      ).outerHTML;
    });
    await browser.close();
    return text;
  } catch (e) {
    return null;
  }
}

async function cses(URL) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(URL);
    const text = await page.evaluate(function () {
      return document.querySelector(
        "body > div.skeleton > div.content-wrapper > div.content"
      ).outerHTML;
    });
    await browser.close();

    return text;
  } catch (e) {
    return null;
  }
}

async function codeDrill(URL) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(URL);
    await page.waitForTimeout(5000);
    // await await page.waitForSelector('.py-5', {
    //   visible: true,
    // });
    const text = await page.evaluate(function () {
      return document.querySelector(".py-5").outerHTML;
    });
    await browser.close();

    return text;
  } catch (e) {console.log(e)}

  return "Error: Try again :( ";
}
