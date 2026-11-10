"""
Bharat Udyami - Enterprise Email & Transactional OTP Service
Handles real SMTP transactional email delivery for password recovery,
account verification, and buyer notifications with enterprise HTML templates.
"""
import os
import smtplib
import re
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def is_valid_email(email):
    """Validates basic email structure."""
    if not email or not isinstance(email, str):
        return False
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return bool(re.match(pattern, email.strip()))

def get_smtp_config():
    """Retrieves and sanitizes SMTP configuration from environment variables."""
    host = os.environ.get('SMTP_HOST', '').strip()
    port = int(os.environ.get('SMTP_PORT', '587'))
    user = os.environ.get('SMTP_USER', '').strip()
    password = os.environ.get('SMTP_PASSWORD', '').strip()
    if 'gmail.com' in host and password:
        password = password.replace(' ', '')
    from_email = os.environ.get('SMTP_FROM', '').strip()
    if ('gmail.com' in host or not from_email) and user:
        from_email = user
    elif not from_email:
        from_email = 'noreply@bharatudyami.in'
    from_name = os.environ.get('SMTP_FROM_NAME', 'Bharat Udyami Security').strip()
    use_tls = os.environ.get('SMTP_USE_TLS', 'true').lower() in ['true', '1', 'yes']
    use_ssl = os.environ.get('SMTP_USE_SSL', 'false').lower() in ['true', '1', 'yes'] or port == 465

    return {
        'host': host,
        'port': port,
        'user': user,
        'password': password,
        'from_email': from_email,
        'from_name': from_name,
        'use_tls': use_tls,
        'use_ssl': use_ssl
    }

def is_smtp_configured():
    """Returns True if minimum required SMTP settings are present and non-placeholder."""
    config = get_smtp_config()
    if not config['host'] or not config['user'] or not config['password']:
        return False
    # Check if placeholder values
    if 'your-email' in config['user'] or 'your_smtp' in config['host'] or 'your_app_password' in config['password']:
        return False
    return True

def get_smtp_status():
    """Returns public safe status of SMTP service for diagnostics."""
    config = get_smtp_config()
    configured = is_smtp_configured()
    
    masked_user = ""
    if config['user'] and '@' in config['user']:
        parts = config['user'].split('@')
        name, domain = parts[0], parts[1]
        masked_user = f"{name[:2]}***@{domain}"
    elif config['user']:
        masked_user = f"{config['user'][:2]}***"

    return {
        'configured': configured,
        'host': config['host'] if configured else None,
        'port': config['port'] if configured else None,
        'sender': config['from_email'] if configured else None,
        'user_masked': masked_user if configured else None,
        'instructions': (
            "To enable live transactional emails, configure SMTP_HOST, SMTP_PORT, "
            "SMTP_USER, and SMTP_PASSWORD in backend/.env."
        ) if not configured else "SMTP service active."
    }

def send_otp_email(to_email, otp_code, recipient_name="Partner"):
    """
    Sends a genuine OTP verification email via SMTP.
    Returns: (success: bool, message: str)
    """
    if not is_valid_email(to_email):
        return False, "Invalid destination email address."

    config = get_smtp_config()
    if not is_smtp_configured():
        return False, (
            "Email service is not configured. Real SMTP credentials are required "
            "(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD) in backend/.env to send recovery emails."
        )

    sender_header = f"{config['from_name']} <{config['from_email']}>"

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f"{otp_code} is your Bharat Udyami Password Reset Code"
    msg['From'] = sender_header
    msg['To'] = to_email

    # Plain text version
    text_content = f"""
Namaste {recipient_name},

We received a request to reset your password on Bharat Udyami.

Your 6-digit verification code is:
====================================
           {otp_code}
====================================

This code will expire in 10 minutes.
If you did not request this password reset, please ignore this email. Your account credentials remain secure.

Bharat Udyami Security Team
हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।
https://bharatudyami.in
"""

    # Modern responsive HTML version
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bharat Udyami Password Reset</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" cellpadding="0" cellspacing="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 24px 32px; background: linear-gradient(135deg, #fff7ed 0%, #f0fdf4 100%); border-bottom: 2px solid #ff9933;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; color: #ff9933; letter-spacing: -0.5px;">BHARAT <span style="color: #138808;">UDYAMI</span></span>
                    <div style="font-size: 11px; color: #64748b; margin-top: 2px;">हर उद्यमी को बाज़ार, हर उत्पाद को पहचान।</div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; background-color: #ffffff; border: 1px solid #cbd5e1; color: #334155;">Account Security</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Password Reset Verification</h2>
              <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                Namaste <strong>{recipient_name}</strong>,<br>
                We received a request to recover access to your Bharat Udyami account. Use the 6-digit verification code below to verify your identity and set a new password.
              </p>

              <!-- OTP Code Display Card -->
              <div style="background-color: #f8fafc; border: 2px dashed #ff9933; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 600; margin-bottom: 8px;">Your Verification Code</div>
                <div style="font-size: 36px; font-weight: 800; color: #ff9933; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">{otp_code}</div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">⏱️ Valid for <strong>10 minutes</strong>. Never share this code.</div>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0 0 16px 0;">
                If you did not initiate this request, you can safely ignore this email. No changes will be made to your account.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 18px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                &copy; Bharat Udyami Platform &bull; Empowering Indian Artisans, Farmers & Producers.<br>
                This is an automated security transmission. Please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    msg.attach(MIMEText(text_content, 'plain'))
    msg.attach(MIMEText(html_content, 'html'))

    try:
        if config['use_ssl']:
            server = smtplib.SMTP_SSL(config['host'], config['port'], timeout=15)
        else:
            server = smtplib.SMTP(config['host'], config['port'], timeout=15)
            if config['use_tls']:
                server.starttls()

        server.login(config['user'], config['password'])
        server.send_message(msg)
        server.quit()
        return True, "OTP verification email dispatched successfully."

    except smtplib.SMTPAuthenticationError as e:
        return False, f"SMTP Authentication failed (invalid credentials): {e.smtp_error.decode() if hasattr(e, 'smtp_error') and isinstance(e.smtp_error, bytes) else str(e)}"
    except smtplib.SMTPConnectError as e:
        return False, f"Unable to connect to SMTP host {config['host']}:{config['port']}. Please verify your connection."
    except Exception as e:
        return False, f"Email delivery failed: {str(e)}"
