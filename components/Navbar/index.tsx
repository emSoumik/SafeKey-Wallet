"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { RainbowButton } from "../ui/rainbow-button";
import { Button } from "../ui/button";

const Navbar = React.memo(() => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-0 right-0 backdrop-blur-xl backdrop-saturate-30 rounded-full flex items-center justify-between min-h-10 max-w-3xl max-sm:mx-5 sm:mx-10 md:mx-auto shadow-md z-[999] px-5 py-2"
    >
      <div className="flex items-center gap-4">
        <Link href="/">
          <span className="cursor-pointer text-base sm:text-xl transition-colors hover:text-gray-300">
            SafeKey Wallet
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <Link href="/" passHref>
          <Button className="hover:bg-gray-100/90 hover:text-black">
            Home
          </Button>
        </Link>

        <Link 
          href="https://github.com/emSoumik/safekey-wallet" 
          target="_blank" 
          rel="noopener noreferrer"
          passHref
        >
          <RainbowButton>
            <div className="flex items-center gap-2">
              <GitHubLogoIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </div>
          </RainbowButton>
        </Link>
      </div>
    </motion.nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
