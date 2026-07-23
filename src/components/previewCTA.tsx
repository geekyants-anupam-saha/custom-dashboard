"use client";

import { useWebGPUSupport } from "@/hooks/useWebGPUSupport";

export default function PreviewCTA() {
  const { loading, result } = useWebGPUSupport();

  if (loading) {
    return null;
  }

  if (!result?.supported) {
    console.log(result?.reason);

    return null;
  }

  return (
    <button
      onClick={() => {
        window.location.href = "/preview";
      }}
    >
      Play Preview
    </button>
  );
}
