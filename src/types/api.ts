// src/types/api.ts
import { z } from "zod"

// ─── Media ───
export const mediaItemSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  public_id: z.string().min(1),
  type: z.enum(["PHOTO", "VIDEO"]),
  caption: z.string().max(500).optional().nullable(),
  order: z.number().int().min(0).max(4),
})

// ─── Music ───
export const musicSchema = z.object({
  source: z.enum(["UPLOAD", "ITUNES"]),
  file_url: z.string().url().optional().nullable(),
  file_public_id: z.string().optional().nullable(),
  itunes_track_id: z.string().optional().nullable(),
  preview_url: z.string().url().optional().nullable(),
  track_name: z.string().max(200).optional().nullable(),
  artist_name: z.string().max(200).optional().nullable(),
  album_name: z.string().max(200).optional().nullable(),
  album_art_url: z.string().url().optional().nullable(),
  start_time: z.number().int().min(0).default(0),
  duration: z.enum(["FIFTEEN", "THIRTY", "SIXTY"]).default("THIRTY"),
})

// ─── Location ───
export const locationSchema = z.object({
  display_name: z.string().min(1).max(300),
  place_id: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
})

// ─── Create Entry ───
export const createEntrySchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200),
  description: z.string().optional().nullable(),
  date_taken: z.string().min(1, "Tanggal wajib diisi"),
  published: z.boolean().default(false),
  media: z
    .array(mediaItemSchema)
    .min(1, "Minimal 1 foto atau video")
    .max(5, "Maksimal 5 foto atau video"),
  music: musicSchema.optional().nullable(),
  location: locationSchema.optional().nullable(),
})

export type CreateEntryPayload = z.infer<typeof createEntrySchema>

// ─── Update Entry ───
export const updateEntrySchema = createEntrySchema.partial().extend({
  deletedMediaIds: z.array(z.string()).default([]),
})

export type UpdateEntryPayload = z.infer<typeof updateEntrySchema>

// ─── Upload Response ───
export interface UploadResponse {
  url: string
  public_id: string
}

// ─── API Generic Response ───
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  details?: unknown
}
