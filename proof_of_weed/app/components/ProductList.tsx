import Image from 'next/image'
import { Dispensary, Product } from '../types'

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
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
      >
        Back to Dispensaries
      </button>
      <h2 className="text-2xl font-bold mb-4">{dispensary.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md">
            <Image src={product.image} alt={product.name} width={200} height={200} className="mb-2 rounded" />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="font-bold">${product.price.toFixed(2)}</p>
            <button 
              onClick={() => addToCart(product)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
