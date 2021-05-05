const scraperObject = {
    url1: 'https://www.zomato.com/bhopal/dominos-pizza-4-gulmohar-colony',
    async scraper(browser,url) {
        if(!url)
        url = this.url1 ;
        let page = await browser.newPage();
        await page.authenticate({
            username: 'lum-customer-c_163ae7db-zone-res-country-in',
            password: 'mms8cciz0avv'
        });
        console.log(`Navigating to ${url}...`);
        await page.goto(url);
        await page.click('#TabLink__0') ;

        let responseObject = {} ;

        let parentHandle = await page.$('.sc-1mo3ldo-0') ;
        let [overviewTab] = await parentHandle.$x('./section[4]') ;
        responseObject['about_this_place'] = await getAboutThisPlaceData(overviewTab) ;
        responseObject['menu'] = {};
        responseObject['menu']['allMenuLink'] = await menuLinks(overviewTab);
        responseObject['menu']['menuImgLink'] = await getMenuImgLink(overviewTab);
        responseObject['menu']['menuPages'] = await getMenuPagesLength(overviewTab);

        let cuisineData = await getCuisineData(overviewTab) ;
        responseObject['cuisine'] = cuisineData.cuisine ;
        responseObject['cuisineString'] = cuisineData.cuisineString ;

        responseObject['cfts'] = await averageCostData(overviewTab) ;
        responseObject['highlights'] = await moreInfoData(overviewTab);
        responseObject['contact'] = {} ;
        responseObject['contact']['phoneDetails'] = await getContactDetails(overviewTab);
        responseObject['contact']['address'] = await getAddressString(overviewTab);
        console.log(responseObject);
        return responseObject;

        async function getAboutThisPlaceData(overviewTab){
            let aboutThisPlaceDivs = await overviewTab.$x('./section[1]/section[1]/article[1]/section[1]/section[1]/section[1]/section');
            let aboutThisPlaceArray = [];
            for (let i = 0; i < aboutThisPlaceDivs.length; i++) {
                let [individualPTag] = await aboutThisPlaceDivs[i].$x('./section[1]/p[2]');
                let individualPTagValue = await page.evaluate(el => el.textContent, individualPTag);
                aboutThisPlaceArray.push(individualPTagValue);
            }
            return aboutThisPlaceArray ;
        }
        
        async function menuLinks(overviewTab){
            let [menuDiv] = await overviewTab.$x('./section[1]/section[1]/article[1]/section[1]/section[2]');
            let [seeAllMenuElement] = await menuDiv.$x('./div/a');
            let seeAllMenuLink = await page.evaluate(linkElem => linkElem.getAttribute('href'), seeAllMenuElement);
            console.log('seeAllMenuLink=>', seeAllMenuLink);
            return seeAllMenuLink
        }

        async function getMenuImgLink(overviewTab){
            let [menuDiv] = await overviewTab.$x('./section[1]/section[1]/article[1]/section[1]/section[2]');
            let [menuImgElement] = await menuDiv.$x('./section[1]/div[1]/section[1]/section[1]/div[1]/div[3]/img');
            let menuImgLink = await page.evaluate(linkElem => linkElem.getAttribute('src'), menuImgElement);
            console.log('menuImgLink=>', menuImgLink);
            return menuImgLink ;
        }

        async function getMenuPagesLength(overviewTab){
            let [menuDiv] = await overviewTab.$x('./section[1]/section[1]/article[1]/section[1]/section[2]');
            let [noOfMenuPagesElement] = await menuDiv.$x('./section[1]/div[1]/section[1]/section[1]/div[1]/p[1]');
            let noOfMenuPagesValue = await page.evaluate(el => el.textContent, noOfMenuPagesElement);
            return noOfMenuPagesValue ;
        }
        async function getCuisineData(overviewTab){
            let cuisinesBoxes = await overviewTab.$x('./section[1]/section[1]/article[1]/section[1]/section[3]/a');
            let cuisinesString = '';
            let cuisines = [];
            for (let i = 0; i < cuisinesBoxes.length; i++) {
                let cuisinesBoxesLinks = await page.evaluate(el => el.getAttribute('href'), cuisinesBoxes[i]);
                let cuisinesBoxesValue = await page.evaluate(el => el.textContent, cuisinesBoxes[i]);
                cuisines.push(cuisinesBoxesValue);

                if (cuisinesString === '')
                    cuisinesString = cuisinesString + cuisinesBoxesValue
                else
                    cuisinesString = cuisinesString + ',' + cuisinesBoxesValue;

            };
            return {
                cuisine: cuisines,
                cuisineString: cuisinesString
            }
        }

        async function averageCostData(overviewTab){
            let h3TagsOfCuisineAverageCost = await overviewTab.$x('./section[1]/section[1]/article[1]/section[1]/h3');
            for (let i = 0; i < h3TagsOfCuisineAverageCost.length; i++) {
                let tagText = await page.evaluate(el => el.textContent, h3TagsOfCuisineAverageCost[i]);
                console.log(tagText);
                if (tagText.includes("Average Cost")) {
                    let [followingParaForAboveDiv1] = await h3TagsOfCuisineAverageCost[i].$x('./following-sibling::p[1]');
                    let followingParaForAboveDivText1 = await page.evaluate(element => element.textContent, followingParaForAboveDiv1);
                    console.log("Average Cost Div Texts", followingParaForAboveDivText1);

                    let [followingParaForAboveDiv2] = await h3TagsOfCuisineAverageCost[i].$x('./following-sibling::p[2]');
                    let followingParaForAboveDivText2 = await page.evaluate(element => element.textContent, followingParaForAboveDiv2);
                    console.log("Average Cost Div Texts", followingParaForAboveDivText2)

                    return {
                        tilte: followingParaForAboveDivText1,
                        subtitle: followingParaForAboveDivText2
                    }
                }
            }
        }

        async function moreInfoData(overviewTab){
            let h3TagsOfCuisineAverageCost = await overviewTab.$x('./section[1]/section[1]/article[1]/section[1]/h3');
            for (let i = 0; i < h3TagsOfCuisineAverageCost.length; i++) {
                let tagText = await page.evaluate(el => el.textContent, h3TagsOfCuisineAverageCost[i]);
                console.log(tagText);

                if (tagText.includes("More Info")) {
                    let followingMoreInfoDivs = await h3TagsOfCuisineAverageCost[i].$x('./following-sibling::div[1]/div');
                    let highlights = [];
                    for (let i = 0; i < followingMoreInfoDivs.length; i++) {
                        let xpathtext = './div/p' + '[' + (i + 1) + ']';
                        let [infoTextDiv] = await followingMoreInfoDivs[i].$x('./p');
                        let infoText = await page.evaluate(el => el.textContent, infoTextDiv);
                        console.log("More Info Div Text", infoText);
                        highlights.push({
                            type: "AVAILABLE",
                            text: infoText
                        })
                    };

                    return highlights
                }

            }
        }
        
        async function getContactDetails(overviewTab){
            let contactDetailsPTag = await overviewTab.$x('./section/article/p');
            let phoneString = '' ;
            for(let i = 0 ; i < contactDetailsPTag.length ; i++){
                let individualPTagValue = await page.evaluate(el => el.textContent, contactDetailsPTag[i]);

                if(phoneString === '')
                phoneString = phoneString + individualPTagValue ;
                else
                phoneString = phoneString + ',' + individualPTagValue ;
            };
            return {
                title : "Phone Numbers",
                phoneStr : phoneString
            }
        }

        async function getAddressString(overviewTab){
            let [addressStringPTag] = await overviewTab.$x('./section/article/section/p');
            let addressString = await page.evaluate(el=>el.textContent,addressStringPTag);
            return addressString ;
        }
    }
}

module.exports = scraperObject;