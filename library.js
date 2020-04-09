const {Builder, By, until} = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

function getNewestFile(dir, regexp) {
    newest = null
    files = fs.readdirSync(dir)
    one_matched = 0

    for (i = 0; i < files.length; i++) {

        if (regexp.test(files[i]) == false)
            continue
        else if (one_matched == 0) {
            newest = files[i]
            one_matched = 1
            continue
        }

        f1_time = fs.statSync(files[i]).mtime.getTime()
        f2_time = fs.statSync(newest).mtime.getTime()
        if (f1_time > f2_time)
            newest[i] = files[i]  
    }

    if (newest != null)
        return (dir + newest)
    return null
}

function getLatestFile(dirpath) {

    // Check if dirpath exist or not right here
  
    let latest;
  
    const files = fs.readdirSync(dirpath);
    files.forEach(filename => {
      // Get the stat
      const stat = fs.lstatSync(path.join(dirpath, filename));
      // Pass if it is a directory
      if (stat.isDirectory())
        return;
  
      // latest default to first file
      if (!latest) {
        latest = {filename, mtime: stat.mtime};
        return;
      }
      // update latest if mtime is greater than the current latest
      if (stat.mtime > latest.mtime) {
        latest.filename = filename;
        latest.mtime = stat.mtime;
      }
    });
  
    return dirpath + latest.filename;
  }

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
            driver.executeScript('$("#org_filter").val("4")');
            driver.executeScript('load_report();'); 
        });

        await driver.executeScript('download_report_transfer();');


        setTimeout(function(){
            let downloaded_file = getLatestFile("C:\\Users\\Murad\\Downloads\\");
            fs.rename(downloaded_file, "C:\\Users\\Murad\\Downloads\\newfile.csv", function(err){
                if ( err ) console.log('ERROR: ' + err);
            })
        }, 10*1000);

         

        await driver.wait(until.titleIs('nehalist.io'));
    } finally {
        //await driver.quit();
    }
})();


