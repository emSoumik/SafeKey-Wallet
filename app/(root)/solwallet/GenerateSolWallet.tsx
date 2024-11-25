"use client";
import React, { useState, useEffect, useCallback } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Button } from "@/components/ui/button";
import { Eye, Trash, Copy } from "lucide-react";
import bs58 from "bs58";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
interface Props {
  mnemonic: string;
  setMnemonic: (mnemonic: string) => void;
}

interface KeypairData {
  publicKey: string;
  privateKey: string;
}

const GenerateSolWallet = React.memo(({ mnemonic, setMnemonic }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keypairs, setKeypairs] = useState<KeypairData[]>([]);
  const [showPrivateKey, setShowPrivateKey] = useState<boolean[]>([]);

  useEffect(() => {
    const storedWallets = localStorage.getItem("SolWallets");

    if (storedWallets) {
      setKeypairs(JSON.parse(storedWallets));
      setShowPrivateKey(JSON.parse(storedWallets).map(() => false));
    }
  }, []);

  const generateWallet = useCallback(async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

    const keypair = Keypair.fromSecretKey(secret);

    const newKeypair = {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
    };

    const storedWallets = JSON.parse(
      localStorage.getItem("SolWallets") || "[]"
    );

    const updatedWallets = [...storedWallets, newKeypair];
    localStorage.setItem("SolWallets", JSON.stringify(updatedWallets));

    setKeypairs((prevKeypairs) => [...prevKeypairs, newKeypair]);
    setShowPrivateKey((prevKeys) => [...prevKeys, false]);
    setCurrentIndex((prevIndex) => prevIndex + 1);
    toast.success("Wallet created", {
      duration: 2500,
    });
  }, [mnemonic, currentIndex]);

  useEffect(() => {
    const walletExists: string | null = localStorage.getItem("SolWallets");
    if (walletExists?.length === 0 || walletExists === undefined) {
      generateWallet();
    }
  }, [generateWallet]);

  const handleWalletDelete = useCallback((index: number) => {
    const storedWallets = JSON.parse(
      localStorage.getItem("SolWallets") || "[]"
    );

    const updatedWallets = storedWallets.filter(
      (_: KeypairData, i: number) => i !== index
    );
    localStorage.setItem("SolWallets", JSON.stringify(updatedWallets));

    setKeypairs(updatedWallets);
    setShowPrivateKey((prevKeys) => prevKeys.filter((_, i) => i !== index));
    toast.success("Wallet deleted", {
      duration: 2500,
    });
  }, []);

  const togglePrivateKeyVisibility = useCallback((index: number) => {
    setShowPrivateKey((prevKeys) =>
      prevKeys.map((key, i) => (i === index ? !key : key))
    );
  }, []);

  const clear = () => {
    localStorage.removeItem("SolWallets");
    localStorage.removeItem("SolMnemonic");
    setMnemonic("");
    setKeypairs([]);
    setShowPrivateKey([]);
    setCurrentIndex(0);
  };

  const handleClear = () => {
    toast.warning("Are you sure you want to delete all your wallets?", {
      action: {
        label: "Delete",
        onClick: () => clear(),
      },
      duration: 2500,
    });
  };

  const handleCopyToClipboard = (key: string) => {
    navigator.clipboard
      .writeText(key)
      .then(() => {
        toast.success("Copied to clipboard",{
          duration: 2500
      });
      })
      .catch(() => {
        toast.error("Failed to copy key",{
          duration: 2500
      });
      });
  };

  return (
    <div className="w-full flex flex-col gap-5 mt-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="w-full flex items-center justify-between max-sm:flex-col gap-4"
      >
        <h2 className="text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Your Wallets
        </h2>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => generateWallet()}
            className="copy-button text-white px-6 h-11 rounded-xl flex items-center gap-2 font-medium"
          >
            Add Wallet
          </Button>
          <Button
            onClick={() => handleClear()}
            className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-6 h-11 rounded-xl font-medium border border-white/10"
          >
            Clear All
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.75 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5"
      >
        {keypairs.map((keypair, index) => (
          <div
            key={index}
            className="flex flex-col p-4 sm:p-6 border border-white/10 bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl">
                  <Image
                    src="/solana.png"
                    alt="Solana Logo"
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-medium">Wallet {index + 1}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                onClick={() => handleWalletDelete(index)}
              >
                <Trash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-white/60">Public Key</label>
                <div
                  onClick={() => handleCopyToClipboard(keypair.publicKey)}
                  className="p-2.5 sm:p-3 bg-black/20 rounded-lg font-mono text-xs sm:text-sm cursor-pointer hover:bg-black/30 transition-colors group relative"
                >
                  <span className="text-white/80 break-all">{keypair.publicKey}</span>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-white/60">Private Key</label>
                <div className="relative">
                  <div
                    onClick={() => handleCopyToClipboard(keypair.privateKey)}
                    className="p-2.5 sm:p-3 bg-black/20 rounded-lg font-mono text-xs sm:text-sm cursor-pointer hover:bg-black/30 transition-colors group"
                  >
                    <span className="text-white/80 break-all pr-12 sm:pr-16">
                      {!showPrivateKey[index]
                        ? "*".repeat(keypair.privateKey.length)
                        : keypair.privateKey}
                    </span>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => togglePrivateKeyVisibility(index)}
                  >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
});

export default GenerateSolWallet;
