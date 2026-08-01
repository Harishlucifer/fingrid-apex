import type { Metadata } from "next";
import { SignInView } from "./sign-in-view";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Fingrid Connect partner account.",
  alternates: { canonical: "/connect/login" },
};

export default function ConnectLoginPage() {
  return <SignInView />;
}
