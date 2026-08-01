"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Pencil } from "lucide-react";
import { Card, Field, Alert } from "@/components/connect/card";
import { OtpInput } from "@/components/connect/otp-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnectStore } from "@/stores/use-connect-store";
import { useConnectTenantStore } from "@/stores/use-connect-tenant-store";
import { sendSignInOtp, resendSignInOtp, verifySignInOtp, getProfile } from "@/lib/connect/connect-api";

// Real returning-partner sign-in — POST /auth/login-with-otp. Sends an actual SMS OTP via the
// configured provider, so this isn't something to exercise blindly outside a real environment.
export function SignInView() {
  const router = useRouter();
  const setIdentity = useConnectStore((s) => s.setIdentity);
  const tenant = useConnectTenantStore((s) => s.tenant);
  const setTenant = useConnectTenantStore((s) => s.setTenant);
  const tenantName = (tenant?.TENANT_NAME as string | undefined) || "Fingrid Connect";
  const tenantLogo = tenant?.TENANT_LOGO as string | undefined;

  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendSignInOtp(mobile);
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
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

  return (
    <div>
      <Card className="mx-auto mt-4 max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          {tenantLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tenantLogo} alt={tenantName} className="mb-4 h-9 max-w-[200px] object-contain" />
          ) : (
            <div className="mb-4 flex items-center gap-2">
              <span className="h-8 w-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-navy-900 to-blue-500" />
              <span className="text-base font-extrabold text-navy-900">
                Fingrid<i className="font-normal text-blue-600 not-italic">Connect</i>
              </span>
            </div>
          )}
          <h2 className="mb-1 text-2xl font-extrabold">Welcome back</h2>
          <p className="text-[13px] text-n500">Log in to your {tenantName} account</p>
        </div>

        {error && <Alert tone="error">{error}</Alert>}
        {notice && <Alert tone="warning">{notice}</Alert>}

        <form onSubmit={sendOtp}>
          <Field label="Registered mobile number" required>
            <div className="flex gap-2">
              <Input
                value={mobile}
                maxLength={10}
                required
                disabled={otpSent}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="9XXXXXXXXX"
                className="flex-1 py-3 text-[15px]"
              />
              {otpSent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOtpSent(false);
                    setError(null);
                    setNotice(null);
                  }}
                  className="gap-1.5"
                >
                  <Pencil size={13} strokeWidth={2} /> Change
                </Button>
              )}
            </div>
          </Field>
          {!otpSent && (
            <Button
              type="submit"
              variant="fgBlue"
              disabled={mobile.length !== 10 || loading}
              className="mt-2 w-full gap-1.5 py-3"
            >
              {loading ? "Sending OTP…" : (
                <>
                  Send OTP <ArrowRight size={15} strokeWidth={2} />
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

        <div className="mt-5 text-center text-[13px] text-n500">
          New to {tenantName}?{" "}
          <Link href="/connect/join" className="font-semibold underline">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}
