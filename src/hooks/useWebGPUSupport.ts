"use client";

import { useEffect, useState } from "react";
import { canPlayPreview } from "@/lib/webgpu";

export function useWebGPUSupport() {
  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState<{
    supported: boolean;
    reason: string;
    info: any;
  }>();

  useEffect(() => {
    async function check() {
      const res = await canPlayPreview();

      setResult(res);
      setLoading(false);
    }

    check();
  }, []);

  return {
    loading,
    result,
  };
}