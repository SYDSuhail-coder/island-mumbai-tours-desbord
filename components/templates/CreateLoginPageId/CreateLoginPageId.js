"use client";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserCog } from "lucide-react";
import axios from "axios";
import { Trash } from "lucide-react";
import { useEffect } from "react";

const CreateLoginPageId = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);

  //Add api
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length !== 6) {
      setError("Password must be exactly 6 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("roleId", roleId);
    formData.append("password", password);
    const url = `/api/createLoginPageId`;
    await axios.post(url, formData);
    fetchList(page, limit);
    setName("");
    setEmail("");
    setRoleId("");
    setPassword("");
    setConfirm("");
  };

  //List api
  const fetchList = async (pageNo = page, perPage = limit) => {
    const res = await fetch(`/api/listLoginPageId?From=${pageNo}&to=${perPage}`);
    const data = await res.json();
    setList(data.data || []);
  };

  useEffect(() => {
    fetchList(page, limit);
  }, [page, limit]);

  //Delete api
  const handleDelete = async (_id) => {
  alert("Are you sure you want to delete this role?")
  await axios.delete(`/api/deleteLoginPageId/${_id}`);
  fetchList(page, limit);
};

  return (
    <section className="flex justify-between min-h-screen p-6 m-5 from-emerald-100 to-emerald-900 space-y-14">
      <div className="w-full max-w-4xl bg-gray-800  shadow-xl ring-1 ring-emerald-100 p-8 gap-3">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Create Roles Id
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-white" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-10 py-2 border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 py-2 border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-1">RoleId</label>
            <div className="relative">
              <UserCog className="absolute left-3 top-2.5 h-5 w-5 text-white" />
              <input
                type="num"
                required
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                placeholder="Enter RoleId"
                className="w-full pl-10 py-2 border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={6}
                placeholder="••••••"
                className="w-full pl-10 pr-10 py-2 border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                maxLength={6}
                placeholder="••••••"
                className="w-full pl-10 pr-10 py-2 border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex justify-center mt-2">
            <button className="w-full px-6 py-2 bg-green-300 text-black font-semibold rounded-md hover:bg-green-400 transition">
              Create Role
            </button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-4xl bg-gray-800 shadow-xl ring-1 ring-emerald-100 p-5">
        <h2 className="text-3xl font-extrabold text-white text-center mt-6">
          List Roles Id
        </h2>
        <div className="flex justify-between items-center mt-4 text-white mb-4">
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className=" w-50 h-12 bg-gray-800  border border-emerald-500  text-white text-sm
            rounded-md px-3 py-1.5 outline-nonefocus:ring-2 focus:ring-emerald-500 cursor-pointer">
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-white text-sm mt-4">
            <thead className="bg-emerald-700">
              <tr>
                <th className="p-2 text-center">Name</th>
                <th className="p-2 text-center">Email</th>
                <th className="p-2 text-center">RoleId</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-red-500">
                    No Data Found
                  </td>
                </tr>
              ) : (
                list.map((item, i) => (
                  <tr key={i} className="border-b border-emerald-400 text-center">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.email}</td>
                    <td className="p-2">{item.roleId}</td>
                    <td className="p-2 flex justify-center">
                      <Trash
                        size={18}
                        className="text-red-400 cursor-pointer hover:text-red-600"
                        onClick={() => handleDelete(item._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default CreateLoginPageId;
