import { ShoppingCart, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import { Button } from './ui/button'

const Navbar = () => {
  const accessToken = localStorage.getItem("accessToken")
  const { user } = useSelector(store => store.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        dispatch(setUser(null))
        localStorage.clear()
        toast.success(res.data.message)
        navigate('/login')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed")
    }
  }

  return (
    <nav className="bg-pink-50 fixed top-0 left-0 w-full z-50 border-b border-pink-200">
      {/* Center container */}
      <div className="max-w-7xl mx-auto px-20 flex justify-between items-center h-16">
        
        {/* Logo */}
        <Link to="/">
          <img src="/logo.png" alt="logo" className="w-15" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 items-center text-lg font-semibold">
            <Link to="/"><li>Home</li></Link>
            <Link to="/products"><li>Products</li></Link>
            {user && <Link to={`/profile/${user._id}`}>Hello, {user.name}</Link>}
          </ul>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} />
            <span className="bg-pink-500 rounded-full absolute text-white -top-2 -right-3 px-2 text-sm">
              0
            </span>
          </Link>

          {/* Auth Button */}
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-pink-600 text-white"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white"
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <ul className="flex flex-col items-center gap-4 py-4 text-lg font-semibold">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
            {user && (
              <Link to={`/profile/${user._id}`} onClick={() => setOpen(false)}>
                Hello, {user.name}
              </Link>
            )}
            <Link to="/cart" onClick={() => setOpen(false)}>
              Cart
            </Link>

            {user ? (
              <Button
                onClick={logoutHandler}
                className="bg-pink-600 text-white w-32"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white w-32"
              >
                Login
              </Button>
            )}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar