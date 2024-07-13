export type GetProducerArgs = {
  _id: string
}

export type CreateProducerArgs = {
  name: string
  country?: string
  region?: string
}

export type UpdateProducerArgs = {
  _id: string
  name?: string
  country?: string
  region?: string
}

export type DeleteProducerArgs = {
  _id: string
}
