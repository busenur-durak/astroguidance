import type { Metadata } from "next"
import Link from "next/link"
import { AuthForm } from "@/components/AuthForm"

export const metadata: Metadata = {
  title: "Giriş"
}

const GirisPage = async ({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>
}) => {
  const params = await searchParams
  const nextPath = params.next || "/hesap"

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Hesap</p>
      <h1 className="mt-2 font-display text-5xl text-gold-soft">Giriş yap</h1>
      <p className="mt-3 text-muted">Harita geçmişin ve satın aldığın raporlar burada durur.</p>
      <div className="mt-8">
        <AuthForm mode="login" nextPath={nextPath} />
      </div>
      <p className="mt-6 text-sm text-muted">
        Hesabın yok mu?{" "}
        <Link href={`/kayit?next=${encodeURIComponent(nextPath)}`} className="text-gold-soft">
          Kayıt ol
        </Link>
      </p>
    </div>
  )
}

export default GirisPage
