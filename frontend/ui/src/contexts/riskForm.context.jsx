import { createContext, useState, useContext } from 'react';

const riskFormContext = createContext();

export const RiskFormContextProvider = ({ children }) => {
    const [riskFormDetails, setRiskFormDetails] = useState(null);
    // const [riskFormDetails, setRiskFormDetails] = useState({});

    return (
        <riskFormContext.Provider value={{ riskFormDetails, setRiskFormDetails }}>
            {children}
        </riskFormContext.Provider>
    );
}

export const RiskFormContext = () => useContext(riskFormContext);