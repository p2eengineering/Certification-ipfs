"use client";
import Link from "next/link";
import { Award } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar2 = () => {
  const [network, setNetwork] = useState("Holesky");

  useEffect(() => {
    const savedNetwork = localStorage.getItem("selectedNetwork");
    if (savedNetwork) {
      setNetwork(savedNetwork);
    }
  }, []);

  const toggleNetwork = () => {
    const newNetwork = network === "Holesky" ? "KALP" : "Holesky";
    setNetwork(newNetwork);
    localStorage.setItem("selectedNetwork", newNetwork);
    window.location.reload();
  };

  return (
    <div className="py-2 px-4 bg-indigo-50 text-black">
      <div className="container mx-auto gap-4 flex justify-between items-center">
        <h1 className="text-2xl font-mono font-extrabold flex items-center justify-center gap-2 text-[#283593]">
          <Award className="h-7 w-7 text-[#283593]" />
          <Link href="/">Certify</Link>
        </h1>
        <div className="flex flex-wrap rounded-xl px-1 py-1 appearance-none">
          <div className="font-medium text-lg flex flex-row justify-between w-full transition-colors duration-500 ease-in-out">
            <Link
              href="/all-sbt"
              className="relative px-4 py-2 mx-2 hover:bg-zinc-950 transition-colors duration-200 ease-in-out hover:text-white rounded-xl font-mono font-bold"
            >
              All SBT
            </Link>
            <Link
              href="/block"
              className="relative px-4 py-2 mx-2 hover:bg-zinc-950 transition-colors duration-200 ease-in-out hover:text-white rounded-xl font-mono font-bold"
            >
              Issue/Verify SBT
            </Link>
            <Link
              href="/transfer-sbt"
              className="relative px-4 py-2 mx-2 hover:bg-zinc-950 transition-colors duration-200 ease-in-out hover:text-white rounded-xl font-mono font-bold"
            >
              Transfer SBT
            </Link>
          </div>
        </div>

        <div className="flex items-center">
        <button 
            onClick={toggleNetwork}
            className="relative inline-flex items-center bg-zinc-900 text-white font-mono rounded-full px-2 py-1.5 min-w-32"
          >
            <span 
              className={`absolute h-full bg-zinc-800 rounded-full transition-all duration-300 ease-in-out ${
                network === "KALP" ? "w-2/5 left-1/2" : "w-3/5 left-0"
              }`}
            />
            <div className="relative flex justify-between gap-6 w-full px-3">
              <span 
                className={`transition-colors duration-300 ${
                  network === "Holesky" ? "text-white" : "text-gray-500"
                }`}
              >
                Holesky
              </span>
              <span 
                className={`transition-colors duration-300 ${
                  network === "KALP" ? "text-white" : "text-gray-500"
                }`}
              >
                KALP
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar2;