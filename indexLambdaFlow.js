const browserObject = require('./browser');
const scraperController = require('./pageController');

//Start the browser and create a browser instance
// Pass the browser instance to the scraper controller

let pageScrapeHandler = async (resolve, reject, reqObj) => {
    try {
        if (!reqObj.zUrl) {
            console.error('[Z Menu Promos Handler] No z url found');
            throw ({
                type: 'Error',
                entity: 'Zomato Overview',
                message: '[Z Menu Promos Handler] No z url found'
            });
        }
        if (!reqObj.workflowId) {
            console.error('[Z Menu Promos Handler] No workflowId found');
            throw ({
                type: 'Error',
                entity: 'Z-Menu-Promos-Handler',
                message: '[Z Menu Promos Handler] No workflowId found'
            });
        }
        let browserInstance = await browserObject.startBrowser();
        let scrapedJson = await scraperController(browserInstance, reqObj.zUrl);
        resolve({
            statusCode: 200
        });

    } catch (err) {
        console.log(err);
        return reject(err);
    }
};

module.exports.handleEvent = async (event, context) => {
    return new Promise((resolve, reject) => {
        //Set to false to send the response right away when the callback executes
        context.callbackWaitsForEmptyEventLoop = false;
        console.log("[EVENT] New event received: " + JSON.stringify(event));
        if (event.Records.length > 1) {
            console.error("[EVENT] Multiple events found in same record");
        }
        let reqObj = JSON.parse(event.Records[0].body);
        try {
            await pageScrapeHandler(resolve, reject, reqObj);
        } catch (err) {
            reject(err);
        }
    });
};