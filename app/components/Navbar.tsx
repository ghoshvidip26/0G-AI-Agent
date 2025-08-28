"use client";
import { useWallet } from "../context/WalletContext";

const Navbar = () => {
  const { connectWallet, accountData } = useWallet();

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          <img src="/globe.svg" alt="Logo" className="w-9 h-9 rounded-full" />
          <span className="text-2xl font-bold text-indigo-400 tracking-tight">
            TripSage
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {accountData.address ? (
            <span className="bg-indigo-600 px-4 py-2 rounded-full text-sm font-medium truncate max-w-[200px]">
              {accountData.address.slice(0, 6)}...
              {accountData.address.slice(-4)}
            </span>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
