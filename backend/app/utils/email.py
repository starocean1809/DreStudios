import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, HtmlContent

# SendGrid Configuration
# Get the API key from environment variables (add this to Render and local .env)
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
# Ensure this email is "Verified" in your SendGrid Single Sender Verification
SENDER_EMAIL = "team.drestudios@gmail.com"

def send_otp_email(recipient_email, otp):
    subject = "Your Verification Code - Dre Studios"
    content = f"""
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1;">Email Verification</h2>
        <p>Your verification code is: <strong style="font-size: 24px; color: #1e293b;">{otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
    """
    
    message = Mail(
        from_email=SENDER_EMAIL,
        to_emails=recipient_email,
        subject=subject,
        html_content=content
    )

    try:
        if not SENDGRID_API_KEY:
            print("SENDGRID_API_KEY not found in environment variables")
            return False
            
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code in [200, 201, 202]
    except Exception as e:
        print(f"SendGrid Error: {e}")
        return False

def send_password_reset_email(recipient_email, reset_link):
    subject = "Password Reset Request - Dre Studios"
    content = f"""
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1;">Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to set a new password:</p>
        <div style="margin: 30px 0;">
            <a href="{reset_link}" style="background: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>Or copy this link: {reset_link}</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
    """

    message = Mail(
        from_email=SENDER_EMAIL,
        to_emails=recipient_email,
        subject=subject,
        html_content=content
    )

    try:
        if not SENDGRID_API_KEY:
            print("SENDGRID_API_KEY not found in environment variables")
            return False

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code in [200, 201, 202]
    except Exception as e:
        print(f"SendGrid Error: {e}")
        return False
