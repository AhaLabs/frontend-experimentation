import type { NextApiRequest, NextApiResponse } from 'next'
import { deployContracts } from '../../../contracts/scripts/deploy'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { admin, name, symbol } = req.body

  if (!admin || !name || !symbol) {
    return res.status(400).json({ error: 'Missing parameters: admin, name, symbol required' })
  }

  try {
    console.log("Calling deployContracts with", admin, name, symbol)
    await deployContracts(admin, name, symbol)

    // Si tu veux retourner un contractId ici, tu peux l'extraire du AddressBook si tu le stockes
    return res.status(200).json({ message: 'Token deployed successfully' })
  } catch (error: any) {
    console.error("Error deploying token:", error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
