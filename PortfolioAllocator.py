class PortfolioAllocator:
    PORTFOLIO_MAP = {
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
    }

    ASSET_MAP = {
        "Low Risk": ["FD/RD", "Debt Funds"],
        "Medium Risk": ["Index Funds", "Equity SIP"],
        "High Risk": ["Smallcases", "Crypto"]
    }

    def get_allocation(self, risk_profile: str) -> dict:
        allocation = self.PORTFOLIO_MAP.get(risk_profile, {})
        detailed = {}

        for risk_level, pct in allocation.items():
            detailed[risk_level] = {
                "allocation_pct": pct,
                "instruments": self.ASSET_MAP[risk_level]
            }

        return detailed
