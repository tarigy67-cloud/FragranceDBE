import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import "../styles/global.css"



export default function Login(){
    const navigate = useNavigate()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")


    async function handleSubmitButton(){

           const response = await fetch("http://localhost:9000/login",{


                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                    email: email,
                    password: password
                })
         }
    
        )
        if(!response.ok){
            const error = await response.json()
            alert(error.detail)
            return }



        const data = await response.json()
        console.log( data.access_token)
        localStorage.setItem("token",data.access_token)
        localStorage.setItem("test","hello")


        navigate('/home')
        }
        
    
    


return(<>
<h1>Login</h1>
<input
    placeholder = "Email"
    onChange = {(e) => setEmail(e.target.value)}
    className="login-input"
/><br/>
<input
    type = "password"
    placeholder = 'Password'
    onChange = {(e) => setPassword(e.target.value)}
    className="login-input"
/> <br/>
<button
    onClick = {handleSubmitButton}
    className="login-button"
>
    Submit
</button>
<button
    onClick={() => navigate("/forgot-password")}
    className="login-button"
>
    Forgot Password?
</button>
<h3>Don't have an account?</h3>
<button
    onClick = {() => navigate("/register")}
    className="login-button"
>
    Create Account
</button>






</>)
}