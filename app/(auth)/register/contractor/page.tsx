import { Suspense } from 'react'
import ContractorRegisterForm from './ContractorRegisterForm'

export default function ContractorRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F5]" />}>
      <ContractorRegisterForm />
    </Suspense>
  )
}
