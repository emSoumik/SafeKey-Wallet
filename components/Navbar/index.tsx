"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowTopRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const Navbar = React.memo(() => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0 }}
      className="fixed top-6 left-0 right-0 backdrop-blur-xl backdrop-saturate-30 rounded-full flex items-center justify-between min-h-10 max-w-3xl max-sm:mx-5 sm:mx-10 md:mx-auto shadow-md z-[999] px-5 py-2"
    >
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Arial' }}>
          SafeKey Wallet
        </h2>
      </div>
      <div className="flex items-center gap-8">
        <Link href="https://github.com/emSoumik" target="_blank" className="text-white hover:text-gray-300">
          <GitHubLogoIcon className="h-6 w-6 transition-transform transform hover:scale-110" />
        </Link>
        <Link href="/">
          <Button variant="ghost" className="text-white font-bold hover:bg-gray-100/90">
            Home
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
});

export default Navbar;
