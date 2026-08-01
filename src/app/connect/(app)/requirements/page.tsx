import type { Metadata } from "next";
import { MyRequirementsView } from "./my-requirements-view";

export const metadata: Metadata = {
  title: "My requirements",
  description: "Partnership needs you've posted to the Fingrid Connect network.",
  alternates: { canonical: "/connect/requirements" },
};

export default function ConnectMyRequirementsPage() {
  return <MyRequirementsView />;
}
