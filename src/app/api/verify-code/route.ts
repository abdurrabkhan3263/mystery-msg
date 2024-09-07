import dbConnect from "@/lib/dbConnects";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { code, username } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    // check schema using zod
    const result = verifySchema.safeParse({ code });
    if (!result.success) {
      const schemaError = result.error.format().code?._errors || [];
      return Response.json(
        {
          status: false,
          message:
            schemaError?.length > 0
              ? schemaError.join(", ")
              : "Invalid verification code",
        },
        { status: 400 }
      );
    }
    const requestedUser = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!requestedUser)
      return Response.json(
        {
          status: false,
          message: "User is not found",
        },
        { status: 400 }
      );

    //   Checking condition
    const isCodeValid = code === requestedUser.verifyCode;
    const isCodeNotExpired =
      new Date(requestedUser.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      //   updating user data
      requestedUser.isVerified = true;
      await requestedUser.save();

      return Response.json(
        {
          status: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          status: false,
          message: "Invalid verify code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          status: false,
          message:
            "Verification code has expired please signup again to get a new code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
