"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Button from "./button";
import { AuthInput, PasswordInput } from "./auth-input";

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [demoMessage, setDemoMessage] = useState("");

  const emailError = submitted
    ? !email.trim()
      ? "Email is required."
      : !validEmail.test(email.trim())
        ? "Enter a valid email address."
        : ""
    : "";
  const passwordError = submitted && !password ? "Password is required." : "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setDemoMessage("");

    if (!email.trim() || !validEmail.test(email.trim()) || !password) return;

    setDemoMessage("Demo only: authentication is not connected yet. No login details were saved and no session was created.");
    setEmail("");
    setPassword("");
    setRememberMe(false);
    setSubmitted(false);
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="login-email"
          label="Email address"
          placeholder="you@example.com"
          inputType="email"
          value={email}
          onChange={(event) => { setEmail(event.target.value); setDemoMessage(""); }}
          autoComplete="email"
          error={emailError}
        />
        <PasswordInput
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => { setPassword(event.target.value); setDemoMessage(""); }}
          autoComplete="current-password"
          error={passwordError}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 rounded border-border accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
            <span className="text-foreground">Remember me</span>
          </label>
          <Link href="/forgot-password" className="rounded font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full">Log In</Button>
      </form>
      <div aria-live="polite" aria-atomic="true" className="mt-4">
        {demoMessage && <p role="status" className="rounded-xl border border-primary/20 bg-[#f1f7e9] p-4 text-sm leading-6 text-primary">{demoMessage}</p>}
      </div>
    </>
  );
}
