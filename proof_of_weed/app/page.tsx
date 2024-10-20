'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ethers } from 'ethers'

// Types
type Dispensary = {
  id: number
  name: string
  address: string
  rating: number
  evmAddress: string
  balance: number
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
  { id: 1, name: 'Green Leaf Dispensary', address: '123 Cannabis St, Springfield', rating: 4.5, evmAddress: '0x1234567890123456789012345678901234567890', balance: 1000 },
  { id: 2, name: 'Herbal Bliss Dispensary', address: '456 Green Way, Rivertown', rating: 4.7, evmAddress: '0x2345678901234567890123456789012345678901', balance: 1500 },
  { id: 3, name: 'Nature\'s Gift Dispensary', address: '789 Bud Ave, Greenfield', rating: 4.6, evmAddress: '0x3456789012345678901234567890123456789012', balance: 2000 },
]

const products: Product[] = [
  { id: 1, name: "Blue Dream", price: 15.00, image: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "Sour Diesel", price: 12.00, image: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "OG Kush", price: 18.00, image: "/placeholder.svg?height=200&width=200" },
]

// Add this type definition at the top of your file, after the existing type definitions
type EthereumWindow = Window & typeof globalThis & {
  ethereum?: {
    request: (args: { method: string }) => Promise<string[]>
  }
}

export default function WeedHavenApp() {
  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null)
  const [cart, setCart] = useState<Product[]>([])
  const [user, setUser] = useState<User>({ address: null, balance: null })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [wallet, setWallet] = useState<ethers.BrowserProvider | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && 'ethereum' in window) {
        const ethereum = (window as EthereumWindow).ethereum;
        if (ethereum) {
          const provider = new ethers.BrowserProvider(ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setWallet(provider);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            setUser({
              address: address,
              balance: `${ethers.formatEther(balance)} ETH`
            })
          }
        }
      }
    }
    checkWalletConnection()
  }, [])
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && 'ethereum' in window) {
      try {
        setIsConnecting(true)
        const ethereum = (window as EthereumWindow).ethereum;
        if (ethereum) {
          await ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.BrowserProvider(ethereum)
          setWallet(provider)
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          const balance = await provider.getBalance(address)
          setUser({
            address: address,
            balance: `${ethers.formatEther(balance)} ETH`
          })
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      } finally {
        setIsConnecting(false)
      }
    } else {
      alert('Please install MetaMask to use this feature')
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
    return cart.reduce((total, item) => total + item.price, 0)
  }

  const proceedToCheckout = () => {
    if (!user.address) {
      alert('Please connect your wallet before proceeding to checkout.')
      return
    }
    if (cart.length === 0) {
      alert('Your cart is empty. Please add some items before checking out.')
      return
    }
    const totalPrice = getTotalPrice() + 2 // Add $2 fee
    router.push(`/checkout?total=${totalPrice.toFixed(2)}&address=${user.address}`)
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">Proof of Weed</h1>
        <div>
          {user.address ? (
            <div className="flex items-center">
              <span className="mr-4">
                Address: {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </span>
              <span className="mr-4">Balance: {user.balance}</span>
              <button
                onClick={disconnectWallet}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Disconnect MetaMask
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          )}
        </div>
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
            <strong>Subtotal: ${getTotalPrice().toFixed(2)}</strong>
          </div>
          <div className="mt-2">
            <strong>Fee: $2.00</strong>
          </div>
          <div className="mt-2">
            <strong>Total: ${(getTotalPrice() + 2).toFixed(2)}</strong>
          </div>
          <button 
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full"
            onClick={proceedToCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}
