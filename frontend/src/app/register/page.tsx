"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PrimaryButton from "@/components/primaryButton";
import TextInput from "@/components/textInput";
import { api, handleApiError } from "@/lib/api";
import { getSafeRedirectPath } from "@/lib/authRedirect";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"));
  const loginLink =
    redirectPath === "/"
      ? "/login"
      : `/login?redirect=${encodeURIComponent(redirectPath)}`;

  const register = async () => {
    if (password !== confirm || !agree) {
      console.error(
        "Password and Confirm Password do not match or Terms not agreed."
      );
      return;
    }
    try {
      await api.auth.register({ name, email, password });
      window.location.href = redirectPath;
    } catch (error) {
      const message = handleApiError(error);
      console.error("Registration failed:", message);
    }
  };
  return (
    <div>
      <main className="flex flex-col h-dvh gap-[32px] row-start-2 items-center dark:bg-neutral-700">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="self-start ml-4 mt-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-5xl dark:text-white">Sign Up</h1>

        <form>
          <div className="grid gap-6 mb-6 md:grid-cols-1">
            <TextInput
              label="Name"
              type="name"
              placeholder="Holly Academy"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <TextInput
              label="Confirm Password"
              type="password"
              placeholder="•••••••••"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="agree"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-neutral-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            </div>
            <label
              htmlFor="agree"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              I agree with the{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
              .
            </label>
          </div>
          <div className="flex items-center justify-between gap-4">
            <PrimaryButton text="Register" type="button" onClick={register} />
            <Link href={loginLink}>Already have an account? Login</Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-dvh items-center justify-center dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-400">Loading…</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
