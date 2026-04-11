import React, { useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/users/profile", form);
      setUser((prev) => ({ ...prev, ...data.data }));
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/change-password", pwForm);
      setPwForm({ currentPassword: "", newPassword: "" });
      toast.success("Password changed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <section className="bg-white border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Details</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input label="Email" value={user?.email || ""} disabled className="opacity-60" />
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" />
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </section>

      <section className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input label="Current Password" type="password" value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
          <Input label="New Password" type="password" value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
          <Button type="submit">Change Password</Button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
