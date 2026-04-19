import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Axios from "../../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const fetchLogin = async (formData) => {
  try {
    const response = await Axios.post("/user/login", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default function LoginPage() {
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data) => {
      setUser(data.user);
      navigate("/dashboard");
    },
    onError: (error) => {
      console.log("error:", error);
    }
  })

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/bg.jpg')" }}
      >
        {/* Subtle dark overlay on the left to improve text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Bottom-left branding text */}
      <div className="absolute bottom-12 left-10 z-10 select-none">
        <h1 className="text-white text-4xl font-light tracking-wide">
          <span className="font-bold">eSanad</span> Nexus CRM
        </h1>
        <p className="text-white/70 text-base mt-1 font-light tracking-widest uppercase text-sm">
          Redefining Insurance Standards
        </p>
      </div>

      {/* Right-side frosted glass form card */}
      <div className="relative z-10 ml-auto mr-8 w-full max-w-md">
        <div
          className="rounded-3xl p-10 shadow-2xl"
          style={{
            background: "rgba(245, 243, 248, 0.72)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.55)",
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              {/* eSanad dot-grid logo mark */}
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Top row: 3 purple dots */}
                <circle cx="9" cy="9" r="4.5" fill="#7B2D8B" />
                <circle cx="19" cy="9" r="4.5" fill="#7B2D8B" />
                <circle cx="29" cy="9" r="4.5" fill="#7B2D8B" />
                {/* Middle row: person silhouettes (grey) */}
                <circle cx="9" cy="22" r="4.5" fill="#9CA3AF" />
                <circle cx="19" cy="22" r="4.5" fill="#9CA3AF" />
                {/* Bottom: person body stub */}
                <rect x="4.5" y="27" width="9" height="6" rx="3" fill="#9CA3AF" />
                <rect x="14.5" y="27" width="9" height="6" rx="3" fill="#9CA3AF" />
              </svg>
              <span className="text-2xl font-semibold text-gray-800 tracking-tight">
                e<span className="text-[#7B2D8B]">Sanad</span>
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Login to your CRM dashboard
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl bg-white/80 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus-visible:ring-[#7B2D8B] focus-visible:border-[#7B2D8B] transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-11 h-12 rounded-xl bg-white/80 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus-visible:ring-[#7B2D8B] focus-visible:border-[#7B2D8B] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7B2D8B] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(val) => setRemember(!!val)}
                  className="border-gray-400 data-[state=checked]:bg-[#7B2D8B] data-[state=checked]:border-[#7B2D8B]"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-700 cursor-pointer select-none"
                >
                  Remember
                </Label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-[#7B2D8B] hover:text-[#5a1f66] transition-colors"
              >
                Forgot?
              </button>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              className="w-full h-12 rounded-xl text-white font-semibold text-base tracking-wide mt-1 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #7B2D8B 0%, #9B3DAB 100%)",
                boxShadow: "0 4px 20px rgba(123,45,139,0.35)",
              }}
            >
              Login to Dashboard
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-7 text-center">
            <p className="text-sm text-gray-500">Need access?</p>
            <button
              type="button"
              className="text-sm font-semibold text-[#7B2D8B] hover:text-[#5a1f66] transition-colors mt-0.5"
            >
              Contact Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}