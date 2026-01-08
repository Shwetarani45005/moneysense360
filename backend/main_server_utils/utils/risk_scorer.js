class RiskScorer {
  constructor() {
    this.growthMap = {
      "slow": 0,
      "balanced": 10,
      "rapid": 20
    };
  }

  calculateScore(form) {
    let score = 0;

    // Age
    const age = form.age;
    if (age >= 18 && age <= 25) {
      score += 20;
    } else if (age >= 26 && age <= 35) {
      score += 15;
    } else if (age >= 36 && age <= 45) {
      score += 10;
    } else if (age >= 46 && age <= 60) {
      score += 5;
    }

    // Income
    const income = form.income;
    if (income > 200000) {
      score += 20;
    } else if (income > 100000) {
      score += 15;
    } else if (income > 60000) {
      score += 10;
    } else if (income > 30000) {
      score += 5;
    }

    // Dependents
    const dependentsMap = {
      0: 20,
      1: 15,
      2: 10,
      3: 5
    };
    score += dependentsMap[form.dependants] || 0;

    // EMI burden
    const emi = form.emi;
    if (emi < 15) {
      score += 15;
    } else if (emi <= 30) {
      score += 10;
    } else if (emi <= 50) {
      score += 5;
    }

    // Growth preference
    const growthKey = form.growth?.toLowerCase();
    score += this.growthMap[growthKey] || 0;

    return score;
  }

  classify(score) {
    if (score <= 35) {
      return "Conservative";
    } else if (score <= 65) {
      return "Moderate";
    }
    return "Aggressive";
  }
}

module.exports = RiskScorer;