'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ethers, BrowserProvider } from 'ethers'

// Declare global interface for Ethereum provider
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>
      on: (event: string, callback: (accounts: string[]) => void) => void
      removeListener: (event: string, callback: (accounts: string[]) => void) => void
    }
  }
}

// Types
type Dispensary = {
  id: number
  name: string
  address: string
  rating: number
}

type Product = {
  id: number
  name: string
  price: number
  image: string
}

type User = {
  address: string | null
  balance: string | null
}

// Mock data
const dispensaries: Dispensary[] = [
  { id: 1, name: 'Green Leaf Dispensary', address: '123 Cannabis St, Springfield', rating: 4.5 },
  { id: 2, name: 'Herbal Bliss Dispensary', address: '456 Green Way, Rivertown', rating: 4.7 },
  { id: 3, name: 'Nature\'s Gift Dispensary', address: '789 Bud Ave, Greenfield', rating: 4.6 },
]

const products: Product[] = [
  { id: 1, name: "Blue Dream", price: 15.00, image: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "Sour Diesel", price: 12.00, image: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "OG Kush", price: 18.00, image: "/placeholder.svg?height=200&width=200" },
]

export default function WeedHavenApp() {
  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null)
  const [cart, setCart] = useState<Product[]>([])
  const [user, setUser] = useState<User>({ address: null, balance: null })

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const address = accounts[0].address
          const balance = await provider.getBalance(address)
          setUser({
            address,
            balance: ethers.formatEther(balance)
          })
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const balance = await provider.getBalance(address)
        setUser({
          address,
          balance: ethers.formatEther(balance)
        })
      } catch (error) {
        console.error('Error connecting wallet:', error)
        alert('Failed to connect wallet. Please try again.')
      }
    } else {
      alert('Please install MetaMask to use this feature.')
    }
  }

  const disconnectWallet = () => {
    setUser({ address: null, balance: null })
  }

  const addToCart = (product: Product) => {
    setCart([...cart, product])
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2)
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">WeedHaven</h1>
        {user.address ? (
          <div className="text-right">
            <p className="mb-2">Connected: {user.address.slice(0, 6)}...{user.address.slice(-4)}</p>
            <p className="mb-2">Balance: {parseFloat(user.balance || '0').toFixed(4)} ETH</p>
            <button 
              onClick={disconnectWallet}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button 
            onClick={connectWallet}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </header>

      <main>
        {selectedDispensary ? (
          <div>
            <button
              onClick={() => setSelectedDispensary(null)}
              className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Back to Dispensaries
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedDispensary.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="border p-4 rounded-lg">
                  <Image src={product.image} alt={product.name} width={200} height={200} className="mb-2 rounded" />
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="font-bold">${product.price.toFixed(2)}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded w-full"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Nearby Dispensaries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dispensaries.map(dispensary => (
                <div key={dispensary.id} className="border p-4 rounded-lg">
                  <h3 className="text-xl font-semibold">{dispensary.name}</h3>
                  <p>{dispensary.address}</p>
                  <p>Rating: {dispensary.rating}/5</p>
                  <button 
                    onClick={() => setSelectedDispensary(dispensary)}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded w-full"
                  >
                    View Products
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {cart.length > 0 && (
        <div className="mt-8 p-4 bg-white border rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <div>
                <span className="mr-2">${item.price.toFixed(2)}</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <strong>Total: ${getTotalPrice()}</strong>
          </div>
          <button 
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full"
            onClick={() => alert('Checkout functionality not implemented in this demo.')}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}