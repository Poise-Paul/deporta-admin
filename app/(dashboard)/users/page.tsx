import { UserManagementStats } from "@/components/users/user-management-stats"
import { UserManagementTable } from "@/components/users/user-management-table"

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <UserManagementStats />

      {/* Users Table */}
      <UserManagementTable />
    </div>
  )
}
