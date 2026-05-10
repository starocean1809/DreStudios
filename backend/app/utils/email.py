import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "team.drestudios@gmail.com"
SENDER_PASSWORD = "sqbk hsod cnme qlux" 

def send_otp_email(recipient_email, otp):
    subject = "Your Verification Code - Dre Studios"
    body = f"""
    <html>
      <body>
        <h2>Email Verification</h2>
        <p>Your verification code is: <strong>{otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'html'))

    try:
        # Use SMTP_SSL for port 465
        password = SENDER_PASSWORD.replace(" ", "")
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SENDER_EMAIL, password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def send_password_reset_email(recipient_email, reset_link):
    subject = "Password Reset Request - Dre Studios"
    body = f"""
    <html>
      <body>
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <p><a href="{reset_link}">{reset_link}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'html'))

    try:
        password = SENDER_PASSWORD.replace(" ", "")
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SENDER_EMAIL, password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send reset email: {e}")
        return False
