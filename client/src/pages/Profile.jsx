

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import avater from '../assets/avater.png'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
const Profile = () => {
  const {user}=useSelector(store=>store.user)
  const params = useParams()
  const userId= params.userId
  const [updateUser, setUpdateUser] = useState({
    name:user?.name,
    email:user?.email,
    phoneNo:user?.phoneNo,
    address:user?.address,
    city:user?.city,
    zipCode:user?.zipCode,
    ProfilePic: user?.ProfilePic,
    role:user?.role
  })
  const [file,setFile]= useState(null)
  const dispatch = useDispatch()



  const handleChange=(e)=>{
    setUpdateUser({...updateUser, [e.target.name]:e.target.value})
  }
  const handleFileChange = (e)=>{
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({...updateUser, ProfilePic:URL.createObjectURL(selectedFile)}) // preview only
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    const accessToken = localStorage.getItem("accessToken")
    try {
      // use FormData for text+file
      const formData = new FormData()
      formData.append("name", updateUser.name)
      formData.append("email", updateUser.email)
      formData.append("phoneNo", updateUser.phoneNo)
      formData.append("address", updateUser.address)
      formData.append("city", updateUser.city)
      formData.append("zipCode", updateUser.zipCode)
      formData.append("role", updateUser.role)


      if(file){
        formData.append("file", file)    // image file for multer
      }
      const res= await axios.put(`http://localhost:5000/user/update/${userId}`, formData, {
        headers:{
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      })
      if(res.data.success){
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))

      }
    } catch (error) {
      console.log(error)
      toast.error("failed to update profile")
    }

  }
  return (
    <div className='pt-20 min-h-screen bg-gray-100'>
       <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
           <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
           </TabsList>
           <TabsContent value='profile'>
            <div>
               <div className='flex flex-col justify-center items-center bg-gray-100'>
                    <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update Profile</h1>
                    <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl'>
                      {/*profile picture*/}
                      <div className='flex flex-col items-center'>
                          <img src={updateUser?.ProfilePic || avater} alt='profile' className='w-32 h-32 rounded-full object-cover border-4'/>
                           <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-full">Change Picture
                            <input type='file' accept='image/*' className='hidden' onChange={handleFileChange}/>
                           </Label>
                      </div>
                      {/*profile form*/}
                      <form onSubmit={handleSubmit} className='space-y-4 shadow-lg p-5 rounded-lg bg-white'>
                          <div className='grid grid-cols-2 gap-4'>
                             <div>
                              <Label className="block text-sm font-medium">Name</Label>
                              <Input type='text' name="name" placeholder='Jhon' className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser.name} onChange={handleChange}/>
                             </div>
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                             <div>
                              <Label className="block text-sm font-medium">Email</Label>
                              <Input type='email' name="email" disabled placeholder='Enter your email' className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser.email} onChange={handleChange}/>
                             </div>
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                             <div>
                              <Label className="block text-sm font-medium">Phone no</Label>
                              <Input type='text' name="phoneNo"  placeholder='Enter your phone N' className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser.phoneNo} onChange={handleChange}/>
                             </div>
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                             <div>
                              <Label className="block text-sm font-medium">Address</Label>
                              <Input type='text' name="address" placeholder='Enter your address' className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser.address} onChange={handleChange}/>
                             </div>
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                             <div>
                              <Label className="block text-sm font-medium">City</Label>
                              <Input type='text' name="city" placeholder='Enter your city' className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser.city} onChange={handleChange}/>
                             </div>
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                             <div>
                              <Label className="block text-sm font-medium">Zip Code</Label>
                              <Input type='text' name="zip code" placeholder='Enter your zip code' className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser.zipCode} onChange={handleChange}/>
                             </div>
                          </div>
                          <Button type="submit" className="mt-4 w-full cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-full">Update Profile</Button>
                      </form>
                    </div>
               </div>
            </div>
           </TabsContent>
       </Tabs>
    </div>
  )
}

export default Profile