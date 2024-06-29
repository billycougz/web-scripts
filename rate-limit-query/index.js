const urlToFetch = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/22';

async function fetchWithRetry(url, batchSize = 1) {
	let successfulCalls = 0;
	while (true) {
		const fetchPromises = Array.from({ length: batchSize }, async () => {
			try {
				const response = await fetch(url);

				if (response.ok) {
					successfulCalls++;
					console.log(`Successful call #${successfulCalls}`);
				} else {
					console.error(`Failed call: HTTP status ${response.status}`);
				}
			} catch (error) {
				console.error(`Failed call: ${error.message}`);
			}
		});
		await Promise.all(fetchPromises);
	}
}

const batchSize = 100; // Set your desired batch size
fetchWithRetry(urlToFetch, batchSize)
	.then((successfulCalls) => console.log(`Total successful calls: ${successfulCalls}`))
	.catch((error) => console.error(`Error in fetchWithRetry: ${error.message}`));
