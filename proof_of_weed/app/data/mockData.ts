import { Dispensary, Product } from '../types'

export const dispensaries: Dispensary[] = [
  { id: 1, name: 'Green Leaf Dispensary', address: '123 Cannabis St, Springfield', rating: 4.5, evmAddress: '0x1234567890123456789012345678901234567890', balance: 1000 },
  { id: 2, name: 'Herbal Bliss Dispensary', address: '456 Green Way, Rivertown', rating: 4.7, evmAddress: '0x2345678901234567890123456789012345678901', balance: 1500 },
  { id: 3, name: 'Nature\'s Gift Dispensary', address: '789 Bud Ave, Greenfield', rating: 4.6, evmAddress: '0x3456789012345678901234567890123456789012', balance: 2000 },
]

export const products: Product[] = [
  { id: 1, name: "Blue Dream", price: 15.00, image: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "Sour Diesel", price: 12.00, image: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "OG Kush", price: 18.00, image: "/placeholder.svg?height=200&width=200" },
]
