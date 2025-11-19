import Image from 'next/image'
import { Dispensary } from '../types'
import { Star } from 'lucide-react'

interface DispensaryCardProps {
  dispensary: Dispensary
  onSelect: (dispensary: Dispensary) => void
}

export default function DispensaryCard({ dispensary, onSelect }: DispensaryCardProps) {
  return (
    <div
      className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => onSelect(dispensary)}
    >
      <div className="relative h-48">
        <Image
          src={`https://source.unsplash.com/random/400x300?cannabis,dispensary&sig=${dispensary.id}`}
          alt={dispensary.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{dispensary.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{dispensary.address}</p>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < dispensary.rating ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="ml-2 text-sm">{dispensary.rating}/5</span>
        </div>
        <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">
          {dispensary.evmAddress.slice(0, 10)}...{dispensary.evmAddress.slice(-4)}
        </p>
        <p className="mt-2 font-semibold">{dispensary.balance} USDC</p>
        <button
          onClick={() => onSelect(dispensary)}
          className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          View Products
        </button>
      </div>
    </div>
  )
}
