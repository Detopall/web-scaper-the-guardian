"use strict";

// this file will scrape all article titles and links from The Guardian
// this output will be placed in the file: "all-articles-scraped.txt"

const PORT = 8000;
const URL = "https://www.theguardian.com/uk";
const AXIOS = require("axios");
const CHEERIO = require("cheerio");
const EXPRESS = require("express");
const FS = require("fs");


AXIOS(URL)
	.then(response => {
		const $html = response.data;
		const $ = CHEERIO.load($html);
		const articles = [];
		$('.fc-item__title', $html).each(function() {
			const tile = removeSpacing($(this).text());
			const link = removeSpacing($(this).find("a").attr("href"));
			articles.push({
				tile, link
			});
		});
		console.log(articles);
		displayArticlesInFile(articles);
	}).catch(err => console.error(err));

const app = EXPRESS().listen(PORT, ()=> {
	console.log(`server running ${PORT}`);
});

function removeSpacing(article){
	return article.replace(/(\r\n|\n|\r)/gm, "").trim();
}


function displayArticlesInFile(articles){
	FS.writeFile("all-articles-scraped.txt", JSON.stringify(articles), err => {
		if (err){
			console.error(err);
			return;
		}
	})
}