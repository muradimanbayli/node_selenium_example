const {Builder, By, until} = require('selenium-webdriver');

(async function example() {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://fleetsmarts.net/index.php/login');
        await driver.executeScript("document.getElementById('username').setAttribute('value', 'garrett')");
        await driver.executeScript("document.getElementById('password').setAttribute('value', 'retret13')");
        
        await driver.findElement(By.id('sign_in_button')).click();

        await driver.findElement(By.xpath('/html/body/div[2]/div[1]/div[2]/div[2]/a[3]')).click();
        
        await driver.wait(until.elementLocated(By.id('org_filter')), 5 * 1000).then(el => {
            driver.executeScript("document.getElementById('after_filter').setAttribute('value', '03/03/2020')");
            driver.executeScript("document.getElementById('before_filter').setAttribute('value', '03/03/2020')"); 
            driver.executeScript('document.querySelector("#org_filter > option:nth-child(92)").selected=true');
            driver.executeScript('load_report();'); 
        });

        driver.executeScript('download_report_transfer();');

        await driver.wait(until.titleIs('nehalist.io'));
    } finally {
        //await driver.quit();
    }
})();