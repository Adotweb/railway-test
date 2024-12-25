const puppeteer = require("puppeteer");



const get_grades = (async (username, password) => {


	let browser
	
	try{
	browser = await puppeteer.launch({
		 args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
	}catch(e){
		return {
			error:e
		}
	}


	let page = await browser.newPage();

	await page.goto("https://kaschuso.so.ch/ksso", {waitUntil : "domcontentloaded"});;

	await page.waitForSelector("input.form-control");

	await page.type("input.form-control", username);
	await page.type("input#password", password);


	await page.click("button.btn.btn-primary");

	await page.waitForSelector("#menu21311", {timeout : 30_000});



	await page.click("#menu21311");

	await page.waitForSelector("#sus-uebersicht-spinner")


	let html = await page.content();



	browser.close()
	
	return html
})

module.exports = {
	get_grades
}
