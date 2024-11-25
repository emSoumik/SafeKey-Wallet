"use client";
import GenerateWallet from "@/components/Wallet/GenerateWallet";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

const EthWallet = () => {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/90 via-black/90 to-black/90 backdrop-blur-xl overflow-hidden">
      <div className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-16 sm:pt-20 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 shadow-xl">
              <Image
                src="/eth.png"
                alt="Ethereum Logo"
                width={32}
                height={32}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Ethereum Wallet
            </h1>
          </div>
          <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
            Generate and manage your Ethereum wallets securely. Your keys, your crypto - all data is stored locally.
          </p>
        </motion.div>
        <GenerateWallet wallet="ethereum" />
      </div>
    </div>
  );
};

export default EthWallet;
