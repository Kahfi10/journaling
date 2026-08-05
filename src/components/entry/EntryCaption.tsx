// src/components/entry/EntryCaption.tsx
interface EntryCaptionProps {
  caption: string
}

export function EntryCaption({ caption }: EntryCaptionProps) {
  return (
    <div className="inline-block max-w-[520px]">
      <div className="px-5 py-4 rounded-md border-l-[3px]" style={{
        background: "rgba(248, 247, 244, 0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderLeftColor: "rgba(17, 17, 17, 0.5)",
      }}>
        <p className="text-sm leading-relaxed" style={{ color: "var(--j-text-1)" }}>
          {caption}
        </p>
      </div>
    </div>
  )
}
