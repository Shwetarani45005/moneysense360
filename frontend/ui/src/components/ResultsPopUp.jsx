import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Card,
    CardDescription,
    CardHeader,
    CardContent,
    CardTitle,
} from "@/components/ui/card"
import { ClassifyResultsContext } from '../contexts/classification.context.jsx'

function ResultsPopUp({riskDetails}) {
    const navigate = useNavigate()
    const { results } = ClassifyResultsContext()

    const handleClose = () => {
        navigate('/dashboard')    
        // setClosePopUp(true)
    }

  return (
    <div>
        <Card className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl p-6 md:p-10 shadow-green-500 shadow-2xl rounded-3xl">
            <div className='absolute top-0 right-0 p-3 pb-8 pr-4 z-10'>
                <button
                    className="h-full w-full p-3"
                    onClick={handleClose}
                >
                    <span className='p-4'> C </span>
                </button>
            </div>

            {/* <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold text-slate-900">
                Login
              </CardTitle>
              <CardDescription className="text-emerald-700">
                Start planning your savings today
              </CardDescription>
            </CardHeader> */}

            <CardContent>
                <div className="p-3 bold text-xl">
                    <span> From the Risk Form you filled up: </span>
                </div>
                <div className="p-1">
                    <span className='bold text-l'> Risk Score </span>    <span className=''> `${results.form_results.risk_score}` </span> 
                </div>
                <div className="p-1">
                    <span className='bold text-l'> Risk Band </span>    <span className=''> `${results.form_results.risk_band}` </span> 
                </div>
                <div className="p-1">
                    <span className='bold text-l'> Investment Portfolio Allocation </span>    
                    <div>    
                        {Object.keys(results.form_results.portfolio_allocation).map((key) => (
                        <div>
                            <div>
                                <span>
                                    Suggested Investment Category:
                                </span>
                                <span className=''>
                                    `{key}
                                </span>`   
                            </div>
                            <div>
                                <span>
                                    Suggested Investment Percentage:
                                </span>
                                <span className=''>
                                    {results.form_results.portfolio_allocation[key].allocation_pct}%
                                </span> 
                            </div>
                            <div>
                                <span>
                                    Suggested Investment Examples:
                                </span>
                                <span className=''>
                                    {results.form_results.portfolio_allocation[key].instruments.join(", ")}
                                </span> 
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="p-3 bold text-xl">
                    <span> From the file you uploaded: </span>
                </div>
                <div className="p-1">
                    <span className='bold text-l'> Total Spendings </span>    <span className=''> results.file_results.total_expenses </span> 
                </div>
                <div className="p-1">
                    <span className='bold text-l'> Non-mandatory expenses </span>    <span className=''> results.file_results.non_mandatory_expenses </span> 
                </div>
                <div className="p-1">
                    <span className='bold text-l'> Remaining Balance </span>    <span className=''> results.file_results.total_balance </span> 
                </div>
                <div className="p-1">
                    {
                        results.file_results.transactions_net_classification === "mandatory" 
                            ? <span className='bold text-green-700'> GOOD EFFORT: Try to decrease the Non-Mandatory expenses </span> 
                            : <span className='bold text-red-600'> CAUTION: Non-Mandatory expenses exceeded mandatory expenses </span> 
                    }
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default ResultsPopUp