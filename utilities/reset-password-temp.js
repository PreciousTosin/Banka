const resetPasswordReqTemplate = data => (
  `<!DOCTYPE html>
    <html>
    
    <head>
        <title>Forget Password Email</title>
    </head>
    
    <body>
        <div>
            <h3>Dear ${data.name},</h3>
            <p>You requested for a password reset, kindly use this <a href="${data.url}">link</a> to reset your password</p>
            <br>
            <p>Cheers!</p>
        </div>
       
    </body>
    
  </html>`);

export const resetPasswordSuccessTemplate = data => (
  `<!DOCTYPE html>
    <html>
    
    <head>
        <title>Password Reset</title>
    </head>
    
    <body>
        <div>
            <h3>Dear ${data.name},</h3>
            <p>Your password has been successful reset, you can now login with your new password.</p>
            <br>
            <div>
                Cheers!
            </div>
        </div>
       
    </body>
    
    </html>`
);

export default resetPasswordReqTemplate;
