// src/components/entry/EntryCaption.tsx
interface EntryCaptionProps {
  caption: string
}

export function EntryCaption({ caption }: EntryCaptionProps) {
  return (
    <div className="inline-flex max-w-[min(88vw,560px)]">
      <div
        className="relative overflow-hidden rounded-[20px] border px-5 py-4 sm:px-6 sm:py-5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
        style={{
          background: "rgba(8, 8, 8, 0.72)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.10)",
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-px"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.26), rgba(255,255,255,0.04))" }}
        />
        <p
          className="text-[10px] tracking-[0.32em] uppercase mb-2"
          style={{ color: "rgba(255,255,255,0.52)" }}
        >
          Memory note
        </p>
        <p className="text-base sm:text-lg leading-snug" style={{ color: "rgba(255,255,255,0.94)" }}>
          {caption}
        </p>
      </div>
    </div>
  )
}
