export interface Shop {
  _id: string
  id?: string        // Mongoose virtual alias for _id
  name: string
  description: string
  imageUri?: string
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  imageUri?: string
  shop: string | Shop
  createdAt?: string
  updatedAt?: string
}

export interface Order {
  _id: string
  name: string
  address: string
  phone: string
  quantity: number
  products: string[] | Product[]
  createdAt?: string
  updatedAt?: string
}

export interface User {
  _id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface UserShop {
  _id: string
  userName: string
  role: string
  shop: string | Shop
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CreateOrderPayload {
  name: string
  address: string
  phone: string
  quantity: number
  products: string[]
}
