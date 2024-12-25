const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;


const { get_grades } = require("./grade_getter")
const { parse_grades } = require("./grade_parser")

app.use(express.json())

app.post("/grades", async (req, res ) => {

	try{
		
		let time1 = performance.now();
	
		const {username, password} = req.body

		let html = await get_grades(username, password)


		let parsed = parse_grades(html);


		let time2 = performance.now();


		res.send({
			grades : parsed,
			took : time2 - time1
		})
	}catch(e){
		res.send({
			error : e
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

