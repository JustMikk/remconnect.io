import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { RolesPage } from '@/components/admin/RolesPage'
import { getRoleCategories } from '@/lib/data/roles'

export default async function RolesAndPermissionsPage() {
  const categories = await getRoleCategories().catch(() => [])

  return (
    <>
      <AdminTopbar crumb="Access control" title="Roles & permissions" />
      <RolesPage jobCategories={categories} />
    </>
  )
}
