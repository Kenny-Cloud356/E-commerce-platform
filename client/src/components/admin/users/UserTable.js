import React from "react";
import Button from "../../common/Button";

const UserTable = ({ users, onToggleStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-50 border-b">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Joined</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{user.name}</td>
              <td className="p-3 text-gray-500">{user.email}</td>
              <td className="p-3 capitalize">{user.role}</td>
              <td className="p-3">
                <span className={`text-xs px-2 py-1 rounded-full ${user.is_active ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-3 text-gray-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
              <td className="p-3">
                <Button variant={user.is_active ? "danger" : "primary"} className="text-xs px-3 py-1"
                  onClick={() => onToggleStatus(user.id)}>
                  {user.is_active ? "Deactivate" : "Activate"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
