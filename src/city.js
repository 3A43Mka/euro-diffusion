const config = require("./config");
const {representativePortion} = require("./config");

class City {
  constructor(countryName, countriesList, x, y) {
    this.countryName = countryName;
    this.x = x;
    this.y = y;
    this.balance = {};
    this.balancePerDay = {};
    for (let cityData of countriesList) {
      this.balance[cityData.name] = 0;
      this.balancePerDay[cityData.name] = 0;
    }
    this.balance[countryName] = config.initialCityBalance;
    this.neighbors = [];
    this.complete = false;
  }

  setNeighbors(neighbors) {
    this.neighbors = neighbors;
  }

  transferToNeighbors() {
    for (let motif in this.balance) {
      const balanceOfMotif = this.balance[motif];
      const amountToTransfer = Math.floor(balanceOfMotif / representativePortion);
      if (amountToTransfer > 0) {
        for (let neighbor of this.neighbors) {
          this.balance[motif] -= amountToTransfer;
          neighbor.addBalanceInMotif(motif, amountToTransfer);
        }
      }
    }
  }

  addBalanceInMotif(motif, amount) {
    this.balancePerDay[motif] += amount;
  }

  finalizeBalancePerDay() {
    for (let motif in this.balancePerDay) {
      this.balance[motif] += this.balancePerDay[motif];
      this.balancePerDay[motif] = 0;
    }
    if (!this.complete) {
      for (let motif in this.balancePerDay) {
        if (this.balance[motif] === 0) {
          return;
        }
      }
      this.complete = true;
    }
  }
}

module.exports = City;