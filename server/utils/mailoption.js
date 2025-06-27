

export const welcomeMail= (email,name) => ({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `🎉 Welcome, ${name} !`,
      text: "",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #2c3e50;">👋 Welcome to Our Platform!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We’re excited to have you on board. Your account has been successfully created and is ready to use.</p>
        <p>Your account has been created using: ${email}</p>
        <p  style="margin-top:15px;"><em>If you did not sign up for this account, please ignore this email or <a href="#">Contact Support</a></em>.</p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #888;">This is an automated message. Please do not reply to this email.</p>
        <p style="font-size: 14px; color: #888;">© ${new Date().getFullYear()} Cyber-Soft</p>
      </div>
    </div>
  `,
    });


export const verifyMailOptions = (email,name,otp) =>({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Account Verification OTP",
      text: "",
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);">
      
      <!-- Header -->
      <div style="background-color: #2c3e50; padding: 20px 30px;">
        <h1 style="margin: 0; font-size: 24px; color: #ffffff;">Cyber-Soft</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px;">
        <h2 style="color: #2c3e50; margin-top: 0;">👀 Verify Your Account</h2>
        <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          Thank you for signing up! To complete your registration, please verify your account using the OTP below.
        </p>

        <!-- OTP Highlighted Box -->
        <div style="background-color: #f0f0f0; padding: 15px 20px; border-left: 4px solid #2c3e50; margin-left: 10px; margin-bottom: 25px;">
          <p style="margin: 0; font-size: 20px; letter-spacing: 2px; font-weight: bold; color: #2c3e50;">${otp}</p>
        </div>

        <p style="margin-left: 10px; font-size: 15px;">
          Use this OTP to verify your account. It will expire shortly for security reasons.
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #555; margin-left: 10px;">
          <em>If you did not initiate this request, please <a href="#" style="color: #2c3e50; text-decoration: underline;">contact support</a> immediately.</em>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f4f6f8; padding: 20px 30px; text-align: center;">
        <p style="font-size: 13px; color: #888; font-style: italic; margin: 0;">
          This is an automated message. Please do not reply to this email.
        </p>
        <p style="font-size: 13px; color: #888; margin: 5px 0 0;">
          &copy; ${new Date().getFullYear()} Cyber-Soft. All rights reserved.
        </p>
      </div>
    </div>
  </div>
`
,
    });





  export  const resetPasswordmailOptions= (email,name,otp) => ({
          from: process.env.SENDER_EMAIL,
          to: email,
          subject: "🔐 Account Password OTP",
          text: "",
          html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <div style="background-color: #2c3e50; padding: 20px 30px;">
            <h1 style="margin: 0; font-size: 24px; color: #ffffff;">Cyber-Soft</h1>
          </div>
    
          <!-- Body -->
          <div style="padding: 30px;">
            <h2 style="color: #2c3e50; margin-top: 0;">🔑 Password Reset OTP</h2>
            <p style="font-size: 16px; line-height: 1.6;">Hey <strong>${name}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
             To reset your password, please verify your account using the OTP below.
            </p>
    
            <!-- OTP Highlighted Box -->
            <div style="background-color: #f0f0f0; padding: 15px 20px; border-left: 4px solid #2c3e50; margin-left: 10px; margin-bottom: 25px;">
              <p style="margin: 0; font-size: 20px; letter-spacing: 2px; font-weight: bold; color: #2c3e50;">${otp}</p>
            </div>
    
            <p style="margin-left: 10px; font-size: 15px;">
              Use this OTP to reset your Password. OTP will expire in 15 minutes for security reasons.
            </p>
    
            <p style="margin-top: 30px; font-size: 14px; color: #555; margin-left: 10px;">
              <em>If you did not initiate this request, please <a href="#" style="color: #2c3e50; text-decoration: underline;">contact support</a> immediately.</em>
            </p>
          </div>
    
          <!-- Footer -->
          <div style="background-color: #f4f6f8; padding: 20px 30px; text-align: center;">
            <p style="font-size: 13px; color: #888; font-style: italic; margin: 0;">
              This is an automated message. Please do not reply to this email.
            </p>
            <p style="font-size: 13px; color: #888; margin: 5px 0 0;">
              &copy; ${new Date().getFullYear()} Cyber-Soft. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
    ,
        });