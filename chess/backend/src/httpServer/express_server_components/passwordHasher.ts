import bcrypt from "bcrypt";
const  passwordHasher =async (password:string) =>{
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        return hashedPassword;

    }
    catch(err){
        console.log(err);
    }
}
export default passwordHasher;