import { HomePageTitle } from '@/components/home/HomePageTitle'
import { CenterBody } from '@/components/layout/CenterBody'
import { ChainInfo } from '@/components/web3/ChainInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { GreeterContractInteractions } from '@/components/web3/GreeterContractInteractions'
import { TokenManager } from '@/components/web3/TokenContractInteraction'
import type { NextPage } from 'next'
import { useState } from 'react'
import 'twin.macro'

const HomePage: NextPage = () => {
  const [firstCo, setFirstCo] = useState(true);
  const [isCo, setCo] = useState(false);

  return (
    <>
      {/* Top Bar */}
      {/* <HomeTopBar /> */}

      <CenterBody tw="mt-20 mb-10 px-5">
        {/* Title */}
        <HomePageTitle isFirstCo={firstCo} isConnected={isCo}/>

        {/* Connect Wallet Button */}
        <ConnectButton setCo={setCo} />

        <div tw="mt-10 flex w-full flex-wrap items-start justify-center gap-4">
          {/* Chain Metadata Information */}
          <ChainInfo />
          <TokenManager isFirstCo={firstCo} setFirstCo={setFirstCo} />
          {/* Greeter Read/Write Contract Interactions */}
        </div>
      </CenterBody>
    </>
  )
}

export default HomePage
