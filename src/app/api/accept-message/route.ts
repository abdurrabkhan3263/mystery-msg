import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnects";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import ApiResponse from "@/lib/ApiResponse";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(new ApiResponse(false, "Not Authenticated"), {
      status: 401,
    });
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        new ApiResponse(
          false,
          "Failed to update use status to accept messages"
        ),
        { status: 401 }
      );
    }
    return Response.json(
      new ApiResponse(true, "User status updated successfully", updatedUser),
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      new ApiResponse(false, "Failed to update use status to accept messages"),
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(new ApiResponse(false, "Not Authenticated"), {
      status: 401,
    });
  }

  const userId = user?._id;
  try {
    const findUser = await UserModel.findById(userId);
    if (!findUser) {
      return Response.json(
        new ApiResponse(false, "Failed to found this user "),
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: findUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      new ApiResponse(false, "Failed to getting message acceptance status"),
      {
        status: 500,
      }
    );
  }
}
