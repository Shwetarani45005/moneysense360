import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import axios from 'axios'
import axios from '../config/axios.js'
import { ClassifyResultsContext } from '../contexts/classification.context.jsx'
import { useNavigate } from 'react-router-dom'

function UploadFile({uploadStatus, setUploadStatus=_=>{}}) {
    const [files, setFiles] = useState([])
    const [uploadPrgress, setUploadProgress] = useState(0)
    const [status, setStatus] = useState("idle")
    const [error, setError] = useState(null)
    const [res, setRes] = useState()
    const navigate = useNavigate()
    const { results, setResults } = ClassifyResultsContext()



    const handleChange = (e) => {
        // console.log("changes executed in inputs...")
        // console.log(e.target.files)
        if (e.target.files)
            setFiles([...files, e.target.files[0]])
        setStatus("initiateUpload")
    }

    const handleUpload = async (e) => {
        if (!files) return;
        
        console.log('uploaded a file...')
        console.log(files)
        console.log(e.target)

        for (const file of files) {
            // Fixed: Changed || to && and corrected MIME type checks
            if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && 
                file.type !== "text/csv") {
                console.log("invalid file format...");
                setError("Invalid file type");
                setFiles([]);
                return;
            }
            
            // Fixed: Corrected FormData capitalization and usage
            const formData = new FormData();
            formData.append("file", file);
            
            setStatus("uploading");
            
            // Fixed: Corrected axios.post syntax
            await axios.post(
                'http://localhost:4500/api/v1/uploads/file',
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    onUploadProgress: (progressEvent) => {
                        // Fixed: Changed ProgressEvent to progressEvent
                        const progress = progressEvent.total
                            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            : 0;
                        setUploadProgress(progress);
                    }
                }
            )
            .then(res => {
                console.log(res.data);
                console.log(res.data.data)
                setRes(prev => ({...prev, file_results: res.data.data.clReport}))
                // if (res) navigate('/risk-form')
                setResults(prev => ({...prev, file_results: res.data.data.clReport}))
                setUploadStatus(true);

                // This will NEVER work reliably as React updates states asynchronously...
                // if (results) {
                //     setUploadStatus(true);
                // }
            })
            .catch(err => {
                // Fixed: setError expects a string, not an object
                setError("Failed to upload the file");
                console.log(err);
                setUploadStatus(false);
            });
        }
    }

  return (
    <div className="p-1 flex justify-center items-center gap-2">
        <Input 
            type="file"
            className="bg-transparent placeholder-amber-100 text-xl text-amber-100 border-amber-50"
            onChange={e => handleChange(e)}
            placeholder="Upload a .csv or .xlsx file here"
        />
        {status==="initiateUpload" && 
            <Button 
                className="p-1 bg-amber-100 text-slate-900 rounded-2xl"
                onClick={handleUpload}
            >
                Upload
            </Button>
        }
    </div>
  )
}

export default UploadFile