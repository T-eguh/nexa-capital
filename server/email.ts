import nodemailer from 'nodemailer';

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'nexa.capital.system@ethereal.email',
    pass: process.env.SMTP_PASS || 'nexaSecretKey123',
  },
});

export const sendEmailVerificationMail = async (email: string, fullName: string, token: string) => {
  const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}?verifyToken=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #38bdf8; margin: 0; font-size: 24px;">NEXA CAPITAL</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Platform Investasi Saham & Profit Harian Resmi</p>
      </div>
      
      <h2 style="color: #ffffff; font-size: 20px; font-weight: bold;">Verifikasi Alamat Email Anda</h2>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
        Halo <strong>${fullName}</strong>,<br/>
        Terima kasih telah mendaftar di Nexa Capital. Harap verifikasi alamat email Anda untuk mengaktifkan penuh fitur akun, deposit, dan penarikan instan.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyUrl}" target="_blank" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">
          Verifikasi Email Sekarang
        </a>
      </div>

      <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
        Jika tombol di atas tidak berfungsi, Anda juga dapat menyalin tautan berikut ke peramban web Anda:<br/>
        <a href="${verifyUrl}" style="color: #38bdf8; word-break: break-all;">${verifyUrl}</a>
      </p>

      <p style="color: #64748b; font-size: 12px; margin-top: 32px; border-t: 1px solid #334155; padding-top: 16px; text-align: center;">
        Tautan verifikasi ini berlaku selama 24 jam.<br/>
        © ${new Date().getFullYear()} Nexa Capital Security System. Hak Cipta Dilindungi.
      </p>
    </div>
  `;

  try {
    if (process.env.SMTP_USER) {
      await transporter.sendMail({
        from: '"Nexa Capital Security" <no-reply@nexainvest.id>',
        to: email,
        subject: '[Nexa Capital] Verifikasi Alamat Email Anda',
        html: htmlContent,
      });
    } else {
      console.log(`[SIMULATED EMAIL DISPATCH] Verification link sent to ${email}: ${verifyUrl}`);
    }
  } catch (err) {
    console.warn('Failed sending email via transporter, logged simulated output:', err);
  }
};

export const sendPasswordResetMail = async (email: string, fullName: string, token: string) => {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}?resetToken=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #f43f5e; margin: 0; font-size: 24px;">NEXA CAPITAL</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Pusat Keamanan & Pemulihan Akun</p>
      </div>

      <h2 style="color: #ffffff; font-size: 20px; font-weight: bold;">Permintaan Atur Ulang Kata Sandi</h2>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
        Halo <strong>${fullName}</strong>,<br/>
        Kami menerima permintaan untuk mengatur ulang kata sandi akun Nexa Capital Anda. Silakan klik tombol di bawah untuk memasukkan kata sandi baru Anda:
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" target="_blank" style="background-color: #e11d48; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">
          Atur Ulang Kata Sandi
        </a>
      </div>

      <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
        Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini. Akun Anda tetap aman.
      </p>

      <p style="color: #64748b; font-size: 12px; margin-top: 32px; border-t: 1px solid #334155; padding-top: 16px; text-align: center;">
        Tautan pemulihan ini berlaku selama 1 jam.<br/>
        © ${new Date().getFullYear()} Nexa Capital Security System.
      </p>
    </div>
  `;

  try {
    if (process.env.SMTP_USER) {
      await transporter.sendMail({
        from: '"Nexa Capital Security" <security@nexainvest.id>',
        to: email,
        subject: '[Nexa Capital] Instruksi Pemulihan Kata Sandi',
        html: htmlContent,
      });
    } else {
      console.log(`[SIMULATED EMAIL DISPATCH] Password reset link sent to ${email}: ${resetUrl}`);
    }
  } catch (err) {
    console.warn('Failed sending email via transporter, logged simulated output:', err);
  }
};

export const sendWelcomeMail = async (email: string, fullName: string, referralCode: string) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #10b981; margin: 0; font-size: 24px;">NEXA CAPITAL</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Selamat Datang di Ekosistem Finansial Masa Depan</p>
      </div>

      <h2 style="color: #ffffff; font-size: 20px; font-weight: bold;">Selamat Datang, ${fullName}!</h2>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
        Akun Nexa Capital Anda telah resmi terdaftar dan terverifikasi. Anda sekarang dapat mengakses berbagai instrumen investasi Fast Yield, dividen harian otomatis, serta program referral 3-level hingga 35%.
      </p>

      <div style="background-color: #1e293b; padding: 16px; border-radius: 12px; margin: 24px 0; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 6px 0; text-transform: uppercase;">Kode Referral Resmi Anda</p>
        <span style="font-size: 22px; font-weight: font-black; color: #38bdf8; letter-spacing: 2px;">${referralCode}</span>
      </div>

      <p style="color: #64748b; font-size: 12px; margin-top: 32px; border-t: 1px solid #334155; padding-top: 16px; text-align: center;">
        © ${new Date().getFullYear()} Nexa Capital System.
      </p>
    </div>
  `;

  try {
    if (process.env.SMTP_USER) {
      await transporter.sendMail({
        from: '"Nexa Capital Welcome Desk" <welcome@nexainvest.id>',
        to: email,
        subject: 'Selamat Datang di Nexa Capital!',
        html: htmlContent,
      });
    }
  } catch (err) {
    console.warn('Welcome mail log:', err);
  }
};
