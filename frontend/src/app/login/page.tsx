"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import PrimaryButton from "@/components/primaryButton";
import TextInput from "@/components/textInput";
import { api, handleApiError } from "@/lib/api";
import { getSafeRedirectPath } from "@/lib/authRedirect";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"));
  const registerLink =
    redirectPath === "/"
      ? "/register"
      : `/register?redirect=${encodeURIComponent(redirectPath)}`;

  const login = async () => {
    try {
      await api.auth.login({ email, password });
      window.location.href = redirectPath;
    } catch (error) {
      const message = handleApiError(error);
      console.error("Login failed:", message);
    }
  };

  return (
    <div>
      <main className="flex flex-col h-dvh gap-[32px] row-start-2 items-center dark:bg-gray-900">
        <h1 className="text-5xl dark:text-white">Login</h1>

        <form>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <TextInput
              label="Your email"
              type="email"
              placeholder="name@holynames-sea.org"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="•••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
        </div>
        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
    </div> */}
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </div>
            <label
              htmlFor="remember"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          <div className="flex items-center justify-between gap-4">
            <PrimaryButton text="Login" type="button" onClick={login} />
            <Link href={registerLink}>Create an account</Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-dvh items-center justify-center dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-400">Loading…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
