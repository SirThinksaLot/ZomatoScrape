const browserObject = require('./browser');
const scraperController = require('./pageController');

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();
let url = 'https://www.zomato.com/bhopal/dominos-pizza-4-gulmohar-colony';

// Pass the browser instance to the scraper controller
let scrapedJson = scraperController(browserInstance,url) ;
console.log("scrapedJson",scrapedJson) ;