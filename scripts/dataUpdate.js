import fs from "fs";
// countries.json contains the same data as const in countries.js
import countries from "./countries.json" with { type: "json" };
// import euroCountries from './euroCountries.json' with {type: 'json'};
// import asiaCountries from './asiaCountries.json' with {type: 'json'};

const missCode = [];
const regionUrl = (region) => {
    return `https://countries.dev/region/${region}?fields=name%2Ccapital%2Calpha2Code%2Carea%2Cpopulation%2Cflags`;
};

function updateProp(country, newData) {
    country.name = newData.name ? newData.name : country.name;
    country.capital = newData.capital ? newData.capital : country.capital;
    country.flag = newData.flags.png;
    country.props.area = newData.area ? newData.area : country.props.area;
    country.props.population = newData.population ? newData.population : country.props.population;
}

async function getEuropeData() {
    const res = await fetch(regionUrl("europe"));
    const europe = await res.json();
    countries.forEach((country) => {
        let finded = europe.find((e) => e.alpha2Code === country.code);
        if (finded) {
            updateProp(country, finded);
        } else {
            missCode.push(country.code);
        }
    });
    // console.log("== missCode ==", missCode);
    if (missCode.length) getMissingAsia();
}

// Added some countries on the Europe-Asia border
async function getMissingAsia() {
    const res = await fetch(regionUrl("asia"));
    const asia = await res.json();
    asia.forEach((a) => {
        if (missCode.includes(a.alpha2Code)) {
            let country = countries.find((c) => a.alpha2Code === c.code);
            if (country) {
                updateProp(country, a);
            }
        }
    });
    // console.log(countries.map(el => {return {code:el.code, area: el.props.area, population: el.props.population}}));
    // console.log(countries.length);
    fs.writeFileSync('./updatedData.json', JSON.stringify(countries, null, 2), 'utf-8');
}

getEuropeData();
