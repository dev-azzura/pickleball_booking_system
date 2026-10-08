import type { Metadata } from "next";
import Link from "next/link";
import AuthSplitLayout from "@/app/components/login-page-layout";
import RegisterForm from "@/app/components/register-form";

export const metadata: Metadata = {
  title: "Register | PickleCourt",
  description: "Create a PickleCourt account. Demo interface only; registration is not connected.",
};

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      eyebrow="Get Started"
      title="Create your account"
      description="Join PickleCourt and start exploring courts."
      brandLineOne="Join the Game."
      brandLineTwo="Own the Court."
      brandDescription="Create your account and get ready to discover your next favorite place to play."
      demoNotice="Demo mode: Registration is not connected yet. No account will be created."
      panelColor="#164A41"
      footer={<>Already have an account? <Link href="/login" className="rounded font-semibold text-[#164A41] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#164A41]">Log in</Link></>}
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
