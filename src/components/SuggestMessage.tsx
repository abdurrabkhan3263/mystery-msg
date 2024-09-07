import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import style from "./ui/style.module.css";
import axios, { AxiosError } from "axios";

function SuggestMessage({
  setMessage,
  refresh,
  setRefresh,
}: {
  setMessage: (message: string) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [intial, setInitial] = useState<boolean>(true);

  useEffect(() => {
    if (!refresh || intial) {
      setRefresh(false);
      setInitial(false);
      (async () => {
        try {
          const aiSuggestMessages = await axios.get("/api/suggest-messages");
          console.log("AI Suggest Message is:- ", aiSuggestMessages);
          const message =
            aiSuggestMessages.data?.message?.response?.candidates?.[0]?.content
              ?.parts?.[0]?.text ?? "";
          const messageArray = message.split("||");
          setMessages(messageArray);
        } catch (error) {
          setIsError(true);
        } finally {
          setTimeout(() => {
            setRefresh(true);
          }, 1000);
        }
      })();
    }
  }, [refresh]);

  if (isError) {
    return (
      <div className="text-center content-center">
        <p className="text-xl font-semibold text-red-500">
          Oops! Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {messages.length > 1 &&
          messages.map((message, index) => (
            <Button
              variant={"message"}
              onClick={(e) => setMessage((e.target as HTMLElement).innerText)}
              key={index}
              className="relative"
            >
              <p className={style.textGenAnimation}>{message}</p>
            </Button>
          ))}
      </div>
    </>
  );
}

export default SuggestMessage;
