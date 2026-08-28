import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/global.css"

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")

    
    async function handleSubmit() {
        const response = await fetch(
            `http://localhost:9000/forgot-password?email=${encodeURIComponent(email)}`,
            {
                method: "POST"
            }
        )
        const data = await response.json()
        if (!response.ok) {
            alert(data.detail)
            return
        }
        navigate(`/reset-password?email=${encodeURIComponent(email)}`)
    }

    return (
        <>
            <h1>Forgot Password</h1>
            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="forgot-password-input"
            />
            <br />
            <button
                onClick={handleSubmit}
                className="forgot-password-button"
            >
                Send Code
            </button>
            <br />
            <button
                onClick={() => navigate("/login")}
                className="forgot-password-button"
            >
                Back to Login
            </button>
        </>
    )
}