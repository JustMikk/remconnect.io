import { notFound } from 'next/navigation'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { AdminLeadDetail } from '@/components/admin/AdminLeadDetail'
import { getAdminLead, getLeadPermissions } from '@/lib/data/leads'

interface Props {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params
  const [lead, permissions] = await Promise.all([getAdminLead(id), getLeadPermissions()])
  if (!lead) notFound()

  const permittedUserIds = permissions.map((p) => p.userId)

  return (
    <>
      <AdminTopbar crumb="Leads" title={lead.companyName} />
      <AdminLeadDetail lead={lead} permittedUserIds={permittedUserIds} />
    </>
  )
}
