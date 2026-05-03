import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center px-8 py-12 bg-white rounded-2xl shadow-sm">
      <p className="font-serif text-3xl tracking-widest text-stone-900 mb-2">
        Allceramic
      </p>
      <p className="text-sm text-stone-400 mb-10">
        세라믹 아티스트들의 공간
      </p>

      <GoogleLoginButton redirectTo="/" />

      <p className="mt-8 text-xs text-stone-400">
        로그인 시 서비스 이용약관에 동의하게 됩니다.
      </p>
    </div>
  )
}
