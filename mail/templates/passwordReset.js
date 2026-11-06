exports.passwordReset = (email, resetURL) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
    <style>
      body {
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        background: #ffffff;
        margin: 40px auto;
        padding: 20px;
        border-radius: 8px;
      }
      .input-box {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #ccc;
        border-radius: 5px;
        background: #f9f9f9;
      }
      .btn {
        display: block;
        padding: 12px;
        background-color: #4CAF50;
        color: white;
        text-align: center;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>

      <div class="input-box">${email}</div>
      <div class="input-box">${resetURL}</div>

      <a href="${resetURL}" class="btn">Reset Password</a>

      <p>If you didn’t request this, ignore this email.</p>
    </div>
  </body>
  </html>
  `;
};