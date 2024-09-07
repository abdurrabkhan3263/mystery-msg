"use client";
import SuggestMessage from "@/components/SuggestMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";

function Page({ params }: { params: { username: string } }) {
  const [message, setMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const { toast } = useToast();

  const addMessage = async () => {
    try {
      setIsSendingMessage(true);
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username: params.username,
        content: message,
      });
      toast({ title: "Success", description: response.data.message });
      setMessage("");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to send",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <main className="container">
      <h1 className="text-center text-4xl mt-6 font-semibold">
        Public Profile Link
      </h1>
      <section className="mt-12 ">
        <p className="text-base mb-3">
          Send Anonymous Message to{" "}
          <span className="font-medium">@{params.username}</span>
        </p>
        <div>
          <Textarea
            placeholder="Write your anonymous message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="text-center mt-5">
            <Button
              onClick={addMessage}
              disabled={message.length === 0 || isSendingMessage}
            >
              Send It
            </Button>
          </div>
        </div>
      </section>
      <section className="mt-20">
        <>
          <Button
            disabled={!refresh}
            onClick={() => setRefresh((prev) => !prev)}
          >
            Suggest Messages
          </Button>
          <p className="mt-8 font-medium ">
            Click on any message below to select it
          </p>
          <div className="border rounded-xl min-h-64 p-7 mt-2">
            <p className="text-xl font-medium mb-5">Messages</p>
            <SuggestMessage
              refresh={refresh}
              setMessage={setMessage}
              setRefresh={setRefresh}
            />
          </div>
        </>
      </section>
      <footer className="mt-10 font-normal text-center">
        <p>© 2024 MystryMsg. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default Page;
