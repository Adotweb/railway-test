const cheerio = require("cheerio")

function parse_grades(html){

	let $ = cheerio.load(html);



	
	let table = [...$("body").find("table.clean").map((index, element) => {
	
		let table = $(element)

		let subject = $(table.parent().parent().prev()).first("td").toString().match(/>.+</)[0].replace("<br>", "#").replace("<b>", "").replace("</b>", "");

		subject = subject.slice(1, subject.length - 1)
		
		let [kue, sub] = subject.split("#");


		let trs = [...table.find("tr").map((i, element) => {


			let tr = $(element)
			
			if(i < 2){
				return ""
			}
			return tr.text();

		})].filter(s => s!="").map(s => s.replace(/\n/g, "#").replace(/(\s)+/g, " ").trim())

		trs = trs.map(tr => {

			return tr.replaceAll(/#(\s#)+/g, "#")
		}).map(tr => {
			return tr.slice(1, tr.length - 1).trim().split("#").map(s => s.trim())
		}).map(gradeinfo => {
			
			let date, title, weight, grade;
			let isUpcoming = true;
			
			if(gradeinfo.length == 3){
				[date, title, weight] = gradeinfo;
			}
			if(gradeinfo.length == 4){
				[date, title, grade, weight] = gradeinfo;
				isUpcoming = false;
			}
			if(gradeinfo.length == 2){
				return null
			}


			return {
				date, title, weight, 
				grade : grade ? Number(grade) : grade,
				isUpcoming
			}
		}).filter(s => s!= null)
	
		return {
			subject : sub,
			kuerzel : kue,
			grades : trs
		}
	})];

	return table
}
module.exports = {
	parse_grades
}
