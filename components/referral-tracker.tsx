"use client";

import { useEffect } from "react";
import { captureReferralFromUrl } from "@/lib/referral";

/** Mounted once in the root layout — captures `?ref=` on any page load. Renders nothing. */
export default function ReferralTracker() {
  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  return null;
}
