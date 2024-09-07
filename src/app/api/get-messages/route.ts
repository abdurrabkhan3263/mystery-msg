import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnects";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import ApiResponse from "@/lib/ApiResponse";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(new ApiResponse(false, "Not Authenticated"), {
      status: 401,
    });
  }
  const userId = new mongoose.Types.ObjectId(user?._id);
  try {
    const userData = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $project: {
          messages: 1,
          hasMessages: { $gt: [{ $size: "$messages" }, 0] },
        },
      },
      {
        $facet: {
          withMessages: [
            { $match: { hasMessages: true } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
          ],
          withoutMessages: [{ $match: { hasMessages: false } }],
        },
      },
      {
        $project: {
          messages: {
            $cond: {
              if: { $gt: [{ $size: "$withMessages.messages" }, 0] },
              then: "$withMessages.messages",
              else: "$withoutMessages.messages",
            },
          },
        },
      },
    ]).exec();

    if (!userData || userData.length === 0) {
      return Response.json(new ApiResponse(false, "User not found"), {
        status: 401,
      });
    }
    return Response.json(new ApiResponse(true, userData[0].messages[0]), {
      status: 200,
    });
  } catch (error) {
    console.log(`An unexpected error ${error}`);
    return Response.json(new ApiResponse(false, "Server Internal Error"), {
      status: 500,
    });
  }
}
