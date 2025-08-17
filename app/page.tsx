"use client";
import { useEffect, useState } from "react";
import { ChatBot } from "./components/ChatBot";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to the AI Travel Planner</h1>
      <ChatBot />
    </div>
  );
}
