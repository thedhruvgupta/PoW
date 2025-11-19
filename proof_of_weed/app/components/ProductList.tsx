import Image from 'next/image'
import { Dispensary, Product } from '../types'
import { ArrowLeft } from 'lucide-react'

interface ProductListProps {
  dispensary: Dispensary
  products: Product[]
  addToCart: (product: Product) => void
  setSelectedDispensary: (dispensary: Dispensary | null) => void
}

export default function ProductList({ dispensary, products, addToCart, setSelectedDispensary }: ProductListProps) {
  return (
    <div>
      <button
        onClick={() => setSelectedDispensary(null)}
        className="flex items-center space-x-2 mb-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary"
      >
        <ArrowLeft size={16} />
        <span>Back to Dispensaries</span>
      </button>
      <h2 className="text-3xl font-bold mb-6">Products at {dispensary.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative h-48">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
