// src/components/entry/EntryCaption.tsx
interface EntryCaptionProps {
  caption: string
}

export function EntryCaption({ caption }: EntryCaptionProps) {
  return (
    <div className="inline-block max-w-[560px]">
      <div className="bg-black/60 backdrop-blur-md border-l-[3px] border-[#C8A96E]/60 px-5 py-4 rounded-r-md">
        <p className="text-[#F0EDE8]/90 text-[15px] leading-relaxed font-sans">
          {caption}
        </p>
      </div>
    </div>
  )
}
