"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Bullets } from "@/components/site";
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

const EMPTY: DemoRequest = {
  name: "",
  email: "",
  company: "",
  entityType: "NBFC / Bank",
  assetClasses: "",
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
              Book a demo
            </h3>
            <p className="text-[14.5px] leading-[1.7] text-n500">
              Tell us who you are — lender, BC, LSP or DSA — and what you lend.
              We'll come back with a working demo on your products and a
              commercial proposal, not a rate card that answers nothing.
            </p>
            <Bullets>
              <li>
                Prefer email? Write to hello@fingrid.ai with your entity type
                and asset classes
              </li>
              <li>
                Demos are configured to your context — expect real workflows,
                not slideware
              </li>
              <li>
                Implementation scope and timeline included in every proposal
              </li>
            </Bullets>
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
                <Label htmlFor="demo-name">Name</Label>
                <Input
                  id="demo-name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className="mt-1.5"
                  {...form.register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <Label htmlFor="demo-email">Work email</Label>
                <Input
                  id="demo-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className="mt-1.5"
                  {...form.register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>
            </div>

            <div>
              <Label htmlFor="demo-company">Company</Label>
              <Input
                id="demo-company"
                autoComplete="organization"
                aria-invalid={!!errors.company}
                className="mt-1.5"
                {...form.register("company")}
              />
              <FieldError message={errors.company?.message} />
            </div>

            <div>
              <Label htmlFor="demo-entity">You are a…</Label>
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
                  <SelectValue placeholder="Select entity type" />
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
              <Label htmlFor="demo-assets">
                What do you lend against?{" "}
                <span className="text-n400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="demo-assets"
                rows={3}
                placeholder="Two-wheeler, used car, MSME, home loan…"
                aria-invalid={!!errors.assetClasses}
                className="mt-1.5"
                {...form.register("assetClasses")}
              />
              <FieldError message={errors.assetClasses?.message} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                size="cta"
                variant="fgPrimary"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Sending…" : "Request a demo"}
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
