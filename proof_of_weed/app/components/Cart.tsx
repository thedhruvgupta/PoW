import { Product } from '../types'

interface CartProps {
  cart: Product[]
  removeFromCart: (productId: number) => void
  getTotalPrice: () => number
  proceedToCheckout: () => void
}

export default function Cart({ cart, removeFromCart, getTotalPrice, proceedToCheckout }: CartProps) {
  return (
    <div className="mt-8 p-4 bg-white border rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cart.map(item => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>{item.name}</span>
          <div>
            <span className="mr-2">${item.price.toFixed(2)}</span>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
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
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors"
        onClick={proceedToCheckout}
      >
        Proceed to Checkout
      </button>
    </div>
  )
}
