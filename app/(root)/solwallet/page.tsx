'use client'
import GenerateWallet from '@/components/Wallet/GenerateWallet'
import { motion } from 'framer-motion'
import React from 'react'

const SolWallet = () => {
  return (
    <div className='p-16 max-w-4xl mx-auto mt-16 max-sm:p-6 max-sm:py-14'>
      <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className='font-glancyr text-5xl'>Solana Wallets</motion.h1>
      <GenerateWallet wallet="solana"/>
    </div>
  )
}

export default SolWallet