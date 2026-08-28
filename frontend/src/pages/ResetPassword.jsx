import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function ResetPassword() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const email = searchParams.get("email")

    const [code, setCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    async function handleSubmit() {

        if (newPassword !== confirmPassword) {
            alert("Passwords Do Not Match!")
            return
        }

        const response = await fetch(
            `http://localhost:9000/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&new_password=${encodeURIComponent(newPassword)}`,
            {
                method: "POST"
            }
        )

        const data = await response.json()

        if (!response.ok) {
            alert(data.detail)
            return
        }
        alert("Password reset successfully!")
        navigate("/login")
    }

    return (
        <>
            <div className="reset-password-page">

                <h1>Reset Password</h1>

                <input
                    className="reset-password-input"
                    placeholder="Verification Code"
                    onChange={(e) => setCode(e.target.value)}
                />
                <br />

                <input
                    className="reset-password-input"
                    type="password"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <br />

                <input
                    className="reset-password-input"
                    type="password"
                    placeholder="Confirm New Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <br />

                <button
                    className="reset-password-button"
                    onClick={handleSubmit}
                >
                    Reset Password
                </button>

            </div>
        </>
    )
}