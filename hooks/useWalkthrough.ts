"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "walkthrough_seen";

export function useWalkthrough() {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  /**
   * Call this to try auto-starting the tour.
   * Only starts if the user hasn't seen it yet.
   */
  const tryAutoStart = useCallback(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setIsActive(true);
    }
  }, []);

  /** Force-start the tour (e.g. from "Take the Tour" button). */
  const startTour = useCallback(() => {
    setIsActive(true);
  }, []);

  const completeTour = useCallback(() => {
    setIsActive(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, []);

  const skipTour = useCallback(() => {
    setIsActive(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, []);

  /**
   * Navigate to practice arena and start the tour.
   * Used by the profile page "Take the Tour" button.
   */
  const navigateAndStart = useCallback(() => {
    if (typeof window !== "undefined") {
      // Clear the flag so the tour fires on arrival
      localStorage.removeItem(STORAGE_KEY);
    }
    router.push("/practice/daily?welcome=true");
  }, [router]);

  return {
    isActive,
    tryAutoStart,
    startTour,
    completeTour,
    skipTour,
    navigateAndStart,
  };
}
