const wikidataEndpoint = "https://query.wikidata.org/sparql";
const dbpediaEndpoint = "http://dbpedia.org/sparql";

//TODO: Check what happens if the results are empty

async function parseResponse(response) {
    const results = [];
    const vars = response.head.vars;
    response.results.bindings.forEach((result) => {
        const obj = {};
        vars.forEach((v) => {
            obj[v] = result[v].value;
        });
        results.push(obj);
    });
    return results;
}

async function fetchWikidata(query) {
    const url = `${wikidataEndpoint}?query=${encodeURIComponent(query)}`;
    const headers = {
        "Accept": "application/sparql-results+json", // Request JSON results
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        return parseResponse(data); // Return the results
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function fetchDbpedia(query) {
    const url = `${dbpediaEndpoint}?query=${encodeURIComponent(query)}&format=json`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/sparql-results+json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return parseResponse(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

export { fetchWikidata, fetchDbpedia };