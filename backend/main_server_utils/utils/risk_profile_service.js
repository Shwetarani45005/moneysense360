const RiskScorer = require('./risk_scorer.js');
const PortfolioAllocator = require('./portfolio_allocator.js');

class RiskProfileService {
  constructor() {
    this.scorer = new RiskScorer();
    this.allocator = new PortfolioAllocator();
  }

  generateProfile(form) {
    const score = this.scorer.calculateScore(form);
    const riskBand = this.scorer.classify(score);
    const portfolio = this.allocator.getAllocation(riskBand);

    return {
      risk_score: score,
      risk_band: riskBand,
      portfolio_allocation: portfolio
    };
  }
}

module.exports = RiskProfileService;