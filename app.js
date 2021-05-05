const express = require('express');
const puppeteer = require('puppeteer');
const rp = require('request-promise');

const app = express();


app.get('/image', async (req, res) => {
    let browser = null;

    try {
        const proxy = await rp({
            url: 'http://lumtest.com/myip.json',
            proxy: 'http://lum-customer-c_163ae7db-zone-zone1:xm11ddbc7bo6@zproxy.lum-superproxy.io:22225'
        });
        console.log(proxy);
        const proxyJson = JSON.parse(proxy);
        const proxyAddress = 'http://' + proxyJson.ip + ':' + proxyJson['asn']['asnum'];
        browser = await puppeteer.launch({
            headless : false ,
           // args: ['--proxy-server=']
        });
        const page = await browser.newPage();

        await page.goto('https://www.zomato.com/bhopal/twist-of-tadka-hoshangabad-road');
        const screenshot = await page.evaluate(() => document.querySelector('*').outerHTML);

        res.end(screenshot, 'binary');
    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            res.status(400).send(error.message);
        }
    } finally {
        if (browser) {
            browser.close();
        }
    }
});

app.listen(8080, () => console.log('Listening on PORT: 8080'));