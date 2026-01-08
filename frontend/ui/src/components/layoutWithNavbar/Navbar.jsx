import React from 'react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/user.context.jsx'
 
function Navbar() {
    const {user} = UserContext()
    const navigate = useNavigate

  return (
    <div className='bg-gradient-to-b from-green-700/100 to-green-300/90 w-screen p-3 shadow-lg shadow-green-500'>
        <div className="p-3 flex justify-between">
            {/* <div className="w-1/2 flex p-2 pl-8" onClick={() => window.location.href='/'}> */}
            <div className="w-1/2 flex p-2 pl-8" onClick={() => navigate('/')}>
                <span>
                    Logo
                </span>
                <span className='text-l font-bold'>
                    Moneysensse 360
                </span>
            </div>
            <div className='w-1/2 flex justify-center items-center'>
                <div className="p-1 w-1/2"></div>
                <div className='w-1/2 flex justify-center items-center'>
                {
                    user 
                    ? (
                    <div className="p-1">
                        <Button className='bg-green-600'>
                            <Link to="/dashboard"> Dashboard </Link>
                        </Button>
                    </div>
                    ) : (
                    <div className='flex justify-center items-center ml-10'>
                    <div className="p-1 mr-5 h-full">
                        <Button>
                            <Link to="/register"> Sign up </Link>
                        </Button>
                    </div>
                    <div className="p-1">
                        <Button className='bg-green-600'>
                            <Link to='/login'> Login </Link>
                        </Button>
                    </div>
                    </div>
                    )
                }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar