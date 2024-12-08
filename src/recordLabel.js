import './style.css'

const wikidataUrl = "https://query.wikidata.org/sparql";

const searchRecordLabelQuery = (label, limit = 100) => {
    return `SELECT DISTINCT ?label ?nameLabel (MAX(?followers) as ?maxFoll) 
        {
          ?label wdt:P31 wd:Q18127; rdfs:label ?name; wdt:P8687 ?followers
          FILTER(LANG(?name) = "fr")
          FILTER(CONTAINS(LCASE(?name), "${label}")).
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". }
        }
        GROUP BY ?label ?nameLabel
        ORDER BY DESC(?maxFoll)
        LIMIT ${limit}`;
}

async function fetchWikidata(label) {
    const url = wikidataUrl + "?query=" + searchRecordLabelQuery(label);
    const headers = {
        "Accept": "application/sparql-results+json", // Request JSON results
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function parseWikidata(response) {
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
var results = [];
fetchWikidata("atlantic").then((data) => {
    console.log(data);
    parseWikidata(data).then((parsedData) => {
        results = parsedData;
    });
}).then(() => {
    console.log(results);
});

const searchRecordLabel = `select distinct ?s ?desc ?link where {
?s owl:sameAs ?link; dbo:abstract ?desc
FILTER(?link = <http://www.wikidata.org/entity/Q67030918>)
FILTER(LANG(?desc) = "fr")
} LIMIT 100`;