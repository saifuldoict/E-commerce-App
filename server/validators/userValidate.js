
import yup from "yup"

export const userSchema = yup.object({
  name:yup
  .string()
  .trim()
  .min(3, 'name must be atlease 3 characters')
  .required(),
  email:yup
  .string()
  .email("the email is not valid one")
  .required(),
  password:yup
  .string()
  .min(4, " password must be at least 4 character")
  .required()
})

export const validateUser=(schema)=>async(req,res,next)=>{
    try {
        await schema.validate(req.body)
        next()
    } catch (err) {
        return res.status(400).json({error:err.errors})
    }
}