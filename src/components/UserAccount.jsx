import { useAuthStore } from "../store/authStore";

const UserAccount = () => {
  const { user } = useAuthStore();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">User Account</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user?.name || "N/A"}</p>
        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
      </div>
    </div>
  );
};

export default UserAccount;
