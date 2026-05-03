import { GNB } from '@/components/gnb/GNB'
import { AuthProvider } from '@/components/auth/AuthProvider'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GNB />
      <main className="pt-16">{children}</main>
    </AuthProvider>
  )
}
