import os

import resend
from dotenv import load_dotenv
load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

def send_verification_email(email, code):

    resend.Emails.send({

        "from": "onboarding@resend.dev",

        "to": email,

        "subject": "Verify your email",

        "html": f"""

            <h2>Verify your email</h2>

            <p>Your verification code is:</p>

            <h1>{code}</h1>

            <p>This code will expire in 10 minutes.</p>

        """

    })