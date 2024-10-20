'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ethers } from 'ethers'
import { Dispensary, PaymentResult } from '../types'
import { BrowserProvider } from 'ethers'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Types
type PaymentMethod = 'stripe' | 'crypto'

// Mock function to get USDC price (replace with actual API call later)
async function getUSDCPrice(usdAmount: number): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return usdAmount
}

// Mock function for Circle API (replace with actual API call later)
async function createCirclePayment(amount: number, destinationAddress: string): Promise<PaymentResult> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { 
    success: true,
    message: 'Payment processed successfully',
    transactionHash: '0x' + Math.random().toString(36).substr(2, 32)
  }
}

function StripeCheckoutForm({ totalAmount }: { totalAmount: number }) {
  // ... (keep the existing StripeCheckoutForm implementation)
}

function CryptoCheckoutForm({ totalAmount, dispensary }: { totalAmount: number, dispensary: Dispensary }) {
  const router = useRouter()
  const [usdcAmount, setUsdcAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchUSDCPrice = async () => {
      try {
        const price = await getUSDCPrice(totalAmount)
        setUsdcAmount(price)
      } catch (error) {
        setErrorMessage('Failed to fetch USDC price. Please try again.')
      }
    }
    fetchUSDCPrice()
  }, [totalAmount])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    
    if (!usdcAmount) {
      setErrorMessage('USDC amount not available')
      setIsLoading(false)
      return
    }

    try {
      // Check if MetaMask is installed and connected
      if (typeof window !== 'undefined' && 'ethereum' in window) {
        const provider = new BrowserProvider(window.ethereum as any)
        const signer = await provider.getSigner()
        const userAddress = await signer.getAddress()

        // Check if user has enough balance
        const balance = await provider.getBalance(userAddress)
        if (balance < ethers.parseEther(usdcAmount.toString())) {
          throw new Error('Insufficient balance')
        }

        // Send transaction
        const tx = await signer.sendTransaction({
          to: dispensary.evmAddress,
          value: ethers.parseEther(usdcAmount.toString())
        })

        // Wait for transaction to be mined
        await tx.wait()

        // Process payment through Circle
        const circlePayment = await createCirclePayment(usdcAmount, dispensary.evmAddress)

        if (circlePayment.success) {
          // Update dispensary balance
          dispensary.balance += usdcAmount
          router.push(`/confirmation?dispensaryId=${dispensary.id}&amount=${usdcAmount}&txHash=${circlePayment.transactionHash}`)
        } else {
          throw new Error(circlePayment.message)
        }
      } else {
        throw new Error('MetaMask is not installed')
      }
    } catch (error) {
      console.error('Crypto payment failed:', error)
      setErrorMessage(`Crypto payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <p className="font-bold">Total Amount: ${totalAmount.toFixed(2)}</p>
        {usdcAmount !== null ? (
          <p>USDC Amount: {usdcAmount.toFixed(2)} USDC</p>
        ) : (
          <p>Calculating USDC amount...</p>
        )}
      </div>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <button
        type="submit"
        disabled={usdcAmount === null || isLoading}
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
      >
        {isLoading ? 'Processing...' : (usdcAmount !== null ? `Pay ${usdcAmount.toFixed(2)} USDC` : 'Loading...')}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe')
  const router = useRouter()
  const [cartTotal, setCartTotal] = useState(0)
  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null)

  useEffect(() => {
    // In a real application, you would get the cart total and selected dispensary from your state management solution or API
    const mockCartTotal = 50.00
    setCartTotal(mockCartTotal + 2) // Add $2 fee
    
    // Mock dispensary data
    const mockDispensaries: Dispensary[] = [
      { id: 1, name: 'Green Leaf Dispensary', evmAddress: '0x123...', balance: 0, address: '123 Main St', rating: 4.5 },
      // Add more mock dispensaries as needed
    ]
    
    setSelectedDispensary(mockDispensaries[0]) // For this example, we'll use the first dispensary
  }, [])

  if (!selectedDispensary) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <header className="flex items-center mb-8">
        <Image src="/placeholder.svg" alt="POW Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold text-green-700 ml-2">Proof of Weed</h1>
      </header>

      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Payment Method</h2>

      <div className="mb-6 flex justify-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="stripe"
            checked={paymentMethod === 'stripe'}
            onChange={() => setPaymentMethod('stripe')}
            className="mr-2"
            aria-label="Pay with Stripe"
          />
          Pay with Stripe
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="crypto"
            checked={paymentMethod === 'crypto'}
            onChange={() => setPaymentMethod('crypto')}
            className="mr-2"
            aria-label="Pay with Crypto"
          />
          Pay with Crypto
        </label>
      </div>

      {paymentMethod === 'stripe' ? (
        <Elements stripe={stripePromise}>
          <StripeCheckoutForm totalAmount={cartTotal} />
        </Elements>
      ) : (
        <CryptoCheckoutForm totalAmount={cartTotal} dispensary={selectedDispensary} />
      )}

      <button
        onClick={() => router.push('/')}
        className="mt-6 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
      >
        Back to Cart
      </button>
    </div>
  )
}
