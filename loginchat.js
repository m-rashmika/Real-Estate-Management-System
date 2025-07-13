import React, { useState } from "react";

const LoginPage = () => {
  const [role, setRole] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in as:", role, email, password);
    // Implement API call for authentication
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white w-96 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium">Role</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg mt-1"
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            className="w-full p-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" 
            className="w-full p-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <button 
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
