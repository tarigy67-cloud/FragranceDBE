import {useState} from "react"
import {useNavigate, useSearchParams} from "react-router-dom"

export default function VerifyEmail(){
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const email = searchParams.get("email")
    const [code, setCode] = useState("")

    async function verifyEmail(){
        const response = await fetch(
            `http://localhost:9000/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
            {
                method: "POST"
            }
        )

        if (!response.ok){
            const error = await response.json()
            alert(error.detail)
            return
        }

        alert("Email verified successfully!")
        navigate("/login")
    }

    return(
        <>
            <div className="verify-email-page">

                <h1>Verify Your Email</h1>

                <p>We sent a 6-digit code to {email}</p>

                <input
                    className="verify-email-input"
                    placeholder="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <br/>

                <button
                    className="verify-email-button"
                    onClick={verifyEmail}
                >
                    Verify
                </button>

            </div>
        </>
    )
}