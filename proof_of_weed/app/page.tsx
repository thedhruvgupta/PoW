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

type EthereumWindow = Window & typeof globalThis & {
  ethereum?: {
    request: (args: { method: string }) => Promise<string[]>
  }
}

export default function WeedHavenApp() {
  const [selectedDispensary, setSelectedDispensary] = useState<Dispensary | null>(null)
  const [cart, setCart] = useState<Product[]>([])
  const [user, setUser] = useState<User>({ address: null, balance: null, flowBalance: null })
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

  const disconnectWallet = () => {
    setUser({ address: null, balance: null, flowBalance: null })
    setWallet(null)
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
