import Image from "next/image"

type EmailPreviewProps = {
  highlightLabel: string
  highlightValue: string
  messageTitle: string
  messageBody: string
  ctaLabel: string
}

export function EmailPreview({ highlightLabel, highlightValue, messageTitle, messageBody, ctaLabel }: EmailPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted/40">
      <div className="mx-auto max-w-sm px-6 py-8 text-center font-serif">
        <Image src="/Deporta-Logo.svg" alt="" width={120} height={40} className="mx-auto h-9 w-auto object-contain" />

        <h2 className="mt-6 text-xl font-bold text-secondary text-balance">
          {messageTitle || "Message title"}
        </h2>

        <p className="mt-4 font-bold text-secondary">Hi {"{{Customer_Name}}"},</p>

        <p className="mt-3 text-sm text-muted-foreground text-balance">
          {messageBody || "Your message will appear here as you type."}
        </p>

        {(highlightLabel || highlightValue) && (
          <div className="mt-6 rounded-lg border border-dashed border-primary/60 bg-primary/5 px-4 py-4">
            {highlightLabel && (
              <p className="text-xs font-bold uppercase tracking-wide text-primary">{highlightLabel}</p>
            )}
            {highlightValue && <p className="mt-1 text-lg font-bold text-secondary">{highlightValue}</p>}
          </div>
        )}

        <div className="mt-6">
          <span className="inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
            {ctaLabel || "Call to action"}
          </span>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          This message was sent to you because you have an account with Deporta.
        </p>
      </div>

      <div className="bg-secondary px-6 py-4 text-center font-serif text-secondary-foreground">
        <p className="text-xs">Copyright © {new Date().getFullYear()} Deporta. All rights reserved.</p>
        <p className="mt-1 text-xs">
          Need help? <span className="font-semibold text-primary">support@deportalogistics.com</span>
        </p>
      </div>
    </div>
  )
}
