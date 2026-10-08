"use client";

import { useState, type FormEvent } from "react";
import Button from "./button";
import { AuthInput, PasswordInput } from "./auth-input";

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [demoMessage, setDemoMessage] = useState("");

  const fullNameError = submitted && !fullName.trim() ? "Full name is required." : "";
  const emailError = submitted
    ? !email.trim()
      ? "Email is required."
      : !validEmail.test(email.trim())
        ? "Enter a valid email address."
        : ""
    : "";
  const passwordError = submitted && password.length < 8
    ? "Password must be at least 8 characters."
    : "";
  const confirmPasswordError = submitted
    ? !confirmPassword
      ? "Please confirm your password."
      : confirmPassword !== password
        ? "Passwords do not match."
        : ""
    : "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setDemoMessage("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !validEmail.test(email.trim()) ||
      password.length < 8 ||
      !confirmPassword ||
      confirmPassword !== password
    ) {
      return;
    }

    setDemoMessage("Demo only: registration is not connected yet. No account was created and no details were saved.");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSubmitted(false);
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="register-name"
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(event) => { setFullName(event.target.value); setDemoMessage(""); }}
          autoComplete="name"
          error={fullNameError}
        />
        <AuthInput
          id="register-email"
          label="Email Address"
          placeholder="you@example.com"
          inputType="email"
          value={email}
          onChange={(event) => { setEmail(event.target.value); setDemoMessage(""); }}
          autoComplete="email"
          error={emailError}
        />
        <PasswordInput
          id="register-password"
          label="Password"
          placeholder="Create a password"
          value={password}
          onChange={(event) => { setPassword(event.target.value); setDemoMessage(""); }}
          autoComplete="new-password"
          error={passwordError}
        />
        <PasswordInput
          id="register-confirm-password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(event) => { setConfirmPassword(event.target.value); setDemoMessage(""); }}
          autoComplete="new-password"
          error={confirmPasswordError}
        />
        <Button type="submit" className="mt-2 w-full">Create Account</Button>
      </form>
      <div aria-live="polite" aria-atomic="true" className="mt-4">
        {demoMessage && <p role="status" className="rounded-xl border border-primary/20 bg-[#f1f7e9] p-4 text-sm leading-6 text-primary">{demoMessage}</p>}
      </div>
    </>
  );
}
