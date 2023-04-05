const fs = require("fs");
const config = require("./config");

function readCasesFromFile() {
  const cases = [];
  const lines = getLines(config.inputPath);
  let lineIterator = 0;
  let caseIterator = 0;
  while (lineIterator < lines.length) {
    const countriesCount = +lines[lineIterator];
    if (countriesCount === 0) {
      return cases;
    }
    if (countriesCount > config.countriesLimit) {
      throw new Error("Invalid country number");
    }
    lineIterator++;
    const countriesList = [];
    for (let i = 0; i < countriesCount; i++) {
      const gotCountry = getCountry(lines[lineIterator]);
      countriesList.push(gotCountry);
      lineIterator++;
    }
    caseIterator++;
    cases.push(countriesList);
  }
  return cases;
}

function getLines(filepath) {
  const file = fs.readFileSync(filepath, "utf8");
  return file.toString().split("\n");
}

function getCountry(line) {
  const data = line.split(' ');
  if (data.length !== 5) {
    throw new Error("Wrong data structure, unable to get country");
  }
  for (let i = 1; i< 5; i++) {
    if ((+data[i] < 1 ) || (+data[i] > 10)) {
      throw new Error(`Invalid country coords: ${data[i]}`);
    }
  }
  const country = {
    name: data[0],
    ll: {
      x: +data[1],
      y: +data[2],
    },
    ur: {
      x: +data[3],
      y: +data[4],
    },
  };
  return country
}

module.exports = readCasesFromFile;