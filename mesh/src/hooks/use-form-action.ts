"use client";

import * as React from "react";
import { useActionState } from "react";

/**
 * Like useActionState, but submits via onSubmit so React does not reset the
 * form afterwards — users keep what they typed when validation fails.
 */
export function useFormAction<S>(action: (prev: S | null, fd: FormData) => Promise<S>) {
  const [state, dispatch, pending] = useActionState(action, null);
  const onSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      React.startTransition(() => dispatch(fd));
    },
    [dispatch],
  );
  return [state, onSubmit, pending] as const;
}
