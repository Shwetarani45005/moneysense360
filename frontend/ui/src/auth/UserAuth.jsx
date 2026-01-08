import React, { useState, useEffect, Children } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/user.context.js'

function UserAuth() {
    const { user } = UserContext()
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('token')
    // const name = localStorage.getItem('name')
    const navigate = useNavigate()

    useEffect(() => {
        // const name = localStorage.getItem('name')
        // if (user || name) setLoading(false)
        if (user) setLoading(false)
        if (!token || !user) {
        // if (!name || !user) {
            navigate('/login')
        }
    }, [])

    if (loading) 
        return <div>Loading...</div>
    return (
        <> {Children} </>
  )
}

export default UserAuth