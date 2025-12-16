import fs from 'fs';
import {initialData, countries} from './mapData.js';
import countryPath from './countryPath.json' with {type: 'json'};
import countriesData from './countriesData.json' with {type: 'json'};

function addPathTo(country) {
    country.path = countryPath[country.code];
    return country;
}

function refactorData() {
    const refactoredData = countriesData.map(country => addPathTo(country));

    fs.writeFileSync('./refactoredData.json', JSON.stringify(refactoredData, null, 2), 'utf-8');
}

refactorData();

// ==================================

function pathsExtractor() {
    const data = {};
    countries.forEach(country => {
        data[country.code] = country.path;
    });

    fs.writeFileSync('./countryPath.json', JSON.stringify(data, null, 2), 'utf-8');
}

// pathsExtractor();

// ==================================

function modifyData({code, name, capital, props}) {
    return {
        code,
        name,
        capital,
        population: props.population,
        area: props.area,
        avgAge: props.averagePopulationAge,
        netSpeed: props.internetSpeed
    }
}

function propsExtractor() {
    const data = initialData.map(c => modifyData(c));

    fs.writeFileSync('./countriesData.json', JSON.stringify(data, null, 2), 'utf-8');
}

// propsExtractor();