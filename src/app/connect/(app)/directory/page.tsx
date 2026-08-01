import type { Metadata } from "next";
import { DirectoryView } from "./directory-view";

export const metadata: Metadata = {
  title: "Partner directory",
  description: "Browse and connect with organisations on the Fingrid Connect network.",
  alternates: { canonical: "/connect/directory" },
};

export default function ConnectDirectoryPage() {
  return <DirectoryView />;
}
