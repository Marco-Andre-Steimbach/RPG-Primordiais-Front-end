export interface OrderAttributes {
    cha: number
    con: number
    dex: number
    int: number
    str: number
    wis: number
  }
  
  export interface Order {
    id: number
    name: string
    description: string
    required_race_id: number | null
    attributes: OrderAttributes
    created_at?: string
    updated_at?: string
  }
  
  export interface PerkAttribute {
    attribute_name: string
    attribute_value: number
  }
  
  export interface Perk {
    id: number
    name: string
    description: string
    type: string
    mana_cost: number
    race_id: number | null
    order_id: number | null
    required_level: number
    flags: string[]
    attributes: PerkAttribute[]
    ability: any[]
    created_at: string
    updated_at: string
  }
  
  export interface OrdersResponse {
    orders: Order[]
  }
  
  export interface OrderResponse {
    order: Order
  }
  
  export interface OrderPerksResponse {
    perks: Perk[]
  }
  