"use client";
import { div } from "framer-motion/client";
import { ChatBot } from "./components/ChatBot";
import Navbar from "./components/Navbar";
import { useWallet } from "./context/context";

export default function Home() {
  const { accountData } = useWallet();

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4">
        <div>
          {accountData.address ? (
            <>
              <ChatBot />
            </>
          ) : (
            <p>Please connect your wallet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
