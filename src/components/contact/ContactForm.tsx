"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "success" | "error";

interface ContactFormText {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  specialty: string;
  specialtyPlaceholder: string;
  specialtyOptions: readonly string[];
  subject: string;
  subjectOptions: readonly string[];
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  requiredError: string;
  emailError: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ text }: { text: ContactFormText }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(formData: FormData): FieldErrors {
    const next: FieldErrors = {};
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name) next.name = text.requiredError;
    if (!email) next.email = text.requiredError;
    else if (!emailPattern.test(email)) next.email = text.emailError;
    if (!message) next.message = text.requiredError;

    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const fieldErrors = validate(formData);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!res.ok) throw new Error("request_failed");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClasses =
    "glass-soft w-full rounded-2xl px-4 py-3 font-sans text-sm text-deep placeholder:text-deep-soft/70 transition-colors focus:bg-white focus:outline-none";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-sans text-sm text-deep-soft">
            {text.name} <span className="text-rainbow-3">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={text.namePlaceholder}
            className={cn(inputClasses, "mt-2")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1.5 font-sans text-xs text-rainbow-3">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="font-sans text-sm text-deep-soft">
            {text.email} <span className="text-rainbow-3">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={text.emailPlaceholder}
            className={cn(inputClasses, "mt-2")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 font-sans text-xs text-rainbow-3">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="font-sans text-sm text-deep-soft">
            {text.phone}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={text.phonePlaceholder}
            className={cn(inputClasses, "mt-2")}
          />
        </div>

        <div>
          <label htmlFor="specialty" className="font-sans text-sm text-deep-soft">
            {text.specialty}
          </label>
          <div className="relative">
            <select id="specialty" name="specialty" defaultValue="" className={cn(inputClasses, "mt-2 appearance-none pr-10")}>
              <option value="" disabled>
                {text.specialtyPlaceholder}
              </option>
              {text.specialtyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-deep-soft" />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="font-sans text-sm text-deep-soft">
          {text.subject}
        </label>
        <div className="relative">
          <select id="subject" name="subject" className={cn(inputClasses, "mt-2 appearance-none pr-10")}>
            {text.subjectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-deep-soft" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="font-sans text-sm text-deep-soft">
          {text.message} <span className="text-rainbow-3">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={text.messagePlaceholder}
          className={cn(inputClasses, "mt-2 resize-none")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1.5 font-sans text-xs text-rainbow-3">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="glass-strong inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-sans text-sm text-deep transition-colors hover:bg-white disabled:opacity-50"
        >
          {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
          {status === "submitting" ? text.submitting : text.submit}
        </button>

        <div aria-live="polite" className="font-sans text-sm">
          {status === "success" && (
            <span className="flex items-center gap-2 text-deep">
              <CheckCircle2 size={16} className="text-rainbow-1" />
              {text.success}
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-2 text-deep">
              <AlertCircle size={16} className="text-rainbow-4" />
              {text.error}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
