'use client'

import { useState, useEffect } from 'react'
import { User } from '../types'
import { Sun, Moon, Leaf } from 'lucide-react'

interface HeaderProps {
  user: User
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

export default function Header({ user, isConnecting, connectWallet, disconnectWallet }: HeaderProps) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-card text-card-foreground rounded-lg shadow-md mb-8">
      <div className="flex items-center space-x-2">
        <Leaf className="text-primary" size={32} />
        <h1 className="text-2xl font-bold text-foreground">Proof of Weed</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        {user.address ? (
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <p className="font-semibold">{user.address.slice(0, 6)}...{user.address.slice(-4)}</p>
              <p>{user.balance} | {user.flowBalance}</p>
            </div>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:bg-gray-400 hover:bg-primary/90 transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  )
}
