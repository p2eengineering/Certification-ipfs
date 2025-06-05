"use client"
import Link from "next/link";
import React from "react";
import {  Shield, Cigarette , BlocksIcon} from "lucide-react";
import Navbar from "./components/Navbar/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
     < Navbar/>
     

      {/* Hero Section */}
      <main id="home" className="container mx-auto px-6 pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-gray-800">Certify, Verify</span>
              <br />
              <span className="text-indigo-600">& Authenticate</span>
              <br />
              <span className="text-gray-800">with ease</span>
            </h1>
            <p className="text-xl text-gray-600">
              Secure your credentials with blockchain technology using soul bound tokens (SBT) Certify.
            </p>
            <div className="flex space-x-4">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors">
              <Link href="/block">Get Started</Link>
              </button>
              <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/Certification.svg"
              alt="certificate"
              className="w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">How it works?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="bg-indigo-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Secure Blockchain</h3>
              <p className="text-indigo-200">Built on Kalp Studio Test Blockchain for robust security and efficiency.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-indigo-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Cigarette className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Soulbound Tokens</h3>
              <p className="text-indigo-200">Non-transferable digital tokens representing unique, verifiable achievements.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-indigo-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <BlocksIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Easy Verification</h3>
              <p className="text-indigo-200">Seamless certificate verification using unique blockchain Token IDs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">Powered by Kalp Studio</h2>
              <p className="text-gray-600 leading-relaxed">
                This project leverages Kalp Studios robust platform for creating seamless blockchain-based applications, ensuring security, scalability, and reliability.
              </p>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0">
              <img src="/KalpStudio.svg" alt="Kalp Studio Logo" className="w-48 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2024 Certify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;