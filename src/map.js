const config = require("./config");
const Country = require("./country");
const City = require("./city");

class Map {
  constructor(countries) {
    this.countries = [];
    this.grid = Array(config.gridSize + 1).fill().map(() => Array(config.gridSize + 1).fill());
    this.initGrid(countries);
    this.checkIfHasConnections();
  }

  simulateEuroDiffusion() {
    if (this.countries.length === 1) {
      this.countries[0].setOnlyCountry();
      return;
    }
    let full = false;
    let day = 1;
    while (!full) {
      for (let x = 0; x <= config.gridSize; x++) {
        for (let y = 0; y <= config.gridSize; y++) {
          if (this.grid[x][y] !== undefined) {
            this.grid[x][y].transferToNeighbors();
          }
        }
      }
      for (let x = 0; x <= config.gridSize; x++) {
        for (let y = 0; y <= config.gridSize; y++) {
          if (this.grid[x][y] !== undefined) {
            this.grid[x][y].finalizeBalancePerDay();
          }
        }
      }
      full = true;
      for (let county of this.countries) {
        county.checkIsComplete(day);
        if (!county.complete) {
          full = false;
        }
      }
      day++;
    }
    this.countries.sort((c1, c2) => {
      if (c1.dayOfComplete === c2.dayOfComplete) {
        return c1.name < c2.name ? -1 : 1;
      } else {
        return c1.dayOfComplete - c2.dayOfComplete;
      }
    });
  }

  initGrid(countryRows) {
    for (let countryRow of countryRows) {
      const country = new Country(countryRow.name);
      for (let x = countryRow.ll.x; x <= countryRow.ur.x; x++) {
        for (let y = countryRow.ll.y; y <= countryRow.ur.y; y++) {
          if (this.grid[x][y] !== undefined) {
            throw new Error(`Country ${this.grid[x][y].countryName} intersects with ${country.name} on x=${x}, y=${y}`);
          }
          const city = new City(country.name, countryRows, x, y);
          this.grid[x][y] = city;
          country.addCity(city);
        }
      }
      this.countries.push(country);
    }
    for (let row of this.grid) {
      for (let city of row) {
        if (city !== undefined) {
          const neighborsList = this.getNeighbors(city.x, city.y);
          city.setNeighbors(neighborsList);
        }
      }
    }
  }

  getNeighbors(x, y) {
    const neighbors = [];
    if (this.grid[x][y + 1] !== undefined) {
      neighbors.push(this.grid[x][y + 1]);
    }
    if (this.grid[x][y - 1] !== undefined) {
      neighbors.push(this.grid[x][y - 1]);
    }
    if (this.grid[x + 1][y] !== undefined) {
      neighbors.push(this.grid[x + 1][y]);
    }
    if (this.grid[x - 1][y] !== undefined) {
      neighbors.push(this.grid[x - 1][y]);
    }
    return neighbors;
  }

  checkIfHasConnections() {
    if (this.countries.length <= 1) {
      return;
    }
    for (let country of this.countries) {
      if (!country.hasAdjacentCountry()) {
        throw new Error(`${country.name} has no adjacent country!`);
      }
    }
  }
}

module.exports = Map;
