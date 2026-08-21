import Image from "next/image"

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

export function NotificationPreview({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto w-[260px] select-none">
      <div className="relative rounded-[2.5rem] border-[8px] border-neutral-900 bg-neutral-900 shadow-xl">
        <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-neutral-900" />
        <div className="relative h-[520px] w-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-orange-400 via-orange-500 to-slate-800">
          <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-medium text-white">
            <span>9:41</span>
            <span>●●●●</span>
          </div>

          <div className="mt-10 flex flex-col items-center text-white">
            <span className="text-5xl font-light">{timeNow()}</span>
            <span className="mt-1 text-xs opacity-90">
              {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>

          <div className="px-3 pt-8">
            <div className="flex items-start gap-2.5 rounded-2xl bg-white/90 p-3 shadow-lg backdrop-blur">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm overflow-hidden">
                <Image src="/Deporta-Logo.svg" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Deporta</span>
                  <span className="shrink-0 text-[10px] text-neutral-400">now</span>
                </div>
                <p className="mt-0.5 truncate text-[13px] font-semibold text-neutral-900">
                  {title || "Notification title"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-neutral-600">
                  {message || "Your message will appear here as you type."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Live preview — lock screen</p>
    </div>
  )
}
