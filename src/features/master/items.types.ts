export type Item = {
    id: number
    name: string
    description: string
    value: number
    element_types: number[]
    item_abilities: number[]
  }
  
  export type FetchItemsResponse = {
    items: Item[]
  }
  