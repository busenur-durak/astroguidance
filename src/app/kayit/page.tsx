import type { Metadata } from "next"
import Link from "next/link"
import { AuthForm } from "@/components/AuthForm"

export const metadata: Metadata = {
  title: "Kayıt ol"
}

const KayitPage = async ({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>
}) => {
  const params = await searchParams
  const nextPath = params.next || "/hesap"

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Hesap</p>
      <h1 className="mt-2 font-display text-5xl text-gold-soft">Kayıt ol</h1>
      <p className="mt-3 text-muted">Natal haritalarını kaydet, raporları satın al, PDF indir.</p>
      <div className="mt-8">
        <AuthForm mode="register" nextPath={nextPath} />
      </div>
      <p className="mt-6 text-sm text-muted">
        Zaten hesabın var mı?{" "}
        <Link href={`/giris?next=${encodeURIComponent(nextPath)}`} className="text-gold-soft">
          Giriş yap
        </Link>
      </p>
    </div>
  )
}

export default KayitPage
