"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ENTITY_TYPES,
  demoRequestSchema,
  submitDemoRequest,
  type DemoRequest,
} from "@/lib/demo-request";
import { useVisitorStore } from "@/stores/use-visitor-store";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-danger mt-1 text-[13px]">{message}</p>;
}

// Contact block content, kept beside the form it belongs to.
const CONTACT_DETAILS = [
  { label: "Email", value: "sreedhar@fingrid.ai", href: "mailto:sudharson@loanwiser.in", icon: Mail },
  { label: "Phone", value: "+91 88835 65000", href: "tel:+918883565000", icon: Phone },
  {
    label: "Location",
    value: "C6, Lacasa Apartment, GRG Nagar, Coimbatore 641014, India",
    href: undefined,
    icon: MapPin,
  },
] as const;

/** Mandatory marker, so the asterisk is never hand-typed inconsistently. */
function Req() {
  return (
    <span aria-hidden="true" className="text-danger">
      {" *"}
    </span>
  );
}

const EMPTY: DemoRequest = {
  name: "",
  email: "",
  phone: "",
  company: "",
  entityType: "NBFC / Bank",
  message: "",
};

/**
 * The `#demo` target that every "Book a demo" call to action points at.
 * Submits through TanStack Query; the visitor's entity type is remembered in
 * the persisted Zustand store so a repeat visit arrives prefilled.
 */
export function DemoForm() {
  const entityType = useVisitorStore((s) => s.entityType);
  const setEntityType = useVisitorStore((s) => s.setEntityType);
  const lastReference = useVisitorStore((s) => s.lastReference);
  const setLastReference = useVisitorStore((s) => s.setLastReference);

  const form = useForm<DemoRequest>({
    resolver: zodResolver(demoRequestSchema),
    defaultValues: { ...EMPTY, entityType: entityType ?? EMPTY.entityType },
  });

  const mutation = useMutation({
    mutationFn: submitDemoRequest,
    onSuccess: (result, values) => {
      setLastReference(result.reference);
      setEntityType(values.entityType);
      form.reset({ ...EMPTY, entityType: values.entityType });
      toast.success("Demo request received", {
        description: `We'll be in touch within one business day. Reference ${result.reference}.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Couldn't send that", { description: error.message });
    },
  });

  const errors = form.formState.errors;
  // useWatch subscribes without returning an unmemoizable watch() function.
  const selectedEntity = useWatch({
    control: form.control,
    name: "entityType",
  });

  return (
    <section
      id="demo"
      className="scroll-mt-24 pt-1.5 pb-[clamp(30px,4.6vw,52px)]"
    >
      <div className="wrap">
        <div className="grid gap-8 rounded-[26px] border border-n200 bg-white p-[clamp(26px,4vw,46px)] shadow-[0_16px_48px_rgb(1_39_86_/_0.07)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-success-bg px-3 py-1.5 text-[10.5px] font-semibold text-success-ink">
              <span className="size-1.5 rounded-full bg-success" />
              Tailored working session
            </div>
            <h3 className="font-display mb-2 text-[27px] font-semibold tracking-[-0.03em]">
              Get in Touch
            </h3>
            <p className="text-[14.5px] leading-[1.7] text-n500">
              Ready to build the future of collaborative lending? Our team is
              here to help you get started with Fingrid&apos;s Operating Fabric.
            </p>

            <dl className="mt-6 grid gap-4">
              {CONTACT_DETAILS.map((detail) => (
                <div key={detail.label} className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
                    <detail.icon size={16} strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-n400 text-[10px] font-semibold tracking-[0.08em] uppercase">
                      {detail.label}
                    </dt>
                    <dd className="text-navy-900 mt-0.5 text-[14px] font-semibold">
                      {detail.href ? (
                        <a href={detail.href} className="hover:text-blue-600 transition-colors">
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            {lastReference ? (
              <p className="bg-success-bg text-success-ink mt-4 rounded-lg px-3.5 py-2.5 text-[13.5px]">
                Your last request reference is{" "}
                <span className="font-mono font-semibold">{lastReference}</span>
                .
              </p>
            ) : null}
          </div>

          <form
            noValidate
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="grid gap-4 rounded-[20px] border border-n200/80 bg-n50/70 p-[clamp(18px,3vw,28px)]"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="demo-name">
                  Full Name
                  <Req />
                </Label>
                <Input
                  id="demo-name"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className="mt-1.5"
                  {...form.register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <Label htmlFor="demo-email">
                  Email Address
                  <Req />
                </Label>
                <Input
                  id="demo-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  className="mt-1.5"
                  {...form.register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <Label htmlFor="demo-phone">Phone Number</Label>
                <Input
                  id="demo-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 00000 00000"
                  aria-invalid={!!errors.phone}
                  className="mt-1.5"
                  {...form.register("phone")}
                />
                <FieldError message={errors.phone?.message} />
              </div>
              <div>
                <Label htmlFor="demo-company">Company Name</Label>
                <Input
                  id="demo-company"
                  autoComplete="organization"
                  placeholder="Your company"
                  aria-invalid={!!errors.company}
                  className="mt-1.5"
                  {...form.register("company")}
                />
                <FieldError message={errors.company?.message} />
              </div>
            </div>

            <div>
              <Label htmlFor="demo-entity">
                You are a
                <Req />
              </Label>
              <Select
                value={selectedEntity}
                onValueChange={(v) =>
                  form.setValue("entityType", v as DemoRequest["entityType"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  id="demo-entity"
                  aria-invalid={!!errors.entityType}
                  className="mt-1.5 w-full"
                >
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {ENTITY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.entityType?.message} />
            </div>

            <div>
              <Label htmlFor="demo-message">
                Message
                <Req />
              </Label>
              <Textarea
                id="demo-message"
                rows={4}
                placeholder="Tell us about your requirements..."
                aria-invalid={!!errors.message}
                className="mt-1.5"
                {...form.register("message")}
              />
              <FieldError message={errors.message?.message} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                size="cta"
                variant="fgPrimary"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Sending…" : "Send Message"}
                {mutation.isPending ? null : (
                  <em aria-hidden="true" className="text-mint not-italic">
                    →
                  </em>
                )}
              </Button>
              <span className="text-n400 text-[13px]">
                We reply within one business day.
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
