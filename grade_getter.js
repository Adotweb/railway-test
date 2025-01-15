const puppeteer = require("puppeteer");



const get_grades = (async (username, password) => {


	let browser
	
	let t1 = performance.now()

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

	await page.setRequestInterception(true);


	page.on("request", (request) => {
		const resourceType = request.resourceType();


		if(["stylesheet", "font", "image", "script", "other", "manifest"].includes(resourceType)){
			request.abort()
		}else{
			request.continue()
		}
	})

	await page.goto("https://kaschuso.so.ch/ksso", {waitUntil : "domcontentloaded"});;

	await page.waitForSelector("input.form-control");

	await page.type("input.form-control", username);
	await page.type("input#password", password);


	await page.click("button.btn.btn-primary");


	let t2 = performance.now()



	await page.waitForSelector("#menu21311", {timeout : 10_000});

	let anchor_tag = await page.$("#menu21311");

	let anchor = await anchor_tag.evaluate(anchor => anchor.href);


	let t3 = performance.now()

	await page.goto(anchor);

	await page.waitForSelector("#sus-uebersicht-spinner")

	let html = await page.content();
	browser.close()

	let t4 = performance.now()



	return html
})

module.exports = {
	get_grades
}
