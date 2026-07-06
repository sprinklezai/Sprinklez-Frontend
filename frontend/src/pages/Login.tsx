import { useState } from "react";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Logo from "../components/layout/Logo";

function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    console.log({
      employeeId,
      password,
      rememberMe,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Side */}

        <div className="flex items-center justify-center p-10">

          <Card className="w-full max-w-md">

            <Logo />

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-800">
                Welcome Back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to access the Executive Dashboard
              </p>

            </div>

            <Input
              label="Employee ID"
              placeholder="Enter Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="mb-8 flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-slate-600">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                Remember Me

              </label>

              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </button>

            </div>

            <Button
              fullWidth
              onClick={handleLogin}
            >
              Login
            </Button>

          </Card>

        </div>

        {/* Right Side */}

        <div className="hidden lg:block">

          <div
            className="flex h-full items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: "url('/login-bg.jpg')",
            }}
          >

            <div className="rounded-3xl bg-white/80 p-12 text-center backdrop-blur">

              <h2 className="mb-6 text-5xl font-bold text-slate-800">
                Executive Dashboard
              </h2>

              <p className="mx-auto max-w-md text-lg leading-8 text-slate-600">

                Monitor your companies, stores, brands and
                sales performance from one centralized platform.

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;