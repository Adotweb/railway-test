const express = require('express');
const puppeteer = require('puppeteer');
const fs = require("fs")
const app = express();
const PORT = process.env.PORT || 8080;

const { get_grades } = require("./grade_getter.js")
const { parse_grades } = require("./grade_parser.js")

app.use(express.json());

app.post("/grades", async (req, res) => {
	
	try{
		
		let t1 = performance.now()
		const { username, password } = req.body;
		let html = await get_grades(username, password);

		fs.writeFileSync(__dirname + "/html.html", html, "utf8")

		let parsed = parse_grades(html);
		let t2 = performance.now();

		res.send({
			success : true,
			took : t2 - t1,
			grades : parsed
		})
	}catch(e){
		

		console.log(e)
		res.send({
			success : false,
			error : JSON.stringify(e)
		})
	}

})


app.get('/scrape', async (req, res) => {
  const url = req.query.url || 'https://example.com';

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const html = await page.content();
    await browser.close();

    res.send(html);
  } catch (error) {
    console.error('Scraping Error:', error);
    res.status(500).send('Error occurred while scraping');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

