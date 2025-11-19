'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ethers, BrowserProvider } from 'ethers'
import { dispensaries } from '../data/mockData'
import { ArrowLeft, CreditCard, Droplets } from 'lucide-react'

// Initialize Stripe.js with the publishable key from environment variables.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Define the available payment methods.
type PaymentMethod = 'stripe' | 'crypto'

/**
 * A form component for handling Stripe credit card payments.
 * @param {object} props - The component props.
 * @param {number} props.totalAmount - The total amount to be charged.
 */
function StripeCheckoutForm({ totalAmount }: { totalAmount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setPaymentError(null)

    const cardElement = elements.getElement(CardElement)
    if (cardElement) {
      // Create a payment method using the card element.
      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (error) {
        setPaymentError(error.message || 'An error occurred')
        setIsProcessing(false)
      } else {
        // In a real application, you would send the payment method ID to your server
        // to confirm the payment. For this example, we simulate a successful payment.
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('Payment successful!')
        setIsProcessing(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border border-border rounded-md" />
      {paymentError && <div className="text-red-500 text-sm">{paymentError}</div>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:bg-gray-400"
      >
        {isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  )
}

import { Dispensary } from '../types'

/**
 * A form component for handling cryptocurrency payments via MetaMask.
 * @param {object} props - The component props.
 * @param {number} props.totalAmount - The total amount to be paid in crypto.
 * @param {Dispensary} props.dispensary - The dispensary to receive the payment.
 */
function CryptoCheckoutForm({ totalAmount, dispensary }: { totalAmount: number, dispensary: Dispensary }) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      if (!dispensary) {
        throw new Error('Dispensary not selected')
      }
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        // Send a transaction to the selected dispensary's address.
        const tx = await signer.sendTransaction({
          to: dispensary.evmAddress,
          value: ethers.parseEther(totalAmount.toString())
        });
        await tx.wait(); // Wait for the transaction to be mined.
        alert('Crypto payment successful!')
      } else {
        throw new Error('MetaMask is not installed')
      }
    } catch (error) {
      const err = error as Error
      setErrorMessage(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-center">
        <p className="font-bold">Total: ${totalAmount.toFixed(2)}</p>
        <p className="text-sm">Pay with your connected wallet</p>
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-accent text-white py-3 rounded-md hover:bg-accent/90 transition-colors disabled:bg-gray-400"
      >
        {isLoading ? 'Processing...' : 'Pay with Crypto'}
      </button>
    </div>
  )
}

/**
 * The main checkout page component.
 * It allows the user to choose between Stripe and crypto payment methods
 * and handles the checkout process accordingly.
 */
export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe')
  const router = useRouter()
  const searchParams = useSearchParams()
  const total = searchParams.get('total')
  const totalAmount = total ? parseFloat(total) : 0
  const dispensaryId = searchParams.get('dispensaryId')
  const selectedDispensary = dispensaries.find(d => d.id === Number(dispensaryId))

  if (!selectedDispensary) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Dispensary not found</h1>
          <button
            onClick={() => router.push('/')}
            className="text-primary hover:underline"
          >
            Go back to the store
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 mb-6 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

        {/* Payment method selection tabs */}
        <div className="flex justify-center border-b border-border mb-6">
          <button
            onClick={() => setPaymentMethod('stripe')}
            className={`flex items-center space-x-2 px-4 py-2 text-lg font-medium ${paymentMethod === 'stripe' ? 'border-b-2 border-primary text-primary' : ''}`}
          >
            <CreditCard size={20} />
            <span>Card</span>
          </button>
          <button
            onClick={() => setPaymentMethod('crypto')}
            className={`flex items-center space-x-2 px-4 py-2 text-lg font-medium ${paymentMethod === 'crypto' ? 'border-b-2 border-primary text-primary' : ''}`}
          >
            <Droplets size={20} />
            <span>Crypto</span>
          </button>
        </div>

        {/* Render the appropriate payment form based on the selected payment method */}
        {paymentMethod === 'stripe' ? (
          <Elements stripe={stripePromise}>
            <StripeCheckoutForm totalAmount={totalAmount} />
          </Elements>
        ) : (
          <CryptoCheckoutForm totalAmount={totalAmount} dispensary={selectedDispensary} />
        )}
      </div>
    </div>
  )
}
