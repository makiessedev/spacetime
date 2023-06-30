import Image from 'next/image'

import nlwLogo from '../assets/nlw-spacetime-logo.svg'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="space-y-5">
      <Image src={nlwLogo} alt="nlw-logo" />
      <div className="max-w-[420px] space-y-1">
        <h1 className="text-[40px] font-bold leading-tight text-gray-50">
          Sua cápsula do tempo
        </h1>
        <p className="text-lg leading-relaxed">
          Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
          com mundo!
        </p>
      </div>
      <Link
        href="/memories/new"
        className="font-alt inline-block rounded-full bg-green-500 px-5 py-3 text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Cadastrar lembrança
      </Link>
    </div>
  )
}
