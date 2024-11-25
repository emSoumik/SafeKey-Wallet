"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { generateMnemonic, validateMnemonic } from "bip39";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GenerateSolWallet from "../../app/(root)/solwallet/GenerateSolWallet";
import GenerateEthWallet from "../../app/(root)/ethwallet/GenerateEthWallet";
import { Input } from "../ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface WalletProps {
  wallet: string;
}

interface SeedPhraseDisplayProps {
  phrases: string[];
  onCopy: (phrase: string) => void;
}

const SeedPhraseDisplay = ({ phrases, onCopy }: SeedPhraseDisplayProps) => (
  <motion.div 
    className="grid grid-cols-3 gap-3 p-4"
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05
        }
      }
    }}
    initial="hidden"
    animate="show"
  >
    {phrases.map((phrase, index) => (
      <motion.div
        key={index}
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 }
        }}
        className="seed-phrase-card group cursor-pointer"
        onClick={() => onCopy(phrase)}
      >
        <div className="flex items-center gap-2 relative">
          <span className="text-white/40 font-mono text-sm">{(index + 1).toString().padStart(2, '0')}</span>
          <span className="seed-phrase-word text-white/90 group-hover:text-white transition-colors">{phrase}</span>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="w-3 h-3 text-blue-500" />
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const GenerateWallet = React.memo(({ wallet }: WalletProps) => {
  const [solMnemonic, setSolMnemonic] = useState("");
  const [ethMnemonic, setEthMnemonic] = useState("");
  const [showMnemonicInput, setShowMnemonicInput] = useState(false);
  const [solInput, setSolInput] = useState("");
  const [ethInput, setEthInput] = useState("");

  const getMnemonic = useCallback(async () => {
    const secretPhrase = await generateMnemonic();
    if (wallet === "solana") {
      localStorage.setItem("SolMnemonic", secretPhrase);
      localStorage.setItem("SolWallets", "");
      setSolMnemonic(secretPhrase);
      toast.success("Seed phrase generated", {
        duration: 2500
      });
    } else if (wallet === "ethereum") {
      localStorage.setItem("EthMnemonic", secretPhrase);
      localStorage.setItem("EthWallets", "");
      setEthMnemonic(secretPhrase);
      toast.success("Seed phrase generated", {
        duration: 2500
      });
    }
  }, [wallet]);

  useEffect(() => {
    const localSol = localStorage.getItem("SolMnemonic");
    const localEth = localStorage.getItem("EthMnemonic");
    if (localSol && localSol.length > 0) {
      setSolMnemonic(localSol);
    }

    if (localEth && localEth.length > 0) {
      setEthMnemonic(localEth);
    }
  }, []);

  const handleRecover = useCallback(() => {
    if (wallet === "solana") {
      if (validateMnemonic(solInput)) {
        setSolMnemonic(solInput);
        localStorage.setItem("SolMnemonic", solInput);
        localStorage.setItem("SolWallets", "");
        setSolInput("");
        setShowMnemonicInput(false);
        toast.success("Seed phrase Valid", {
          duration: 2500
        });
      } else {
        toast.info("Seed phrase not valid", {
          duration: 2500
        });
      }
    } else if (wallet == "ethereum") {
      if (validateMnemonic(ethInput)) {
        setEthMnemonic(ethInput);
        localStorage.setItem("EthMnemonic", ethInput);
        localStorage.setItem("EthWallets", "");
        setEthInput("");
        setShowMnemonicInput(false);
        toast.success("Seed phrase Valid", {
          duration: 2500
        });
      } else {
        toast.info("Seed phrase not valid", {
          duration: 2500
        });
      }
    }
  }, [wallet, solInput, ethInput]);

  const handleCopyToClipboard = useCallback((mnemonic: string) => {
    navigator.clipboard
      .writeText(mnemonic)
      .then(() => {
        toast.success("Secret phrase copied to clipboard", {
          duration: 2500
        });
      })
      .catch(() => {
        toast.error("Failed to copy secret phrase", {
          duration: 2500
        });
      });
  }, []);

  return (
    <div className="flex items-start justify-start gap-6 py-6 flex-col">
      <div className="flex gap-4 w-full justify-start flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.75 }}
          className="flex items-center justify-start gap-3"
        >
          <Button
            onClick={() => getMnemonic()}
            disabled={wallet === "solana" ? !!solMnemonic : !!ethMnemonic}
            className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 rounded-xl px-6 py-2.5 font-medium shadow-lg ${
              wallet == "solana" && solMnemonic ? "hidden" : ""
            } ${wallet === "ethereum" && ethMnemonic ? "hidden" : ""}`}
          >
            Generate Wallet
          </Button>
          <Button
            onClick={() => {
              setShowMnemonicInput(!showMnemonicInput);
            }}
            className={`bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 rounded-xl px-6 py-2.5 font-medium ${
              wallet == "solana" && solMnemonic ? "hidden" : ""
            } ${wallet === "ethereum" && ethMnemonic ? "hidden" : ""}`}
          >
            Recover Wallet
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20, display: "none" }}
          animate={
            showMnemonicInput
              ? { opacity: 1, y: 0, display: "flex" }
              : { opacity: 0, y: -20, display: "none" }
          }
          className="w-full mt-4 flex items-center justify-center gap-3"
        >
          <Input
            onChange={(e) => {
              if (wallet === "solana") {
                setSolInput(e.target.value);
              } else if (wallet === "ethereum") {
                setEthInput(e.target.value);
              }
            }}
            value={wallet === "solana" ? solInput : ethInput}
            placeholder="Enter your seed phrase"
            className="flex-1 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder:text-white/50 focus:border-blue-500 transition-all h-12"
          />
          <Button
            className="copy-button text-white rounded-xl px-8 h-12 font-medium shadow-lg flex items-center gap-2"
            onClick={handleRecover}
          >
            Recover
          </Button>
        </motion.div>
      </div>

      {wallet === "solana" && solMnemonic && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          className="w-full mt-4"
        >
          <Accordion type="single" collapsible className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="text-xl px-6 py-4 hover:no-underline hover:bg-white/10 rounded-t-2xl font-medium">
                Your Secret Phrase (Solana)
              </AccordionTrigger>
              <AccordionContent className="bg-black/30 backdrop-blur-lg rounded-b-2xl p-4">
                <SeedPhraseDisplay 
                  phrases={solMnemonic.split(" ")} 
                  onCopy={handleCopyToClipboard}
                />
                <div className="flex items-center gap-3 mt-6 px-4">
                  <Button
                    onClick={() => handleCopyToClipboard(solMnemonic)}
                    className="copy-button text-white rounded-xl px-6 py-3 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy All Words
                  </Button>
                  <p className="text-sm text-white/60">
                    Click individual words to copy them
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      )}

      {wallet === "ethereum" && ethMnemonic && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          className="w-full mt-8 z-10"
        >
          <Accordion type="single" collapsible className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="text-xl px-8 py-4 hover:no-underline hover:bg-white/10 rounded-2xl font-medium border border-transparent hover:border-white/20 transition-all">
                Your Secret Phrase (Ethereum)
              </AccordionTrigger>
              <AccordionContent className="bg-black/40 backdrop-blur-lg rounded-b-2xl p-4">
                <SeedPhraseDisplay 
                  phrases={ethMnemonic.split(" ")} 
                  onCopy={handleCopyToClipboard}
                />
                <div className="flex items-center gap-3 mt-6 px-4">
                  <Button
                    onClick={() => handleCopyToClipboard(ethMnemonic)}
                    className="copy-button text-white rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-blue-500 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy All Words
                  </Button>
                  <p className="text-sm text-white/60">
                    Click individual words to copy them
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      )}

      {wallet === "solana" && solMnemonic && (
        <GenerateSolWallet
          mnemonic={solMnemonic}
          setMnemonic={setSolMnemonic}
        />
      )}

      {wallet === "ethereum" && ethMnemonic && (
        <GenerateEthWallet
          mnemonic={ethMnemonic}
          setMnemonic={setEthMnemonic}
        />
      )}
    </div>
  );
});

export default GenerateWallet;
