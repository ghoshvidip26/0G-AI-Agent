"use client";
import { ChatBot } from "./components/ChatBot";
import Navbar from "./components/Navbar";
import { useWallet } from "./context/context";
import Landing from "./components/Landing";

export default function Home() {
  const { accountData } = useWallet();

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4">
        <div>
          {accountData.address ? <ChatBot /> : <Landing onStart={() => {}} />}
        </div>
      </main>
    </div>
  );
}
