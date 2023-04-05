const fs = require('fs');
const readCasesFromFile = require("./input");
const Map = require("./map");
const config = require("./config");

function main() {
  const cases = readCasesFromFile();
  let resultStr = "";

  for (let i = 0; i < cases.length; i++) {
    resultStr += `Case Number ${i + 1}\n`
    const map = new Map(cases[i]);
    map.simulateEuroDiffusion();
    for (let country of map.countries) {
      resultStr += `${country.name} ${country.dayOfComplete}\n`;
    }
  }
  const stream = fs.createWriteStream(config.outputPath);
  stream.once('open', function() {
    stream.write(resultStr);
    stream.end();
    console.log(`Written to output file ${config.outputPath}`);
  });
}

main();