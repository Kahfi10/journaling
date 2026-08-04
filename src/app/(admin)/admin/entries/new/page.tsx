// src/app/(admin)/admin/entries/new/page.tsx
import { EntryForm } from "@/components/admin/EntryForm"

export default function NewEntryPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-[#F0EDE8] mb-10">
        Buat Entry Baru
      </h1>
      <EntryForm />
    </div>
  )
}
