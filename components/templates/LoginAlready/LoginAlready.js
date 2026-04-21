"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch } from 'react-redux';
import axios from "axios";
import { deleteModules, getModules } from '../reduxForLogin/action';
import { useRouter } from "next/navigation";

const LoginAlready = () => {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length !== 6) {
      setError("Password must be exactly 6 characters long.");
      return;
    }

    setLoading(true); // ✅ loader start

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
      dispatch(getModules({
        userId: userInfo._id,
        userName: userInfo.userName,
        roleInfo: roleInfo,
        isLogin: true,
      }));

      if (userInfo.userName === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/addUsers");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
       await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
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
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white" />
              <input
                type="userName"
                required
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                placeholder="Enter your userName"
                className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password (6 Characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={6}
                placeholder="••••••"
                className="w-full pl-10 pr-10 py-2 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* ✅ Loader Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-green-300 text-black font-semibold shadow-md hover:bg-green-400 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Please wait...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginAlready;