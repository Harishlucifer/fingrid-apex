"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Handshake, ChevronRight, CalendarDays, Users, Landmark, Search } from "lucide-react";
import { Card, Alert, PageHeader, StatStrip, InitialAvatar } from "@/components/connect/card";
import { useConnectStore } from "@/stores/use-connect-store";
import { listPartners } from "@/lib/connect/connect-api";

// Groups counterparty entity types into three network segments so the stat strip reads as a
// meaningful breakdown of the partner network rather than one flat total.
const SEGMENT: Record<string, "sourcing" | "lending" | "service"> = {
  dsa_ind: "sourcing",
  dsa_firm: "sourcing",
  lsp: "sourcing",
  bc: "sourcing",
  nbfc: "lending",
  bank: "lending",
  hfc: "lending",
  colender: "lending",
  verif_agency: "service",
  collection_agency: "service",
  legal_agency: "service",
  property_agency: "service",
};

interface PartnerItem {
  relationship_id: string | number;
  relationship_status: string;
  relationship_type?: string;
  connected_at?: string;
  counterparty?: { channel_id?: string | number; name?: string; entity_type?: string };
}

export function PartnersView() {
  const channelId = useConnectStore((s) => s.channelId);
  const router = useRouter();
  const [items, setItems] = useState<PartnerItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId) return;
    listPartners(channelId)
      .then((raw) => setItems(((raw as { items?: PartnerItem[] }).items) || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load partners"));
  }, [channelId]);

  const seg = { sourcing: 0, lending: 0, service: 0 };
  items.forEach((p) => {
    const s = p.counterparty?.entity_type ? SEGMENT[p.counterparty.entity_type] : undefined;
    if (s) seg[s] += 1;
  });

  return (
    <div>
      <PageHeader
        icon={Handshake}
        tint="bg-success-bg"
        color="text-success-ink"
        title="My Partners"
        subtitle={items.length > 0 ? `${items.length} active partnership${items.length > 1 ? "s" : ""}` : "Organisations you've connected with"}
      />
      {error && <Alert tone="warning">{error}</Alert>}

      {items.length > 0 && (
        <StatStrip
          items={[
            { label: "Total partners", value: items.length, icon: Handshake, tint: "bg-success-bg", color: "text-success-ink" },
            { label: "Sourcing", value: seg.sourcing, icon: Search, tint: "bg-n100", color: "text-navy-900" },
            { label: "Lending", value: seg.lending, icon: Landmark, tint: "bg-blue-500/10", color: "text-blue-600" },
            { label: "Service", value: seg.service, icon: Users, tint: "bg-warning-bg", color: "text-warning-ink" },
          ]}
        />
      )}
      {items.length === 0 && !error ? (
        <Card className="flex flex-col items-center gap-2 py-12 text-center">
          <Handshake size={26} strokeWidth={1.5} className="text-n300" />
          <div className="text-sm font-semibold text-n700">No partners yet</div>
          <div className="max-w-xs text-xs text-n500">
            Accept a connect request to build your network — established partnerships show up here.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Card
              key={p.relationship_id}
              className="flex cursor-pointer flex-col transition-shadow hover:shadow-md"
              onClick={() => p.counterparty?.channel_id && router.push(`/connect/partners/${p.counterparty.channel_id}`)}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <InitialAvatar name={p.counterparty?.name} size="lg" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{p.counterparty?.name || "—"}</div>
                    <div className="truncate text-[11px] text-n500">{p.counterparty?.entity_type || p.relationship_type || "—"}</div>
                  </div>
                </div>
                <span className="flex-shrink-0 rounded-full bg-success-bg px-2 py-1 text-[10px] font-bold text-success-ink">
                  {p.relationship_status}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-n200 pt-3">
                <span className="flex items-center gap-1.5 text-[11px] text-n500">
                  <CalendarDays size={12} strokeWidth={2} /> Partners since {p.connected_at?.slice(0, 10) || "—"}
                </span>
                <ChevronRight size={15} strokeWidth={2} className="text-n300" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
