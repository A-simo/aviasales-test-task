export interface Ticket {
  // Price in rubles
  price: number
  // Airline code (iata)
  carrier: string
  // An array of flights
  // In a test task, it is always a round-trip search, which means it consists of two elements
  segments: [
    {
      // City code (iata)
      origin: string
      // City code (iata)
      destination: string
      // Date and time of departure
      date: string
      // Array of codes (iata) of cities with stops
      stops: string[]
      // Total flight time in minutes
      duration: number
    },
    {
      // City code (iata)
      origin: string
      // City code (iata)
      destination: string
      // Date and time of departure
      date: string
      // Array of codes (iata) of cities with stops
      stops: string[]
      // Total flight time in minutes
      duration: number
    }
  ]
}

export interface SearchIdResponse {
  searchId: string
}
