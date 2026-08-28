import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

export default function Register(){
    const navigate = useNavigate();

    const [Username,setUsername] = useState("")
    const [Password,setPassword] = useState("")
    const [ConfirmPassword,setConfirmPassword] = useState("")
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
            })
        })

        if (!response.ok) {
            const error = await response.json()
            alert(error.detail)
            return
        }

        // Send email to verification page
        navigate(`/verify-email?email=${encodeURIComponent(Email)}`)
    }

    return(
        <>
            <div className="register-page">

                <h1>Create Account</h1>

                <input
                    className="register-input"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                /> <br/>

                <input
                    className="register-input"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                /> <br/>

                <input
                    className="register-input"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                /> <br/>

                <input
                    className="register-input"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                /> <br/>

                <button className="register-button" onClick={CreateAccount}>Submit</button><br/>

                <h3>Already have an account?</h3>
                <button className="register-button" onClick={() => navigate('/login')}>
                    Login
                </button>

            </div>
        </>
    )
}