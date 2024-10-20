import { User } from '../types'

interface HeaderProps {
  user: User
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

export default function Header({ user, isConnecting, connectWallet, disconnectWallet }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8 bg-green-700 text-white p-4 rounded-lg">
      <h1 className="text-3xl font-bold">Proof of Weed</h1>
      <div>
        {user.address ? (
          <div className="flex items-center">
            <span className="mr-4">
              Address: {user.address.slice(0, 6)}...{user.address.slice(-4)}
            </span>
            <span className="mr-4">ETH Balance: {user.balance}</span>
            <span className="mr-4">FLOW Balance: {user.flowBalance}</span>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Disconnect MetaMask
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        )}
      </div>
    </header>
  )
}
