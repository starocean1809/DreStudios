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
def send_order_confirmation_email(recipient_email, order_data):
    subject = f"Order Confirmation - {order_data['order_id']}"
    
    items_html = ""
    for item in order_data['items']:
        items_html += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">{item['product']['title']} (x{item['quantity']})</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹{item['total']:,.2f}</td>
        </tr>
        """

    content = f"""
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: auto;">
        <h2 style="color: #6366f1;">Thank you for your order!</h2>
        <p>Your order <strong>{order_data['order_id']}</strong> has been placed successfully.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background: #f8fafc;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Item</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Total</th>
                </tr>
            </thead>
            <tbody>
                {items_html}
            </tbody>
        </table>

        <div style="margin-top: 20px; border-top: 2px solid #eee; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #64748b;">Subtotal:</span>
                <strong style="float: right;">₹{order_data['subtotal']:,.2f}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #64748b;">GST (18%):</span>
                <strong style="float: right;">₹{order_data['gst_amount']:,.2f}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #64748b;">Shipping:</span>
                <strong style="float: right;">₹{order_data['shipping_amount']:,.2f}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 18px;">
                <span style="font-weight: bold;">Invoice Total:</span>
                <strong style="float: right; color: #6366f1;">₹{order_data['total_amount']:,.2f}</strong>
            </div>
        </div>

        <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Shipping to:</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">{order_data['shipping_address']}, {order_data['city']}, {order_data['state']} - {order_data['zip_code']}</p>
        </div>

        <p style="margin-top: 30px; text-align: center; color: #64748b; font-size: 12px;">
            You can track your order progress in your dashboard.
        </p>
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
