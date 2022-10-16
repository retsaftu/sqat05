const { Builder, By, Key, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const fs = require("fs");//file stream
const log4js = require("log4js");

require('dotenv').config();//for read .env file

let url = `https://github.com/retsaftu/sqat05`

let signInHrefXpath = `/html/body/div[1]/header/div/div[2]/div/div/div[2]/a`
let emailXpath = `//*[@id="login_field"]`;
let passwordXpath = `//*[@id="password"]`;

let continueXpath = `//*[@id="login"]/div[4]/form/div/input[11]`
let addFilesXpath = `//*[@id="repo-content-pjax-container"]/div/div/div[3]/div[1]/div[2]/details/summary`
let createNewFileXpath = `//*[@id="repo-content-pjax-container"]/div/div/div[3]/div[1]/div[2]/details/div/ul/li[3]/form/button`
let newFileNameXpath = `//*[@id="repo-content-pjax-container"]/div/div/form[2]/div/div[1]/span/input`
let fileContentXpath = `//*[@id="code-editor"]/div/pre/span`;

let commitNameXpath = `//*[@id="commit-summary-input"]`
let commitAdd = `add new file ${process.env.NEW_FILE_NAME} from ${process.env.FROM_FILE_NAME}`
let commitAdd_M = `BTW this file ${process.env.NEW_FILE_NAME} add from this script ${process.env.FROM_FILE_NAME}`
let commit_M = `//*[@id="commit-description-textarea"]`
let commitNewFileXpath = `//*[@id="submit-file"]`

//declarate user from .env file
let user = {
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD
}
async function start() {
      const logger = log4js.getLogger();
      logger.level = "debug";
  
      const options = new chrome.Options()
      
          options.addArguments('--disable-dev-shm-usage')
      options.addArguments('--no-sandbox')
      options.addArguments("--window-size=1100,1000")//set window size
  
      const driver = new Builder()
              .forBrowser('chrome')
              .setChromeOptions(options)
              .build()
          const fromFile = await readFile();//read file
      // console.log(`fromFile`, fromFile);
  
      try {
                logger.info("START");
        
                await driver.get(url)//get github repo
                await driver.sleep(3000)//await 
                const signInTest = await signIn(driver)
                        if (!signInTest == "OK") {
                          
                                      logger.error("signInTest error");
                                      return
                        }
                logger.info("signInTest SUCCES");
        
                const routeFileTest = await routeFile(driver)
                        if (!routeFileTest == "OK") {
                                      logger.error("signInTest error");
                          
                                      return
                        }
                logger.info("routeFileTest SUCCES");
        
                const addCommitTest = await addCommit(driver, fromFile)
                        if (!addCommitTest == "OK") {
                                      logger.error("signInTest error");
                          
                                      return
                        }
                logger.info("addCommitTest SUCCES");
        
        
        
        
        
                await driver.sleep(5000)
                await driver.quit()//close 
                logger.info("SUCCES");
        
      } catch (error) {
                await driver.quit()
        
                console.log(`error`, error);
        
      }
  
}
async function readFile() {//read file
  
      let fileContent = await fs.readFileSync(process.env.FROM_FILE_NAME, "utf8");
      // console.log(fileContent);
      return fileContent
}
async function signIn(driver) {
      try {
                await driver.findElement(By.xpath(signInHrefXpath)).click()//got to login page
                await driver.sleep(3000)
        
                await driver.findElement(By.xpath(emailXpath)).sendKeys(user.email);//send email
        
                await driver.findElement(By.xpath(passwordXpath)).sendKeys(user.password);//send password
                // await driver.findElement(By.xpath(finishXpath)).click();
                await driver.sleep(3000)
                await driver.findElement(By.xpath(continueXpath)).click()//submit form
                await driver.sleep(3000)
                return "OK"
      } catch (error) {
                return "ERROR"
        
      }
  
}
async function routeFile(driver) {
      await driver.findElement(By.xpath(addFilesXpath)).click()//click to dropdown
      await driver.sleep(1000)
      await driver.findElement(By.xpath(createNewFileXpath)).click()//route to add file
      await driver.sleep(3000)
}

async function addCommit(driver, fromFile) {
      await driver.findElement(By.xpath(newFileNameXpath)).sendKeys(process.env.NEW_FILE_NAME);//send file name
      await driver.sleep(3000)
      await driver.findElement(By.xpath(fileContentXpath)).click();
      await driver.sleep(500)
  
      await driver.findElement(By.xpath(fileContentXpath)).sendKeys(fromFile);//add file content from file that we read
      await driver.sleep(1000)
  
      await driver.findElement(By.xpath(commitNameXpath)).sendKeys(commitAdd);//add commit message
      await driver.findElement(By.xpath(commit_M)).sendKeys(commitAdd_M);//add description
      await driver.sleep(5000)
  
      await driver.findElement(By.xpath(commitNewFileXpath)).click();//push
  
  
}
start()
// readFile()
