import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Card,
    // CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "../../ui/button"
import { UserContext } from "../../../contexts/user.context.jsx" 
import { ClassifyResultsContext } from '../../../contexts/classification.context.jsx'
import { RiskFormContext } from '../../../contexts/riskForm.context.jsx'
import ResultsPopUp from '../../ResultsPopUp.jsx'
// import axios from "axios"
import axios from '../../../config/axios.js'

export default function RiskForm() {
  const formData = { age: "", income: "", emiBurden: "", dependants: "", jobType: "", growthPref: "", emergencyFundMonths: "", horizon: "", volatilityTolerance: "" }
  const [inputs, setInputs] = useState(formData)
  const [errors, setError] = useState({ flag: false, message: "" })
  const [loading, setLoading] = useState(false)
  const {setUser} = UserContext()
  const navigate = useNavigate()
  const [riskDetails, setRiskDetails] = useState(null)
  // const [closePopUp, setClosePopUp] = useState(true)
  const {setResults} = ClassifyResultsContext()
  const { setRiskFormDetails } = RiskFormContext()

  const handleInputs = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log("SUBMISSION INVOKED...")
    console.log(inputs)
    const {age, income, emiBurden, dependants, jobType, growthPref, emergencyFundMonths, horizon, volatilityTolerance} = inputs

    console.log("ALL TESTS PASSED...")
    // setSubmit(true)
    setLoading(true)
    console.log("QUERYING BACKEND ENDPOINT")
    console.log(inputs)
    // await axios.post(`/forms/create`, 
    await axios.post(`http://localhost:4500/api/v1/forms/create`, 
        {
          "emi": emiBurden,
          "volatility": volatilityTolerance || "high",
          // "emergency_months": emergencyFundMonths,
          "growth": growthPref,
          "job_type": jobType,
          income,
          age,
          horizon,
          dependants
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
    )
    .then(res => { 
      console.log("RISK FORM SUBMISSION SUCCESSFUL...")
      console.log(res.data)
      console.log(res.data.riskProfile);  
      // return res; 
      setRiskDetails(res.data.riskProfile)
      setRiskFormDetails(inputs)
      setResults(prev => ({...prev, form_results: res.data.riskProfile}))
      navigate('/')
    })
    // .then(res => {
    //   setRiskDetails(res.data.riskProfile)
    //   setRiskFormDetails(inputs)
    //   setResults(prev => ({...prev, form_results: res.data.riskProfile}))
    //   navigate('/')
    // })
    .catch(err => {
      console.log("RISK FORM SUBMISSION ATTEMPT FAILED...")
      // console.log("res.message")
      setError()
    })
  }

  return (
    <div className={`${(riskDetails) && "z-0"} min-h-full w-full bg-deepGreen relative flex items-center justify-center overflow-hidden font-sans selection:bg-accentGreen selection:text-deepGreen bg-green-200`}> 
    {
      riskDetails 
      && (
          <div className="absolute z-10 flex w-screen h-screen backdrop-blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center px-4">
            <ResultsPopUp riskDetails={riskDetails}/>
          </div>
        )
      }
    <div className="min-h-screen w-full flex items-center justify-center bg-green-200 px-4">
      <Card className="w-full max-w-lg md:max-w-xl lg:max-w-2xl p-6 md:p-10 shadow-green-500 shadow-2xl rounded-3xl">
        
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-slate-900">
            Risk
          </CardTitle>
          <CardDescription className="text-emerald-700">
            Start planning your savings today
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            
            <div>
              <FieldLabel htmlFor="age">Age</FieldLabel>
              <Input
                id="age"
                name="age"
                onChange={handleInputs}
                value={inputs.age}
                placeholder="Enter your Age"
                />
            </div>

            <div>
              <FieldLabel htmlFor="income">Income</FieldLabel>
              <Input
                id="income"
                name="income"
                onChange={handleInputs}
                value={inputs.income}
                placeholder="Enter your Income"
                />
            </div>

            <div>
              <FieldLabel htmlFor="emiBurden">EMI Burden</FieldLabel>
              <Input
                id="emiBurden"
                name="emiBurden"
                onChange={handleInputs}
                value={inputs.emiBurden}
                placeholder="Enter your EMI Burden"
                />
            </div>

            <div>
              <FieldLabel htmlFor="dependants">Dependants</FieldLabel>
              <Input
                id="dependants"
                name="dependants"
                type="number"
                onChange={handleInputs}
                value={inputs.dependants}
              />
            </div>

            <div>
              <FieldLabel htmlFor="jobType">Employment Type</FieldLabel>
              <Input
                id="jobType"
                name="jobType"
                type="text"
                onChange={handleInputs}
                value={inputs.jobType}
                />
            </div>

            <div>
              <FieldLabel htmlFor="growthPreference">Growth Preference</FieldLabel>
              <Input
                id="growthPreference"
                name="growthPref"
                type="text"
                onChange={handleInputs}
                value={inputs.growthPref}
                />
            </div>   

            {/* <div>
              <FieldLabel htmlFor="emergencyFundMonths">High Expenditure Months</FieldLabel>
              <Input
                id="emergencyFundMonths"
                name="emergencyFundMonths"
                type="text"
                onChange={handleInputs}
                value={inputs.emergencyFundMonths}
                />
            </div>         */}

            <div>
              <FieldLabel htmlFor="horizon">Horizon (in years)</FieldLabel>
              <Input
                id="horizon"
                name="horizon"
                type="number"
                onChange={handleInputs}
                value={inputs.horizon}
                />
            </div>

            <div>
              <FieldLabel htmlFor="volatilityTolerance">Volatility Tolerance</FieldLabel>
              <Input
                id="volatilityTolerance"
                name="volatilityTolerance"
                type="number"
                onChange={handleInputs}
                value={inputs.volatilityTolerance}
                />
            </div>

            <Button
              // type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-lg py-6 rounded-xl"
              onClick={handleSubmit}
              disabled={loading}
              >
              {loading ? "Loading..." : "Analyze"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
