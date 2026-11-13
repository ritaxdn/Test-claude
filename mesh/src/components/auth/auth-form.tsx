"use client";

import { useFormAction } from "@/hooks/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { FormAlert } from "@/components/ui/misc";
import { signIn, signUp } from "@/lib/actions/auth";

export function AuthForm({ mode, next }: { mode: "signin" | "signup"; next?: string }) {
  const [state, onSubmit, pending] = useFormAction(mode === "signin" ? signIn : signUp);
  const fe = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <Field label="Email" htmlFor="email" error={fe?.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          required
          aria-invalid={!!fe?.email || undefined}
        />
      </Field>
      <Field
        label="Password"
        htmlFor="password"
        error={fe?.password}
        hint={mode === "signup" ? "At least 8 characters." : undefined}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          minLength={mode === "signup" ? 8 : undefined}
          aria-invalid={!!fe?.password || undefined}
        />
      </Field>
      <FormAlert message={state && !state.ok && !fe ? state.error : null} />
      <Button type="submit" size="lg" loading={pending} className="mt-1 w-full">
        {mode === "signin" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}
