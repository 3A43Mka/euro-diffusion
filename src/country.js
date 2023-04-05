class Country {
  constructor(name) {
    this.name = name;
    this.cities = [];
    this.complete = false;
    this.dayOfComplete = -1;
  }

  addCity(city) {
    this.cities.push(city);
  }

  checkIsComplete(day) {
    if (this.complete) {
      return;
    }
    for (let city of this.cities) {
      if (!city.complete) {
        return;
      }
    }
    this.complete = true;
    this.dayOfComplete = day;
  }

  hasAdjacentCountry() {
    for (let city of this.cities) {
      for (let neighbor of city.neighbors) {
        if (neighbor.countryName !== this.name) {
          return true;
        }
      }
    }
    return false;
  }

  setOnlyCountry() {
    this.complete = true;
    this.dayOfComplete = 0;
  }
}

module.exports = Country;