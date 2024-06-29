const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const path = require('path');

const URL = '';
const SELECTOR = '';

(async () => {
	const browser = await puppeteer.launch({
		executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		headless: false,
		args: ['--start-maximized', '--disable-infobars'],
	});

	const page = await browser.newPage();
	await page.goto(URL);
	await page.waitForSelector(SELECTOR);

	const imageDetails = await page.evaluate((selector) => {
		const img = document.querySelector(selector);
		return {
			src: img.src,
			alt: img.alt,
		};
	}, SELECTOR);

	const filepath = path.resolve(__dirname, `./${getLastSegment(imageDetails.src)}`);
	await downloadImage(imageDetails.src, filepath);

	await browser.close();
})();

const downloadImage = (url, filepath) => {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(filepath);
		https
			.get(url, (response) => {
				response.pipe(file);
				file.on('finish', () => {
					file.close(resolve);
				});
			})
			.on('error', (error) => {
				fs.unlink(filepath);
				reject(error.message);
			});
	});
};

function getLastSegment(url) {
	const segments = url.replace(/\/+$/, '').split('/');
	const lastSegment = segments.pop();
	return lastSegment;
}
