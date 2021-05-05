const pageScraper = require('./pageScraper');
async function scrapeAll(browserInstance,url) {
    let browser;
    let scrapedJson ;
    try {
        browser = await browserInstance;
        scrapedJson = await pageScraper.scraper(browser,url);
    } catch (err) {
        console.log("Could not resolve the browser instance => ", err);
        console.log("Retrying 1 more time");
        scrapedJson = await pageScraper.scraper(browser,url);
    } finally {
        await browser.close();
        return scrapedJson ;
    }
}

module.exports = (browserInstance,url) => scrapeAll(browserInstance,url)