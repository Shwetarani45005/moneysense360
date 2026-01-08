import React, { useState, useEffect } from 'react'
import { User, TrendingUp, DollarSign, Upload, AlertCircle, PieChart, Calendar, Settings, LogOut, FileText, Target, Activity } from 'lucide-react';
import { UserContext } from '../../../contexts/user.context.jsx'
import { ClassifyResultsContext } from '../../../contexts/classification.context.jsx'
import { RiskFormContext } from '../../../contexts/riskForm.context.jsx'
import HistPopUp from "../../HistPopUp.jsx"
import axios from '../../../config/axios.js'


export default function Dashboard() {
  
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [formHistory, setFormHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [showHistType, setShowHistType] = useState("")
  const [histResults, setHistResults] = useState(null)
  const { user } = UserContext();
  const { results } = ClassifyResultsContext();
  const { riskFormDetails: riskFormData } = RiskFormContext();
const [popUpProps, setPOpUpProps] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchLastRiskFormData = async () => {
    console.log("FETCHING LAST RISK FORM DATA FROM BACKEND...")
    const res = await axios.get(
        "http://localhost:4500/api/v1/forms/"
    ).then(res => {
        console.log(res.data)
        const lastData = res.data.data[0];

        setRiskData({
            growth_preference: lastData.growth_preference,
            volatility_tolerance: lastData.volatility_tolerance,
            horizon: lastData.horizon,
            emi: lastData.emi
        })
    })
  }

  const fetchLastAnalyticsData = async () => {
    console.log("FETCHING LAST ANALYTICS DATA FROM BACKEND...")

    const res = await axios.get(
        "http://localhost:4500/api/v1/analytics/risk_reports"
    )
    .then(res => {
        console.log("\n\n====== RISK REPORTS DATA ========\n", res.data, "\n\n")
        const data = res.data[0];

        setAnalytics(prev => ({
          ...prev,
          risk_score: results.form_results?.risk_score || 6.5,
          risk_band: results.form_results?.risk_band || 'Moderate',
        }))
    })
    .catch(err => {
        console.log("ERROR FETCHING LAST FILE ANALYTICS DATA FROM BACKEND...")
        console.error(err);
    })

    const resp = await axios.get(
    "http://localhost:4500/api/v1/analytics/cl_reports"
    )
    .then(res => {
        console.log("\n\n====== CLASSIFICATION REPORTS DATA ========\n", res.data, "\n\n")
        const data = res.data.data[0].cls_report;

        setAnalytics(prev => ({
          ...prev,
          highest_spending: { category: 'Entertainment', amount: 12500 },
          total_deposits: data.total_deposits || 85000,
          total_withdrawals: data.balance-data.total_deposits || 42000,
          total_balance: data.balance || 43000,
          non_mandatory_expenses: data.non_mandatory_expenses || 18500,
          status: data.transaction_class == "mandatory"? 'Healthy' : 'Bad'
        }))
    })
    .catch(err => {
        console.log("ERROR FETCHING LAST UPLOADS ANALYTICS DATA FROM BACKEND...")
        console.error(err);
    })
  }
  
  const fetchUploadAndFormHistories = async () => {
    try{
      // FETCH UPLOAD HISTORY
      const uploadRes = await axios.get("http://localhost:4500/api/v1/uploads")
      const formsRes = await axios.get("http://localhost:4500/api/v1/forms/")

      for (let i=1; i<=3; i++){
      const itemUploads = uploadRes.data.data[i]
      const itemForms = formsRes.data.data[i]

      setUploadHistory(uploadRes.data.data.map(item => (prev => ({
        ...prev,
        id: itemUploads.id,
        filename: itemUploads.file_name || 'statement.csv',
        date: new Date(itemUploads.updated_at).toLocaleDateString(),
        status: itemUploads.status || 'Processed'
      }))))

      console.log("\n\n", uploadRes, "\n\n")

      setFormHistory(formsRes.data.data.map(item => (prev => ({
        ...prev,
        id: itemForms.id,
        date: new Date(itemForms.created_at).toLocaleDateString(),
        age: itemForms.age,
        jobType: itemForms.job_type,
        createdAt: itemForms.created_at,
      }))))
    }}
    catch(err){
      console.log("ERROR FETCHING UPLOAD AND FORM HISTORIES...")
      console.error(err);
    }
  }

  const fetchDashboardData = async () => {
    setLoading(true);
    
    if (!user) {
        console.log("LOGIN / REGISTER FIRST...")
        setLoading(false);
        return;
    }

    setUserData({
      username: user?.username || 'John Smith',
      email: user?.email || 'john.smith@example.com',
      age: user?.age || 32
    });
    
    // FETCH THE DATA FROM THE RISK FORM CONTEXT AND IF NOT EXISTS, THEN FETCH THE LAST FILLED FORM DETAILS FROM THE BACKEND...
    if (riskFormData) {
      setRiskData({
        growth_preference: 'medium',
        volatility_tolerance: 'moderate',
        horizon: '5-10 years',
        emi: 15000
      });
    }
    else {
        await fetchLastRiskFormData();
    }
    // user has just performed an analytics operation... the results from the classificationContext must not be null...
    if (results.file_results && results.form_results) {
      setAnalytics({
        risk_score: results.form_results?.risk_score || 6.5,
        risk_band: results.form_results?.risk_band || 'Moderate',
        highest_spending: { category: 'Entertainment', amount: 12500 },
        total_deposits: results.form_results?.total_deposits || 85000,
        total_withdrawals: results.form_results?.total_withdrawals || 42000,
        total_balance: results.form_results?.total_balance || 43000,
        non_mandatory_expenses: results.form_results?.non_mandatory_expenses || 18500,
        status: results.file_results?.status == "mandatory"? 'Healthy' : 'Bad'
      });
    }
    else {
        await fetchLastAnalyticsData()
    }

    fetchUploadAndFormHistories()

    setLoading(false);
  };

  const getRiskColor = (band) => {
    const colors = {
      'Low': 'bg-green-500',
      'Low-Moderate': 'bg-green-400',
      'Moderate': 'bg-yellow-500',
      'Moderate-High': 'bg-orange-500',
      'High': 'bg-red-500'
    };
    return colors[band] || 'bg-gray-500';
  };

  const getStatusIcon = () => {
    return analytics?.status === 'healthy' ? 
      <div className="flex items-center gap-2 text-green-600">
        <div className="w-2 h-2 rounded-full bg-green-600"></div>
        <span className="text-sm font-medium">Healthy Spending</span>
      </div> :
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Review Spending</span>
      </div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  async function handlePopUp(histType, id) {
    let res;
    try {
      if (histType === "formHist") {
        res = await axios.get(`http://localhost:4500/analytics/risk_report/${id}`)
      }
      else if (histType === 'uploadHist') {
        res = await axios.get(`http://localhost:4500/analytics/cl_res/${id}`) 
      }
      setHistResults(res)
      setShowHistType(histType)
      setOpenPopUp(true)
    } 
    catch (error) { 
      console.error("Error fetching history details for popup:", error);
      console.error(error);
    }
  }

  return (
    <>
    {
      openPopUp 
      && (
          <HistPopUp histType={showHistType} setOpenPopUp={setOpenPopUp} results={histResults}/>
        ) 
    }
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-green-400">
    {/* <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-500 to-slate-900"> */}
    {/* Header */}
      {/* <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                <h1 className="text-2xl font-bold text-white">MoneyTracker</h1>
                <p className="text-xs text-purple-300">Financial Intelligence Platform</p>
                </div>
                </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-300" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <LogOut className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-300">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Card */}
        {/* <div className="bg-purple-400/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"> */}
        <div className="bg-green-500 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-greem-400 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userData?.username}</h2>
                <p className="text-amber-100">{userData?.email}</p>
                <p className="text-sm text-amber-100 mt-1">Age: {userData?.age} years</p>
              </div>
            </div>
            <div className="text-right">
              {getStatusIcon()}
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
                <span className={`w-2 h-2 rounded-full ${getRiskColor(analytics?.risk_band)}`}></span>
                <span className="text-sm text-white font-medium">{analytics?.risk_band} Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'investment', label: 'Investment Profile', icon: Target },
            { id: 'analytics', label: 'Analytics', icon: PieChart },
            { id: 'history', label: 'History', icon: Calendar }
          ].map(tab => (
            <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-green-300 text-slate-900 hover:bg-white/10'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-600/80 to-green-600/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-200 text-lg font-bold">Total Balance</span>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">₹{analytics?.total_balance?.toLocaleString()}</p>
                <p className="text-xs text-green-300 mt-2">+12.5% from last month</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/80 to-blue-600/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-200 text-lg font-bold">Total Deposits</span>
                  <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">₹{analytics?.total_deposits?.toLocaleString()}</p>
                <p className="text-xs text-blue-300 mt-2">This month</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/80 to-orange-600/20 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-200 text-lg font-bold">Total Withdrawals</span>
                  <TrendingUp className="w-5 h-5 text-orange-400 rotate-180" />
                </div>
                <p className="text-3xl font-bold text-white">₹{analytics?.total_withdrawals?.toLocaleString()}</p>
                <p className="text-xs text-orange-300 mt-2">This month</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/80 to-purple-600/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-200 text-lg font-bold">Risk Score</span>
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">{analytics?.risk_score}/10</p>
                <p className="text-xs text-purple-300 mt-2">{analytics?.risk_band} risk level</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-300/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg shadow-green-800">
                <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Spending Alert
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Highest Spending</span>
                    <span className="text-slate-800- font-bold">{analytics?.highest_spending?.category}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-700">Amount</span>
                    <span className="text-lg text-red-600 font-bold">₹{analytics?.highest_spending?.amount?.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-400/50 rounded-lg">
                    <p className="text-sm text-red-800">
                      Non-mandatory expenses: ₹{analytics?.non_mandatory_expenses?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg shadow-green-800">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-900" />
                  Recent Uploads
                </h3>
                <div className="space-y-3">
                  {uploadHistory.slice(0, 3).map(upload => (
                    <div key={upload.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-900" />
                        <div>
                          <p className="text-slate-700 text-sm font-medium">{upload.filename}</p>
                          <p className="text-xs text-slate-600">{upload.date}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green- text-green-400 rounded-full">
                        {upload.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investment Profile Tab */}
        {activeTab === 'investment' && (
          <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-slate-600 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Your Investment Profile
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl shadow-slate-400 shadow-md">
                  <label className="text-sm text-slate-800">Growth Preference</label>
                  <p className="text-xl text-slate-600 font-semibold capitalize mt-1">{riskData?.growth_preference}</p>
                  <div className="mt-2 flex gap-1">
                    {['slow', 'medium', 'high'].map(level => (
                      <div
                      key={level}
                      className={`h-2 flex-1 rounded-full ${
                        level === riskData?.growth_preference ? 'bg-purple-500' : 'bg-white/10'
                      }`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-slate-400 shadow-md">
                  <label className="text-sm text-slate-580">Volatility Tolerance</label>
                  <p className="text-xl text-slate-600 font-semibold capitalize mt-1">{riskData?.volatility_tolerance}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl shadow-slate-400 shadow-md">
                  <label className="text-sm text-slate-800">Investment Horizon</label>
                  <p className="text-xl text-slate-600 font-semibold mt-1">{riskData?.horizon}</p>
                </div>

                <div className="p-4 bg-white/rounded-xl shadow-slate-400 shadow-md">
                  <label className="text-sm text-slate-400">Monthly EMI</label>
                  <p className="text-xl text-slate-600 font-semibold mt-1">₹{riskData?.emi?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-6 bg-green-950/90 rounded-xl border border-purple-500/30">
              <h4 className="text-lg font-bold text-white mb-2">Investment Recommendation</h4>
              <p className="text-gray-300">
                Based on your {riskData?.growth_preference} growth preference and {riskData?.volatility_tolerance} volatility tolerance,
                we recommend a balanced portfolio with 60% equity and 40% debt instruments for your {riskData?.horizon} investment horizon.
              </p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-blue-800" />
                Financial Analytics
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-800/80 to-blue-600/20 rounded-xl border border-blue-500/30">
                  <p className="text-sm text-blue-100 font-bold text-xl mb-2">Savings Rate</p>
                  <p className="text-4xl font-bold text-white">
                    {((analytics?.total_balance / analytics?.total_deposits) * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-800/80 to-green-600/20 rounded-xl border border-green-500/30">
                  <p className="text-sm text-green-100 font-bold text-xl mb-2">Mandatory vs Non-Mandatory</p>
                  <p className="text-4xl font-bold text-white">
                    {((analytics?.non_mandatory_expenses / analytics?.total_withdrawals) * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-800/80 to-purple-600/20 rounded-xl border border-purple-500/30">
                  <p className="text-sm text-purple-100 text-xl font-bold mb-2">Financial Health Score</p>
                  <p className="text-4xl font-bold text-white">{analytics?.risk_score}/10</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-600">Spending Breakdown</h4>
                <div className="space-y-3">
                  {[
                    { category: 'Entertainment', amount: 12500, color: 'from-red-500 to-orange-500', width: '75%' },
                    { category: 'Food & Dining', amount: 8200, color: 'from-yellow-500 to-orange-500', width: '50%' },
                    { category: 'Transportation', amount: 6500, color: 'from-blue-500 to-cyan-500', width: '40%' },
                    { category: 'Shopping', amount: 5300, color: 'from-purple-500 to-pink-500', width: '32%' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700 font-medium">{item.category}</span>
                        <span className="text-slate-600">₹{item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className={`bg-gradient-to-r ${item.color} h-2 rounded-full`} style={{width: item.width}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-850" />
                Upload History
              </h3>
              <div className="space-y-3">
                {uploadHistory.map(upload => (
                  <div 
                    key={upload.id} 
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    onClick={() => handlePopUp("uploadHist", upload.id)}  
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/60 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-800" />
                      </div>
                      <div>
                        <p className="text-slate-700 font-medium">{upload.filename}</p>
                        <p className="text-sm text-slate-600">{upload.date}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-slate-900 text-sm rounded-full">
                      processed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-600" />
                Risk Assessment History
              </h3>
              <div className="space-y-3">
                {formHistory.map(form => (
                  <div
                    key={form.id} 
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    onClick={() => handlePopUp("formHist", form.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-slate-700 font-medium">Risk Form Details</p>
                        <p className="text-sm text-slate-600">{form.age}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-600 font-bold">Job Type: {form.jobType}</p>
                      {/* <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mt-1 ${
                        form.jobType.includes('Low') ? 'bg-green-500/20 text-green-400' :
                        // form..includes('Moderate') ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}> */}
                      <span className={`nline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mt-1`}>
                        {form.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

// JOIN THE RISK_REPORTS AND THE CL_REORTS AND THE CL_CATEGORIES TABLES AND SEND THE RESULTS OF A PARTICULEAR FORM ID TO THE FRONTEND TO THE HISTORIES TAB.

// export default Dashboard;