import Image from 'next/image'
import { Dispensary } from '../types'

interface DispensaryCardProps {
  dispensary: Dispensary
  onSelect: (dispensary: Dispensary) => void
}

export default function DispensaryCard({ dispensary, onSelect }: DispensaryCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <Image src="/dispensary-placeholder.jpg" alt={dispensary.name} width={200} height={200} className="mb-2 rounded" />
      <h3 className="text-xl font-semibold">{dispensary.name}</h3>
      <p>{dispensary.address}</p>
      <p>Rating: {dispensary.rating}/5</p>
      <p>Wallet Address: {dispensary.evmAddress.slice(0, 6)}...{dispensary.evmAddress.slice(-4)}</p>
      <p>Balance: {dispensary.balance} USDC</p>
      <button 
        onClick={() => onSelect(dispensary)}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors"
      >
        View Products
      </button>
    </div>
  )
}
