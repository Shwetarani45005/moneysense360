import { useContext, createContext, useState } from 'react'

// const classifyResultsContext = createContext()         // If a component renders outside the Provider, this will cause undefined.

const classifyResultsContext = createContext({
    results: null,
    setResults: () => { console.log("USED OUTSIDE ClassificationResultsContextProvider") }
})

export const ClassificationResultsContextProvider = ({children}) => {
    const [results, setResults] = useState(null)     

    return <classifyResultsContext.Provider value = {{results, setResults}}>
        {children}
    </classifyResultsContext.Provider>
}

export const ClassifyResultsContext = () => {
    return useContext(classifyResultsContext)
}