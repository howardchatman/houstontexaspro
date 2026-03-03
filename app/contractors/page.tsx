import type { Metadata } from 'next'
import { contractors } from '@/lib/contractors'
import { ContractorsDirectoryClient } from './ContractorsDirectoryClient'

export const metadata: Metadata = {
  title: 'Houston Low Voltage & Security Contractors | HoustonTexasPro',
  description:
    'Browse Houston low voltage and security contractors for cameras, access control, alarm systems, and commercial security services.',
}

export default function ContractorsPage() {
  return <ContractorsDirectoryClient contractors={contractors} />
}
