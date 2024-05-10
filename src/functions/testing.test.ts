import { expect, test } from '@jest/globals'

import { ChainLink, EvolutionChainPage, NamedAPIResource } from '../types/pokemon-related-types'

test('testing', async () => {
  const res = await fetch('https://pokeapi.co/api/v2/evolution-chain/135/')
  const raw: EvolutionChainPage =  await res.json()
  const chain = raw.chain
  
  function getAllSpeciesFromChain(
    chain: ChainLink, 
    returnArr: { species: NamedAPIResource, depth: number }[] = [], 
    index = 0
  ) {
    returnArr.push({ species: chain.species, depth: index})
    for (const link of chain.evolves_to) {
      getAllSpeciesFromChain(link, returnArr, index + 1)
    }

    return returnArr
  }

  function getAllEvolutionChains(arr: { species: NamedAPIResource, depth: number}[]) {
    let returnObj: { 
      [k: string]: string[]
     } = {}
     
    for (const item of arr) {
      if (returnObj[`depth_${item.depth}`]) {
        returnObj[`depth_${item.depth}`] = [...returnObj[`depth_${item.depth}`], item.species.name]
      } else {
        returnObj[`depth_${item.depth}`] = [item.species.name]
      }
    }

    return returnObj
  }

  const allSpecies = getAllSpeciesFromChain(chain)
  const allEvolutionChains = getAllEvolutionChains(allSpecies)
  console.log(Object.getOwnPropertyNames(allEvolutionChains).length)
  expect(allEvolutionChains).toStrictEqual({
    depth_0: ['wurmple'],
    depth_1: ['silcoon', 'cascoon'],
    depth_2: ['beautifly', 'dustox']
  })
})