import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const verfi = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystry message | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("Verification email sent successfully ", verfi);
    return { success: true, message: "Verification email send successfully " };
  } catch (emailError) {
    console.error("Error sending verification email ", emailError);
    return { success: false, message: "Error sending verification email" };
  }
}
