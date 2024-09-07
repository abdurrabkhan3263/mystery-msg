import { MessageModel } from "@/model/User.model";
import dbConnect from "@/lib/dbConnects";
import { isValidObjectId } from "mongoose";
import ApiResponse from "@/lib/ApiResponse";

export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    if (!isValidObjectId(messageId)) {
      return Response.json(new ApiResponse(true, "Invalid message id", ""), {
        status: 400,
      });
    }
    return Response.json(
      new ApiResponse(true, "Message is deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    return Response.json(new ApiResponse(false, "Failed to delete message"), {
      status: 400,
    });
  }
}
