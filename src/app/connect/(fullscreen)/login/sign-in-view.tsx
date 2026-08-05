"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Pencil, Lock, UserPlus } from "lucide-react";
import { Field, Alert } from "@/components/connect/card";
import { OtpInput } from "@/components/connect/otp-input";
import { ConnectSplitShell } from "@/components/connect/split-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectTenantStore } from "@/stores/use-connect-tenant-store";
import {
  sendSignInOtp,
  resendSignInOtp,
  verifySignInOtp,
  getProfile,
  hasConnectSession,
  SignInError,
} from "@/lib/connect/connect-api";

// Real returning-partner sign-in — POST /auth/login-with-otp. Sends an actual SMS OTP via the
// configured provider, so this isn't something to exercise blindly outside a real environment.
export function SignInView() {
  const router = useRouter();
  const setIdentity = useConnectStore((s) => s.setIdentity);
  const tenant = useConnectTenantStore((s) => s.tenant);
  const setTenant = useConnectTenantStore((s) => s.setTenant);
  const tenantName = (tenant?.TENANT_NAME as string | undefined) || "Fingrid Connect";

  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // "No account for this number" is a routing decision, not an error — it gets its own panel
  // with a Register CTA rather than a red alert the partner can't act on. Holds the number it
  // was raised for, so editing the field clears it.
  const [unregisteredMobile, setUnregisteredMobile] = useState<string | null>(null);
  // Already signed in? Skip the form entirely. This lives on the page rather than on the
  // "Community" link so it also covers bookmarks, typed URLs and the post-logout back button.
  // Renders nothing until the check runs, so a signed-in partner never sees a flash of the form.
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (hasConnectSession()) {
      router.replace("/connect/dashboard");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage, an external system
    setSessionChecked(true);
  }, [router]);

  const onMobileChange = (value: string) => {
    setMobile(value.replace(/\D/g, ""));
    setError(null);
    setNotice(null);
    setUnregisteredMobile(null);
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUnregisteredMobile(null);
    setLoading(true);
    try {
      await sendSignInOtp(mobile);
      setOtpSent(true);
    } catch (err) {
      if (err instanceof SignInError && err.code === "not_registered") {
        setUnregisteredMobile(mobile);
      } else {
        setError(err instanceof Error ? err.message : "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const verify = async (code: string) => {
    setError(null);
    setNotice(null);
    try {
      const result = await verifySignInOtp(mobile, code);
      if (result.ok) {
        if (result.tenant || result.system) setTenant({ tenant: result.tenant, system: result.system });
        const payload = {
          channelId: result.channelId != null ? String(result.channelId) : null,
          email: (result.user?.email as string) || "",
          mobile: (result.user?.mobile as string) || "",
          businessName: (result.user?.business_name as string) || "",
          partnerCode: (result.user?.partner_code as string) || "",
        };
        try {
          const p = await getProfile(result.channelId as string | number);
          Object.assign(payload, {
            entityType: (p.entity_type as string) || "",
            primaryRole: (p.primary_role as string) || "",
            name: (p.caller_name as string) || "",
          });
        } catch {
          // non-fatal — identity still mostly populated from the sign-in response above
        }
        setIdentity(payload);
        router.push("/connect/dashboard");
        return true;
      }
      if (result.pending === "registration") {
        setNotice("Your registration is still in progress — continue it to finish setting up your account.");
      } else if (result.pending === "approval") {
        setNotice("Your registration is pending Fingrid approval. You will be able to sign in once approved.");
      } else if (result.pending === "rejected") {
        setError("This registration was rejected. Contact Fingrid support for details.");
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired OTP");
      return false;
    }
  };

  if (!sessionChecked) return null;

  return (
    <ConnectSplitShell>
      {/* No logo lockup above the heading — the navy panel alongside already carries the
          Fingrid wordmark, and a second one here just repeats it. */}
      <h1 className="font-display text-navy-900 text-[clamp(27px,3.2vw,36px)] leading-[1.04] font-bold tracking-[-0.04em]">
        Welcome back to <span className="text-grad">Connect</span>.
      </h1>
      <p className="text-n500 mt-3 text-[14.5px] leading-[1.6]">
        Sign in with the mobile number registered against your {tenantName} partner account — no
        password to remember.
      </p>

      <div className="mt-7">
        {error && <Alert tone="error">{error}</Alert>}
        {notice && <Alert tone="warning">{notice}</Alert>}

          {unregisteredMobile && (
            <div className="border-warning/40 bg-warning-bg mb-3 flex gap-3 rounded-xl border p-4">
              <span className="text-warning-ink ring-warning/25 grid size-8 shrink-0 place-items-center rounded-lg bg-white ring-1">
                <UserPlus size={15} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <div className="font-display text-navy-900 text-[14px] font-semibold tracking-[-0.01em]">
                  This number is not registered with Connect
                </div>
                <p className="text-n700 mt-1 text-[12.5px] leading-[1.55]">
                  We couldn&apos;t find a {tenantName} partner account for{" "}
                  <b className="font-semibold">{unregisteredMobile}</b>. Register to get a verified
                  company identity and start being matched with lenders — or correct the number
                  above and try again.
                </p>
                <Button
                  asChild
                  variant="fgPrimary"
                  className="mt-3 h-auto gap-1.5 rounded-xl px-4 py-2.5 text-[13px]"
                >
                  <Link href="/connect/join">
                    Register now
                    <ArrowRight className="text-mint size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={sendOtp}>
            <Field label="Registered mobile number" required>
              <div className="flex gap-2">
                <Input
                  value={mobile}
                  maxLength={10}
                  required
                  inputMode="numeric"
                  autoComplete="tel-national"
                  disabled={otpSent}
                  onChange={(e) => onMobileChange(e.target.value)}
                  placeholder="9XXXXXXXXX"
                  aria-invalid={!!unregisteredMobile || undefined}
                  className="h-auto flex-1 rounded-xl px-3.5 py-3 text-[15px] tracking-[0.02em]"
                />
                {otpSent && (
                  <Button
                    type="button"
                    variant="fgGhost"
                    onClick={() => {
                      setOtpSent(false);
                      setError(null);
                      setNotice(null);
                    }}
                    className="h-auto gap-1.5 rounded-xl px-4"
                  >
                    <Pencil size={13} strokeWidth={2} /> Change
                  </Button>
                )}
              </div>
            </Field>

            {!otpSent && (
              <Button
                type="submit"
                variant="fgPrimary"
                size="cta"
                disabled={mobile.length !== 10 || loading}
                className="mt-2 w-full"
              >
                {loading ? "Sending OTP…" : (
                  <>
                    Send one-time password
                    <ArrowRight className="text-mint size-4" />
                  </>
                )}
              </Button>
            )}

            {otpSent && (
              <Field label={`OTP sent to ${mobile}`}>
                <OtpInput onVerify={verify} onResend={() => resendSignInOtp(mobile)} />
              </Field>
            )}
          </form>

        <div className="text-n400 mt-4 flex items-center gap-1.5 text-[11px]">
          <Lock size={12} strokeWidth={2.2} className="text-success" />
          OTP sign-in only — Fingrid never stores a password for your partner account.
        </div>
      </div>

      <div className="border-n200 mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        <span className="text-n500 text-[13px]">New to {tenantName}?</span>
        <Button asChild variant="fgGhost" className="h-auto gap-1.5 rounded-xl px-4 py-2.5 text-[13.5px]">
          <Link href="/connect/join">
            Create a partner account
            <ArrowRight size={14} strokeWidth={2.2} className="text-blue-500" />
          </Link>
        </Button>
      </div>
    </ConnectSplitShell>
  );
}
