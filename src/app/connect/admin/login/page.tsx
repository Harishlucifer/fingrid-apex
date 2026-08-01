import type { Metadata } from "next";
import { AdminLoginView } from "./admin-login-view";

export const metadata: Metadata = {
  title: "Admin sign-in",
  description: "Internal Fingrid Connect admin sign-in.",
};

export default function ConnectAdminLoginPage() {
  return <AdminLoginView />;
}
