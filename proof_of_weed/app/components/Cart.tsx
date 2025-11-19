import { Product } from '../types'
import { X, ShoppingCart } from 'lucide-react'

interface CartProps {
  cart: Product[]
  removeFromCart: (productId: number) => void
  getTotalPrice: () => number
  proceedToCheckout: () => void
}

export default function Cart({ cart, removeFromCart, getTotalPrice, proceedToCheckout }: CartProps) {
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-card text-card-foreground p-6 rounded-lg shadow-xl border border-border">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <ShoppingCart size={24} className="mr-2"/>
        Your Cart
      </h2>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span>{item.name}</span>
            <div className="flex items-center space-x-2">
              <span>${item.price.toFixed(2)}</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>Fee</span>
          <span>$2.00</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>${(getTotalPrice() + 2).toFixed(2)}</span>
        </div>
      </div>
      <button 
        className="mt-4 w-full bg-primary text-white py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors"
        onClick={proceedToCheckout}
      >
        <ShoppingCart size={20} />
        <span>Proceed to Checkout</span>
      </button>
    </div>
  )
}
