import dbConnect from "@/lib/dbConnects";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import ApiResponse from "@/lib/ApiResponse";
import { Message } from "@/model/User.model";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request: Request) {
  const { username, content } = await request.json();

  if (!content || !username) {
    return Response.json(
      new ApiResponse(false, "Content is required and username is required"),
      {
        status: 400,
      }
    );
  }

  const checking = messageSchema.safeParse({ content });

  if (!checking.success) {
    const schemaError = checking.error.errors[0].message;
    console.log("Error is occuring due to:- ");
    return Response.json(
      new ApiResponse(false, schemaError ?? "Failed to parse message"),
      {
        status: 401,
      }
    );
  }

  await dbConnect;
  try {
    const foundUser = await UserModel.findOne({ username });

    if (!foundUser) {
      return Response.json(new ApiResponse(false, "User is not found"), {
        status: 404,
      });
    }
    // is user accepting the messages
    if (!foundUser.isAcceptingMessages) {
      return Response.json(
        new ApiResponse(false, "User is not accepting messages"),
        {
          status: 404,
        }
      );
    } else {
      const newMessage = { content, createdAt: new Date() };
      foundUser.messages.push(newMessage as Message);
      await foundUser.save();
      return Response.json(new ApiResponse(true, "Success send the message"), {
        status: 201,
      });
    }
  } catch (error) {
    console.error("Error ocurring:- ", error);
    return Response.json(new ApiResponse(false, "Failed to send the message"), {
      status: 401,
    });
  }
}
