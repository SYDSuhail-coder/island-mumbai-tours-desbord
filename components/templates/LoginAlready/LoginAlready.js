"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useDispatch } from 'react-redux';
import axios from "axios";
import { deleteModules, getModules } from '../reduxForLogin/action';
import { useRouter } from "next/navigation";
const LoginAlready = () => {
  const [userName, setuserName] = useState("");
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

    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("password", password);

      const res = await axios.post("/api/loginAlready", formData);
      if (res.data.statusCode !== 200) {
        setError("Invalid userName or password");
        return;
      }
      const { userInfo, roleInfo } = res.data;

      dispatch(deleteModules());
      dispatch(
        getModules({
          userId: userInfo._id,
          userName: userInfo.userName,
          roleInfo: roleInfo,
          isLogin: true,
        })
      );
      const loggedInUserName = userInfo.userName;
      if (loggedInUserName === "suhail@123") {
        router.push("/dashboard");
      } else if (loggedInUserName === "saiyadsuhail@123") {
        router.push("/createLoginPageId");
      } else {
        router.push("/liveImage");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
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

          {/* userName */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              userName Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5  text-white" />
              <input
                type="userName"
                required
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                placeholder="Enter your userName"
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
