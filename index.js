const request = require("request");
const cheerio = require("cheerio");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {

	let proxy 	= [];
	let data	= [];

	request("https://sslproxies.org/", function(error, response, html) {

		if (!error && response.statusCode == 200) {
			const $ = cheerio.load(html);

			const elem = $('table:nth-child(1)');

			let tr = $('tr').each((i, elem) =>{
				let ip_ = $(elem).find('td:nth-child(1)').text();
				let port_ = $(elem).find('td:nth-child(2)').text();
				let country_ = $(elem).find('td:nth-child(3)').text();
				let type_ = $(elem).find('td:nth-child(5)').text();
				let https_ = $(elem).find('td:nth-child(7)').text();

				if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip_)){ 
					proxy.push({
						ip: ip_,
						port: port_,
						country: country_,
						type: type_,
						https: https_
					});
				}
			});
			
			let random_number = Math.floor(Math.random() * 100);

			res.json(proxy[random_number]);
		} else {
			console.log("Error loading proxy, please try again");
		}
	});

});

app.listen(3100, () => {
	console.log('Server is running (Port: 3100)...');
});