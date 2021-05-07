const browserObject = require('../utils/browser');
const scraperController = require('../utils/pageController');

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();
let url = 'https://www.zomato.com/bhopal/rice-bowl-thai-chinese-habib-ganj';

// Pass the browser instance to the scraper controller
async function intiateScrape(browserInstance,url){
    let scrapedJson = await scraperController(browserInstance, url);
    console.log("scrapedJson", JSON.stringify(scrapedJson, null, '\t'));
}

intiateScrape(browserInstance,url) ;
