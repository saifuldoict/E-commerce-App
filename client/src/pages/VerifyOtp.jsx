import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { CheckCircle,  Loader2, RotateCcw } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

const VerifyOtp = () => {
   const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef([])
  const { email } = useParams()
  const navigate = useNavigate()

const handleChange = (index, value) => {
    if (value.length > 1) return
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }
  const handleVerify = async () => {
    const finalOtp = otp.join("")
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }
      try {
      setIsLoading(true)
      const res = await axios.post(`http://localhost:5000/user/verify-otp/${email}`, {
        otp: finalOtp,
      })
      setSuccessMessage(res.data.message)
      setTimeout(() => {
        navigate(`/change-password/${email}`)
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

   const clearOtp = () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  return (
    <div className='min-h-screen flex flex-col bg-green-200'>
      {/*main content */}
      <div className='flex-1 flex items-center justify-center p-4'>
          <div className='w-full max-w-md space-y-6'>
             <div className='text-center space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tight text-pink-400'>Verify your email</h1>
                  <p className='text-muted-foreground'>We,ve send 6 digit verification code to {" "}
                    <span>{"Your email"}</span>
                  </p>
             </div>
              <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-pink-600 font-bold">Enter verification code</CardTitle>
                <CardDescription className="text-center">
                  {isVerified? "Code verified successfully, Redirecting....":"Enter the 6 digit code sent to your registered email"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                  {
                    error && ( <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>)
                  }
                  {
                    successMessage && <p className='text-pink-600 text-sm mb-4 text-center'>{successMessage}</p>
                  }
                  {
                    isVerified ? (
                      <div className='py-6 flex flex-col items-center justify-center text-center space-y-5'>
                        <div className='bg-primary/10 rounded-full p-3'>
                         <CheckCircle className='h-7 w-7 text-primary'/>
                         </div>
                         <div className='space-y-2'>
                            <h4 className='font-medium text-lg'>Verification Successfully</h4>
                            <p className='text-muted-foreground'>Your email Verified successfully. redirect to reset password</p>
                         </div>
                         <div className='flex items-center space-x-3'>
                          <Loader2 className='h-5 w-5 animate-spin'/>
                          <span className='text-sm text-muted-foreground'>Redirecting...</span>
                         </div>
                      </div>
                    ):
                    (<> 
                    {/*OTP Input Field*/}
                      <div className='flex justify-between mb-5'>
                          {
                            otp.map((digit, index)=>(
                              <Input onChange={(e)=>handleChange(index, e.target.value)} key={index} type="text" value={digit}  ref={(el)=>(inputRefs.current[index]=el)} maxLength={1} className="w-12 h-12 text-center text-xl font-bold"/>
                            ))
                          }
                      </div>
                      {/*action Button */}
                      <div className='space-y-4'>
                        <Button onClick={handleVerify}
                         disabled ={isLoading || otp.some((digit)=>digit ==="")} className='w-full bg-pink-800'>
                          {isLoading?<><Loader2 />Verifying</>:"Verify Code"}
                        </Button>
                        <Button variant='outline' onClick={clearOtp} className="w-full bg-transparent" disabled ={isLoading || isVerified}>
                          
                          <RotateCcw className='mr-r h-4 w-4'/>
                          Clear
                        </Button>
                      </div>
                    </>)
                  }
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className='text-sm text-muted-foreground'>Wrong Email? {" "} </p>
                <Link to={`/forgot-password`} className='text-pink-600 hover:underline font-medium'>Go Back</Link>
              </CardFooter>
          </Card>
          <div className='text-center text-xs text-muted-foreground'>
            <p>Teasting Purpose, use this code: <span className='font-mono font-medium'>123456</span></p>
          </div>
          </div>
      </div>
    </div>
  )
}

export default VerifyOtp