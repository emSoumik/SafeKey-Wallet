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
import GenerateSolWallet from "@/app/(root)/solwallet/GenerateSolWallet";
import GenerateEthWallet from "@/app/(root)/ethwallet/GenerateEthWallet";
import { Input } from "../ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface WalletProps {
  wallet: string;
}

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
    <div className="flex items-start justify-start gap-3 py-3 flex-col">
      <div className=" flex gap-3 w-full justify-start flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.75 }}
          className="flex items-center justify-start gap-3"
        >
          <Button
            onClick={() => getMnemonic()}
            disabled={wallet === "solana" ? !!solMnemonic : !!ethMnemonic}
            className={`bg-white text-black hover:text-white ${
              wallet == "solana" && solMnemonic ? "hidden" : ""
            } ${wallet === "ethereum" && ethMnemonic ? "hidden" : ""}`}
          >
            Generate Wallet
          </Button>
          <Button
            onClick={() => {
              setShowMnemonicInput(!showMnemonicInput);
            }}
            className={`bg-white text-black hover:text-white ${
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
          className="w-full mt-2 flex items-center justify-center gap-2"
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
            className="border-white/50 "
          />
          <Button
            className="bg-white text-black hover:text-white"
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
          className="w-full mt-12 bg-black z-10"
        >
          <Accordion type="single" collapsible className="">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl bg-black ">
                Your Secret Phrase (Solana)
              </AccordionTrigger>
              <AccordionContent
                onClick={() => handleCopyToClipboard(solMnemonic)}
                className="bg-black flex flex-col"
              >
                <div className="grid grid-cols-3 gap-2 max-sm:gap-1">
                  {solMnemonic.split(" ").map((item) => (
                    <p
                      key={item}
                      className="border border-dark-4 text-base text-white w-full p-2 text-center uppercase rounded-lg cursor-pointer hover:bg-white bg-black z-10 hover:text-black transition-all max-sm:text-xs line-clamp-1 overflow-hidden"
                    >
                      {item}
                    </p>
                  ))}
                </div>
                <div className="flex items-center justify-start gap-1 text-zinc-600 mt-3 max-sm:text-xs">
                  <Copy className="w-4 max-sm:w-3" />
                  <p>Click anywhere on the phrases to copy.</p>
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
          className="w-full mt-12 bg-black z-10"
        >
          <Accordion type="single" collapsible className="">
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl bg-black ">
                Your Secret Phrase (Ethereum)
              </AccordionTrigger>
              <AccordionContent
                onClick={() => handleCopyToClipboard(ethMnemonic)}
                className="bg-black flex flex-col "
              >
                <div className="grid grid-cols-3 gap-2 max-sm:gap-1">
                  {ethMnemonic.split(" ").map((item) => (
                    <p
                      key={item}
                      className="border border-dark-4 text-base text-white w-full p-2 text-center uppercase rounded-lg cursor-pointer hover:bg-white bg-black z-10 hover:text-black transition-all max-sm:text-xs line-clamp-1 overflow-hidden"
                    >
                      {item}
                    </p>
                  ))}
                </div>
                <div className="flex items-center justify-start gap-1 text-zinc-600 mt-3 max-sm:text-xs">
                  <Copy className="w-4 max-sm:w-3" />
                  <p>Click anywhere on the phrases to copy.</p>
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
