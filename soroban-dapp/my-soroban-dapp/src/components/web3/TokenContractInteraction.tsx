import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useSorobanReact } from '@soroban-react/core'
import { deployContracts } from "../../../contracts/scripts/deploy"
import 'twin.macro'

type TokenInitForm = {
  name: string
  symbol: string
  decimal: number
}

export const TokenManager: FC = () => {
  const [isDeploying, setIsDeploying] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { address } = useSorobanReact()
  const { register, handleSubmit } = useForm<TokenInitForm>()
    console.log(address)

  const deployToken = async (data: TokenInitForm) => {
    let deployTok;
     try {
        //await deployContracts(address ? address : "GARDX3Y5SJPWQC25MCV2ROTAFQ5BOTV7O7ZC26JHQY2YNBWZDIEYB4AC", data.name, data.symbol)
        await fetch('/api/deploy-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin: address, name: data.name, symbol: data.symbol })
          })
     }
     catch (err){
         console.log(err)
     }
    console.log(deployTok)
  }

  return (
    <div tw="flex grow flex-col space-y-4 max-w-[22rem]">
      <h2 tw="text-center font-mono text-gray-400">Token Management</h2>
      <Card variant="outline" p={4} bgColor="whiteAlpha.100">
        {!showForm ? (
          <Stack spacing={4}>
            <p tw="text-center font-mono text-sm">No token found yet. Create yours to get started.</p>
            <Button onClick={() => setShowForm(true)} colorScheme="green">
              Create my token
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleSubmit(deployToken)}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Token Name</FormLabel>
                <Input {...register("name")} required />
              </FormControl>
              <FormControl>
                <FormLabel>Token Symbol</FormLabel>
                <Input {...register("symbol")} required />
              </FormControl>
              <FormControl>
                <FormLabel>Decimals</FormLabel>
                <Input type="number" {...register("decimal")} required min={0}  />
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={isDeploying}
                disabled={isDeploying}
              >
                Deploy Token
              </Button>
            </Stack>
          </form>
        )}
      </Card>
    </div>
  )
}
