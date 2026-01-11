// import React from 'react'
// import { Button } from '@/components/ui/button'
// import { Link, useNavigate } from 'react-router-dom'
// import { UserContext } from '../../contexts/user.context.jsx'
// import logo from '@/assets/logo.png'
 
// function Navbar() {
//     const {user} = UserContext()
//     const navigate = useNavigate()

//   return (
//     <div className='h-max-20 bg-gradient-to-b from-green-700/100 to-green-300/90 w-screen p-3 shadow-lg shadow-green-500'>
//         <div className="p-3 flex justify-between">
//             {/* <div className="w-1/2 flex p-2 pl-8" onClick={() => window.location.href='/'}> */}
//             <div className="w-1/2 flex pl-8 items-center" onClick={() => navigate('/')}>
//                 <span className='h-50 w-40'>
//                     <img src={logo} alt="Monneysense 360 Logo img" className='h-full w-full cursor-pointer'/>
//                 </span>
//                 {/* <span className='text-l font-bold'>
//                     Moneysensse 360
//                 </span> */}
//             </div>
//             <div className='w-1/2 flex justify-center items-center'>
//                 <div className="p-1 w-1/2"></div>
//                 <div className='w-1/2 flex justify-center items-center'>
//                 {
//                     user 
//                     ? (
//                     <div className="p-1">
//                         <Button className='bg-green-600'>
//                             <Link to="/dashboard"> Dashboard </Link>
//                         </Button>
//                     </div>
//                     ) : (
//                     <div className='flex justify-center items-center ml-10'>
//                     <div className="p-1 mr-5 h-full">
//                         <Button>
//                             <Link to="/register"> Sign up </Link>
//                         </Button>
//                     </div>
//                     <div className="p-1">
//                         <Button className='bg-green-600'>
//                             <Link to='/login'> Login </Link>
//                         </Button>
//                     </div>
//                     </div>
//                     )
//                 }
//                 </div>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Navbar









import React, { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/user.context.jsx'
import logo from '@/assets/logo.png'

function Navbar() {
  const { user } = UserContext()
  const navigate = useNavigate()

  return (
    <nav className="w-full bg-gradient-to-b from-green-700 to-green-300 shadow-lg shadow-green-500">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
            src={logo}
            alt="Moneysense 360"
            className="h-10 w-auto cursor-pointer"
          />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/register">Sign up</Link>
              </Button>

              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/login">Login</Link>
              </Button>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar
