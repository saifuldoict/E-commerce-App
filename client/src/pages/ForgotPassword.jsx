import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle,CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { CheckCircle, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const [isLoading,setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const[email, setEmail]= useState("")
  const [isSubmitted, setIsSubmitted]=useState(false)
  const navigate = useNavigate()

  const handleForgotPassword= async(event)=>{
    event.preventDefault()
    try {
      setIsLoading(true)
      const res= await axios.post(`http://localhost:5000/user/forgot-password`, {email});

      if(res.data.success){
        navigate(`/verify-otp/${email}`)
        toast.success(res.data.message)
        setEmail("")
      }     
    } catch (error) {
       console.log(error);
    } finally{
            setIsLoading(false)
        }
  }
  return (
    <div className='relative w-full h-[760px] bg-green-100 overflow-hidden'>
          <div className='min-h-screen flex flex-col'>
              {/* Main content */}
              <div className='flex-1 flex items-center justify-center p-4'>
                  <div className='w-full max-w-md space-y-6'>
                      <div className='text-center space-y-2'>
                          <h1 className='text-3xl font-bold tracking-tight text-green-600'>Reset Password</h1>
                          <p className='text-muted-foreground'>Enter your email address and we'll send you to reset your password instruction</p>
                      </div>
                      <Card className="bg-white">
                          <CardHeader className="space-y-1">
                              <CardTitle className="text-2xl text-center text-green-600">
                                  Forgot Password
                              </CardTitle>
                              <CardDescription className="text-center">
                                {
                                  isSubmitted?"Please Checke your email for password reset instruction": "Enter your email address to receive a password reset link"
                                }
                              </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                                {
                                  error && (
                                    <Alert variant="destructive">
                                       <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                  )
                                }
                                {
                                  isSubmitted ? (
                                    <div className='py-6 flex flex-col items-center justify-center text-center space-y-4'>
                                      <div className='bg-primary/10 rounded-full p-3'>
                                          <CheckCircle className='h-6 w-6 text-primary'></CheckCircle>
                                      </div>
                                      <div className='space-y-2'>
                                        <h2 className='font-medium text-lg'>Check your inbox</h2>
                                        <p className='text-muted-foreground'>Send password reset link to your email
                                        <span className='font-medium text-foreground'>{email}</span></p>
                                        <p>If you don't reset link, please check your spam folder or {" "}
                                          <button className='text-primary hover:underline font-medium' onClick={setIsSubmitted(false)}>  
                                              Try Again
                                          </button>
                                        </p>
                                      </div>
                                    </div>
                                  ):(
                                    <form onSubmit={handleForgotPassword} className='space-y-4'>
                                        <div className='space-y-2 relative text-gray-800'>
                                            <Label>Email</Label>
                                            <Input type="email" placeholder="Enter your email address" value={email} onChange={(e)=>setEmail(e.target.value)} required disabled={isLoading}/>
                                        </div>
                                        <Button className="w-full bg-green-600 text-white relative hover:bg-green-500 cursor-pointer">
                                          {
                                            isLoading ? (
                                              <>
                                              <Loader2 className='mr-2 h-4 w-4 animate-spin'>Sending reset link..</Loader2>
                                              </>
                                            ): ("Send reset link")
                                          }
                                        </Button>
                                    </form>
                                  )
                                }
                                  <CardFooter className='flex justify-center'>
                                <p>
                                    Remember your password?{" "}
                                    <Link to={'/login'} className='text-green-600 hover:underline font-medium relative'>Sign in</Link>
                                </p>
                            </CardFooter>
                          </CardContent>
                      </Card>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default ForgotPassword