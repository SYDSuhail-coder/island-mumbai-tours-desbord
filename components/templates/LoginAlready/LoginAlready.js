"use client";
import { useState } from "react";
import { User, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { useDispatch } from 'react-redux';
import axios from "axios";
import { useRouter } from "next/navigation";
const LoginAlready = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if (password.length !== 6) {
    setError("Password must be exactly 6 characters long.");
    return;
  }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const res = await axios.post("/api/loginAlready", formData);
    if (res.data.statusCode !== 200) {
      if (res.data.errorType === "EMAIL") {
        setError("Invalid email");
      } else if (res.data.errorType === "PASSWORD") {
        setError("Invalid password");
      } else {
        setError("Invalid email or password");
      }
      return;
    }
    const roleId = Number(res.data.roleId);
    if (roleId === 1) {
      router.push("/dashboard");
    } else if (roleId === 2) {
      router.push("/liveImage");
    } else if (roleId === 3) {
      router.push("/listImage");
     } else if (roleId === 4) {
      router.push("/createLoginPageId");
    } else {
      setError("Invalid role");
    }
    setEmail("");
    setPassword("");
};

  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1rem",
        background: "linear-gradient(177deg, #ecfdf1, #065f35)"
      }}
    >
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl ring-1 ring-emerald-100 p-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">
          Login
        </h2>
        <p className="text-center text-white text-sm mb-6">
          Join us and start your journey
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
         
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5  text-white" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none  text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium  text-white mb-1">
              Password (6 Characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5  text-white" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={6}
                placeholder="••••••"
                className="w-full pl-10 pr-10 py-2 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none  text-white"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer  text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-green-300 text-black font-semibold shadow-md hover:bg-green-400 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginAlready;
