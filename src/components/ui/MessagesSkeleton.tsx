import React from "react";
import { Button } from "./button";

function MessagesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Button variant={"message"} className="bg-gray-500"></Button>
      <Button variant={"message"} className="bg-gray-500"></Button>
      <Button variant={"message"} className="bg-gray-500"></Button>
    </div>
  );
}

export default MessagesSkeleton;
