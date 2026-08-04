import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function getMusicDurationSeconds(duration: "FIFTEEN" | "THIRTY" | "SIXTY"): number {
  return duration === "FIFTEEN" ? 15 : duration === "THIRTY" ? 30 : 60
}

export function getCloudinaryUrl(url: string, opts?: { width?: number; quality?: string }): string {
  if (!url.includes("cloudinary.com")) return url
  const w = opts?.width ?? "auto"
  const q = opts?.quality ?? "auto"
  return url.replace("/upload/", `/upload/f_auto,q_${q},w_${w}/`)
}
