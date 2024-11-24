"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import HalfCircleGradient from "./HalfCircleGradient";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import GradualSpacing from "../ui/gradual-spacing";

const Hero = React.memo(() => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const heroSection = useRef<HTMLDivElement>(null);
  const backgroundImage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroSection.current && backgroundImage.current) {
        const scrollTop = window.pageYOffset;
        const offset = scrollTop * 0.7; // Adjust the parallax effect intensity here
        backgroundImage.current.style.transform = `translateY(${offset}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center lg:py-[10%] py-[20%] text-white h-screen bg-cover bg-center"
      ref={heroSection}
    >
      <div ref={backgroundImage} style={{ backgroundImage: "url('/placeholder-background.jpg')" }} className="absolute inset-0 z-[-1] w-full h-full">
        <Image 
          src="/placeholder-background.jpg"
          alt="Background"
          priority
          fill
          className="object-cover"
        />
      </div>
      <HalfCircleGradient position="bottom" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl max-sm:h-[85vh] flex flex-col items-center justify-center gap-8 max-sm:gap-4 max-sm:px-3"
      >
        <motion.div 
          variants={itemVariants}
          className="max-w-5xl mx-auto text-center px-4 z-10"
        >
            <span className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-sm mb-6">
            Secure • Fast • Reliable
            </span>
            <GradualSpacing
            className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-blue mb-5 title"
            text="SafeKey Wallet"
            />
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Your secure gateway to Web3. Generate and manage your Ethereum and Solana wallets with confidence.
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6 flex-wrap"
        >
          <Link href="/solwallet">
            <Button className="bg-blue/60 backdrop-blur-md hover:bg-blue/90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 border border-black/10">
              Solana Wallet
            </Button>
          </Link>
          <Link href="/ethwallet">
            <Button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 border border-white/20">
              Ethereum Wallet
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
});

export default Hero;
