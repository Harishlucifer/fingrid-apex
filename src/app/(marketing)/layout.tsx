import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { isConnectEnabled } from "@/lib/connect/feature-flag";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNav connectEnabled={isConnectEnabled()} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
