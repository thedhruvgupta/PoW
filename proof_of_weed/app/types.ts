export type Dispensary = {
  id: number
  name: string
  address: string
  rating: number
  evmAddress: string
  balance: number
}

export type Product = {
  id: number
  name: string
  price: number
  image: string
}

export type User = {
  address: string | null
  balance: string | null
}
