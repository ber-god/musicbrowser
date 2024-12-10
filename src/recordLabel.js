import '../styles/style.css'
import { fetchWikidata, fetchDbpedia } from './utils/SparqlEndpoints.js'

const searchRecordLabelQuery = (label, limit = 100) => {
    return `SELECT DISTINCT ?label ?nameLabel (MAX(?followers) as ?maxFoll) 
        WHERE {
          ?label wdt:P31 wd:Q18127; rdfs:label ?name; wdt:P8687 ?followers
          FILTER(LANG(?name) = "fr")
          FILTER(CONTAINS(LCASE(?name), "${label}")).
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". }
        }
        GROUP BY ?label ?nameLabel
        ORDER BY DESC(?maxFoll)
        LIMIT ${limit}`;
}

const getRecordLabelDescriptionQuery = (labelUri, limit = 100) => {
    return `SELECT DISTINCT ?s ?desc ?link 
        WHERE {
            ?s owl:sameAs ?link; dbo:abstract ?desc .
            FILTER(?link = <${labelUri}>)
            FILTER(LANG(?desc) = "fr")
        } 
        LIMIT ${limit}`;
}



var results = [];
fetchWikidata(searchRecordLabelQuery("atlantic")).then((data) => {
    results = data;
    console.log("Wikidata", results);
}).then(() => {
    fetchDbpedia(getRecordLabelDescriptionQuery(results[0]["label"])).then((data) => {
        console.log("Dbpedia", data);
    });
});




console.log(getRecordLabelDescriptionQuery("atlantic"));

