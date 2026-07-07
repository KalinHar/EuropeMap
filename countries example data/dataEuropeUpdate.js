import fs from "fs";
import countries from "./countries.json" with { type: "json" };
// import euroCountries from './euroCountries.json' with {type: 'json'};
// import asiaCountries from './asiaCountries.json' with {type: 'json'};

const missCode = [];
const regionUrl = (region) => {
    return `https://countries.dev/region/${region}?fields=name%2Ccapital%2Calpha2Code%2Carea%2Cpopulation`;
};

async function getEuropeData() {
    const res = await fetch(regionUrl("europe"));
    const europe = await res.json();
    countries.forEach((country) => {
        let finded = europe.find((e) => e.alpha2Code === country.code);
        if (finded) {
            country.name = finded.name ? finded.name : country.name;
            country.capital = finded.capital ? finded.capital : country.capital;
            country.props.area = finded.area ? finded.area : country.props.area;
            country.props.population = finded.population ? finded.population : country.props.population;
        } else {
            missCode.push(country.code);
        }
    });
    // console.log("== missCode ==", missCode);
    if (missCode.length) getMissingAsia();
}

async function getMissingAsia() {
    const res = await fetch(regionUrl("asia"));
    const asia = await res.json();
    asia.forEach((a) => {
        if (missCode.includes(a.alpha2Code)) {
            let country = countries.find((c) => a.alpha2Code === c.code);
            if (country) {
                country.name = a.name ? a.name : country.name;
                country.capital = a.capital ? a.capital : country.capital;
                country.props.area = a.area ? a.area : country.props.area;
                country.props.population = a.population ? a.population : country.props.population;
            }
        }
    });
    // console.log(countries.map(el => {return {code:el.code, area: el.props.area, population: el.props.population}}));
    // console.log(countries.length);
    fs.writeFileSync('./updatedEuropeData.json', JSON.stringify(countries, null, 2), 'utf-8');
}

getEuropeData();
