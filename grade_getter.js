const puppeteer = require("puppeteer");





const get_grades = (async (username, password) => {


	let browser
	
	try{
	browser = await puppeteer.launch({
		headless : true, 
		args: [
        		'--no-sandbox',
    		],
	});
	}catch(e){
		return {
			error:e
		}
	}


	let page = await browser.newPage();

	let triesLogin = false;

	await page.setRequestInterception(true);
	page.on('request', (req) => {
	
		

    		if (['stylesheet', 'font', 'media'].includes(req.resourceType())) {
        		req.abort(); // Block unnecessary resources
    		} else {
		
			if(req.url().includes("auth")){
				triesLogin = true;	
			}


        		req.continue();

    		}
	});



	await page.goto("https://kaschuso.so.ch/ksso");;

	await page.waitForSelector("input.form-control");

	await page.type("input.form-control", username);
	await page.type("input#password", password);


	await page.click("button.btn.btn-primary");

	let time1 = performance.now()
	await page.waitForSelector("#menu21311", {timeout : 8000});

	let time2 = performance.now()


	await page.click("#menu21311");

	await page.waitForSelector("#sus-uebersicht-spinner")


	let html = await page.content();



	browser.close()
	
	return html
})

module.exports = {
	get_grades
}
