import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import UserTable from "../../components/admin/users/UserTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUsers = () => {
    setLoading(true);
    adminService.getUsers({ page, limit: 20 })
      .then(({ data }) => { setUsers(data.data); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleToggleStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      toast.success("User status updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

        {loading ? <Loader /> : (
          <>
            <div className="bg-white rounded-xl border">
              <UserTable users={users} onToggleStatus={handleToggleStatus} />
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
