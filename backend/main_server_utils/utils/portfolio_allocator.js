class PortfolioAllocator {
  constructor() {
    this.PORTFOLIO_MAP = {
      "Conservative": {
        "Low Risk": 70,
        "Medium Risk": 25,
        "High Risk": 5
      },
      "Moderate": {
        "Low Risk": 40,
        "Medium Risk": 40,
        "High Risk": 20
      },
      "Aggressive": {
        "Low Risk": 20,
        "Medium Risk": 40,
        "High Risk": 40
      }
    };

    this.ASSET_MAP = {
      "Low Risk": ["FD/RD", "Debt Funds"],
      "Medium Risk": ["Index Funds", "Equity SIP"],
      "High Risk": ["Smallcases", "Crypto"]
    };
  }

  getAllocation(riskProfile) {
    const allocation = this.PORTFOLIO_MAP[riskProfile] || {};
    const detailed = {};

    for (const [riskLevel, pct] of Object.entries(allocation)) {
      detailed[riskLevel] = {
        allocation_pct: pct,
        instruments: this.ASSET_MAP[riskLevel]
      };
    }

    return detailed;
  }
}

module.exports = PortfolioAllocator;