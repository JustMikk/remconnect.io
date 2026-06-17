import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { AdminLeadsPage } from '@/components/admin/AdminLeadsPage'
import { getAdminLeads } from '@/lib/data/leads'

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function LeadsPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)
  const { leads, meta, noAccess, error } = await getAdminLeads(page)

  return (
    <>
      <AdminTopbar crumb="People" title="Leads" />
      <AdminLeadsPage leads={leads} meta={meta} page={page} noAccess={noAccess} error={error} />
    </>
  )
}
