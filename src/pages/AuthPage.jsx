import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect ?mode=signup or ?mode=login
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    if (mode === "signup") setIsLogin(false);
    else setIsLogin(true);
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          {/* Tabs */}
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-center font-bold ${isLogin ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center font-bold ${!isLogin ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Conditional Forms */}
          {isLogin ? (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-orange-500 text-transparent bg-clip-text">
                Welcome Back
              </h2>
              <form onSubmit={handleLogin}>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex items-center mb-6">
                  <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
                </motion.button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-orange-500 text-transparent bg-clip-text">
                Create Account
              </h2>
              <form onSubmit={handleSignUp}>
                <Input
                  icon={User}
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
                <PasswordStrengthMeter password={password} />
                <motion.button
                  className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader className="animate-spin mx-auto" /> : "Sign Up"}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
