
import './App.css'

import {createBrowserRouter, RouterProvider} from 'react-router'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Verify from './pages/Verify'
import ForgotPassword from './pages/ForgotPassword'
import Navbar from './components/Navbar'
import VerifyOtp from './pages/VerifyOtp'
import ChangePassword from './pages/ChangePassword'
import AuthSuccess from './pages/AuthSuccess'
import VerifyEmail from './pages/VerifyEmail'
import Profile from './pages/Profile'

const router = createBrowserRouter([
    {
      path:'/',
      element:<><Navbar/><Home/></>
    },
    {
      path:'/signup',
      element: <Signup/>
    },
    {
      path:'/verify',
      element: <Verify/>
    },
    {
      path:'/verify/:token',
      element: <VerifyEmail/>
    },
    {
      path:'/login',
      element: <Login/>
    },
    {
      path:'/auth-success',
      element: <AuthSuccess/>
    },
    {
      path:'/forgot-password',
      element: <ForgotPassword/>
    },
    {
      path:'/verify-otp/:email',
      element: <VerifyOtp/>
    },
    {
      path:'/change-password/:email',
      element: <ChangePassword/>
    },
    {
      path:'/profile/:userId',
      element: <><Navbar/> <Profile/></>
    }
])
function App() {

  return (
    <>
      <div>
        <RouterProvider router={router}>
         
        </RouterProvider>
      </div>
      
    </>
  )
}

export default App
