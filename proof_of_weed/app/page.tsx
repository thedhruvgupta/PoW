'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import Header from './components/Header'
import DispensaryList from './components/DispensaryList'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import { Dispensary, Product, User } from './types'
import { dispensaries, products } from './data/mockData'

// Define a type for the window object to include the Ethereum provider
type EthereumWindow = Window & typeof globalThis & {
  ethereum?: {
    request: (args: { method: string }) => Promise<string[]>
  }
}

/**
 * Main application component for the WeedHaven dApp.
 * This component manages the application's state, including the selected dispensary,
 * the user's cart, and the connected wallet information.
 */
export default function WeedHavenApp() {
  // State variables
  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null)
  const [cart, setCart] = useState<Product[]>([])
  const [user, setUser] = useState<User>({ address: null, balance: null, flowBalance: null })
  const [, setWallet] = useState<ethers.BrowserProvider | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  /**
   * useEffect hook to check for an existing wallet connection when the component mounts.
   * If a wallet is already connected, it retrieves the user's address and balance.
   */
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && 'ethereum' in window) {
        const ethereum = (window as EthereumWindow).ethereum;
        if (ethereum) {
          const provider = new ethers.BrowserProvider(ethereum);
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWallet(provider);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            // Mock Flow balance for now
            const flowBalance = ethers.parseEther((Math.random() * 100).toFixed(2));
            setUser({
              address: address,
              balance: `${ethers.formatEther(balance)} ETH`,
              flowBalance: `${ethers.formatEther(flowBalance)} FLOW`
            })
          }
        }
      }
    }
    checkWalletConnection()
  }, [])

  /**
   * Handles the connection to the user's Ethereum wallet (e.g., MetaMask).
   * It requests the user's accounts, retrieves the address and balance, and updates the state.
   */
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
          // Mock Flow balance for now
          const flowBalance = ethers.parseEther((Math.random() * 100).toFixed(2));
          setUser({
            address: address,
            balance: `${ethers.formatEther(balance)} ETH`,
            flowBalance: `${ethers.formatEther(flowBalance)} FLOW`
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

  /**
   * Disconnects the user's wallet by clearing the user and wallet state.
   */
  const disconnectWallet = () => {
    setUser({ address: null, balance: null, flowBalance: null })
    setWallet(null)
  }

  /**
   * Adds a product to the user's cart.
   * @param product The product to add to the cart.
   */
  const addToCart = (product: Product) => {
    setCart([...cart, product])
  }

  /**
   * Removes a product from the user's cart.
   * @param productId The ID of the product to remove from the cart.
   */
  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  /**
   * Calculates the total price of the items in the cart.
   * @returns The total price of the items in the cart.
   */
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  /**
   * Proceeds to the checkout page.
   * It checks if a wallet is connected and if the cart is not empty.
   * It then navigates to the checkout page with the total price and user's address.
   */
  const proceedToCheckout = () => {
    if (!user.address) {
      alert('Please connect your wallet before proceeding to checkout.')
      return
    }
    if (cart.length === 0) {
      alert('Your cart is empty. Please add some items before checking out.')
      return
    }
    if (!selectedDispensary) {
      alert('Please select a dispensary.')
      return
    }
    const totalPrice = getTotalPrice() + 2 // Add $2 fee
    router.push(`/checkout?total=${totalPrice.toFixed(2)}&dispensaryId=${selectedDispensary.id}`)
  }

  // Render the main application UI
  return (
    <div className="container mx-auto p-4">
      <Header 
        user={user} 
        isConnecting={isConnecting} 
        connectWallet={connectWallet} 
        disconnectWallet={disconnectWallet} 
      />
      <main>
        {selectedDispensary ? (
          <ProductList 
            dispensary={selectedDispensary} 
            products={products} 
            addToCart={addToCart} 
            setSelectedDispensary={setSelectedDispensary}
          />
        ) : (
          <DispensaryList 
            dispensaries={dispensaries} 
            setSelectedDispensary={setSelectedDispensary} 
          />
        )}
      </main>
      {cart.length > 0 && (
        <Cart 
          cart={cart} 
          removeFromCart={removeFromCart} 
          getTotalPrice={getTotalPrice} 
          proceedToCheckout={proceedToCheckout}
        />
      )}
    </div>
  )
}
