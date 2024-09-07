"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User.model";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import ApiResponse from "@/lib/ApiResponse";
import { formatDateInTimeZone } from "@/lib/utils";
import { dateFormat } from "@/lib/utils";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { content = "", createdAt = "" } = message;
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    const result = await axios.delete<ApiResponse>(
      `/api/message-delete/${message._id}`
    );
    toast({ title: result.data?.message });
    onMessageDelete(message._id);
  };

  const formatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formateDate = formatDateInTimeZone({
    date: new Date(createdAt) as Date,
    timeZone: "Asia/Kolkata",
    formatOptions,
  });

  return (
    <Card>
      <div className="relative">
        <CardHeader>
          <CardTitle className="text-lg font-medium">{content}</CardTitle>
        </CardHeader>
        <CardFooter>
          <p className="text-sm ">{formateDate}</p>
        </CardFooter>
        <div className="absolute top-5 right-5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}

export default MessageCard;
