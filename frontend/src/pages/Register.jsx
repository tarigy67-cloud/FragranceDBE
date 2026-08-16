import {useState} from 'react'
import {useNavigate} from 'react-router-dom'



export default function Register(){
    const navigate = useNavigate();

    const [Username,setUsername] = useState("")
    const [Password,setPassword] = useState("")
    const[ConfirmPassword,setConfirmPassword] = useState("")
    const [Email, setEmail] = useState("")


   
    async function CreateAccount(){
        localStorage.removeItem("token")
        if (Password != ConfirmPassword){
            alert("Passwords Do Not Match!");
             return;
            }


        const response = await fetch("http://localhost:9000/register",{

            method : 'POST',
            headers : {"Content-type" : 'application/json'},
            body: JSON.stringify({
                username : Username,
                password: Password,
                email : Email,
                profile_pic : null,
                bio : null
                    }
                )
            }
        )  
        
        if (!response.ok) {

            const error = await response.json()
            alert(error.detail)
            console.log("RESPONSE NOT OKAY")    
            return
    
        }
        const data = await response.json()
        console.log("Access token:", data.access_token)
        localStorage.setItem("token", data.access_token)
        setTimeout(() => {
            navigate('/home')
        }, 1000)


    }
    



return(<>
    <h1>Create Account</h1>
    <input placeholder = "Email" onChange = {(e) => setEmail(e.target.value)}/> <br/>
    <input placeholder = "Username" onChange = {(e) => setUsername(e.target.value)}/> <br/>
    <input type = "password" placeholder = "Password" onChange = {(e) => setPassword(e.target.value)}/> <br/>
    <input type = "password"placeholder = "Confirm Password" onChange = {(e) => setConfirmPassword(e.target.value)}/> <br/>

    <button onClick = {CreateAccount}>Submit</button><br/>
    <h3>Already have an account?</h3><br/>
    <button onClick = {() => navigate('/login')}>Login</button>






 </>)
}