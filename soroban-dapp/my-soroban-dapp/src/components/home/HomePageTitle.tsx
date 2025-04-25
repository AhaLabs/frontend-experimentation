import Link from 'next/link'
import type { FC } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const StyledIconLink = styled(Link)(() => [
  tw`opacity-90 transition-all hover:(-translate-y-0.5 opacity-100)`,
])

interface HomeTitleProps {
  isFirstCo: boolean
  isConnected: boolean
}

export const HomePageTitle: FC<HomeTitleProps> = ({isFirstCo, isConnected} : HomeTitleProps) => {

  const title = 'Abundance token'
  const desc = !isConnected ? "Connect your wallet !" : isFirstCo ? "Create your token !" : 'Mint your tokens !'
  const githubHref = 'https://github.com/paltalabs/create-soroban-dapp/'

  return (
    <>
      <div tw="flex flex-col items-center text-center font-mono">
        {/* Logo & Title */}
        <Link
          href={githubHref}
          target="_blank"
          className="group"
          tw="flex cursor-pointer items-center gap-4 rounded-3xl py-1.5 px-3.5 transition-all hover:bg-gray-900"
        >
          <h1 tw="font-black text-[2.5rem]">{title}</h1>
        </Link>
      
        <p tw="mt-4 mb-6 text-gray-400">{desc}</p>

        <div tw="my-14 w-14 bg-gray-800 h-[2px]" />
      </div>
    </>
  )
}
