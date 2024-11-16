import nodemailer from "nodemailer";

const createTransporter = (user: string, pass: string) => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: false,
    auth: {
      user,
      pass,
    },
  });
};

export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  text: string
) => {
  const transporter = createTransporter(
    process.env.EMAIL_USER as string,
    process.env.EMAIL_PASS as string
  );

  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw error;
  }
};
