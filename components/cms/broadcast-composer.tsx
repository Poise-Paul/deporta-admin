"use client"

import { useEffect, useState } from "react"
import { Bell, Mail, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { NotificationPreview } from "@/components/cms/notification-preview"
import { EmailPreview } from "@/components/cms/email-preview"
import { useSendBroadcastEmail, useSendPushNotification, type Audience } from "@/api/cms"
import { getSentTodayCount, recordSentToday } from "@/lib/notification-log"

const TITLE_LIMIT = 65
const MESSAGE_LIMIT = 240
const DEFAULT_UNSUBSCRIBE_LINK = "https://deporta.com/unsubscribe"

const AUDIENCE_OPTIONS: { value: Audience; label: string }[] = [
  { value: "all-users", label: "All Users" },
  { value: "drivers", label: "Drivers" },
  { value: "staffs", label: "Staff" },
  { value: "customers", label: "Customers" },
]

function AudienceSelect({ value, onChange, idPrefix }: { value: Audience; onChange: (v: Audience) => void; idPrefix: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-audience`}>Audience</Label>
      <Select value={value} onValueChange={(v) => onChange(v as Audience)}>
        <SelectTrigger id={`${idPrefix}-audience`} className="w-full sm:w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {AUDIENCE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function PushNotificationTab({ onSent }: { onSent: () => void }) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState<Audience>("all-users")
  const { mutate, isPending } = useSendPushNotification()

  const canSend = title.trim().length > 0 && message.trim().length > 0
  const audienceLabel = AUDIENCE_OPTIONS.find((option) => option.value === audience)?.label

  const handleSend = () => {
    mutate(
      { title: title.trim(), message: message.trim(), user_type: audience },
      {
        onSuccess: () => {
          setTitle("")
          setMessage("")
          onSent()
        },
      },
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <AudienceSelect value={audience} onChange={setAudience} idPrefix="push" />

        <div className="space-y-2">
          <Label htmlFor="push-title">Title</Label>
          <Input
            id="push-title"
            placeholder="New Feature Alert"
            value={title}
            maxLength={TITLE_LIMIT}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-right text-xs text-muted-foreground">
            {title.length}/{TITLE_LIMIT}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="push-message">Message</Label>
          <Textarea
            id="push-message"
            placeholder="Check out the latest update to the Deporta app!"
            value={message}
            maxLength={MESSAGE_LIMIT}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-28"
          />
          <p className="text-right text-xs text-muted-foreground">
            {message.length}/{MESSAGE_LIMIT}
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={!canSend || isPending} className="gap-2">
              <Send className="h-4 w-4" />
              {isPending ? "Sending..." : "Send Push Notification"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send this notification to {audienceLabel?.toLowerCase()}?</AlertDialogTitle>
              <AlertDialogDescription>
                This push notification will be delivered immediately to {audienceLabel?.toLowerCase()}. This
                can&apos;t be undone once sent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSend}>Yes, send it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <NotificationPreview title={title} message={message} />
    </div>
  )
}

function EmailBroadcastTab({ onSent }: { onSent: () => void }) {
  const [audience, setAudience] = useState<Audience>("all-users")
  const [messageTitle, setMessageTitle] = useState("")
  const [messageBody, setMessageBody] = useState("")
  const [highlightLabel, setHighlightLabel] = useState("")
  const [highlightValue, setHighlightValue] = useState("")
  const [ctaLabel, setCtaLabel] = useState("")
  const [ctaUrl, setCtaUrl] = useState("")
  const [unsubscribeLink, setUnsubscribeLink] = useState(DEFAULT_UNSUBSCRIBE_LINK)
  const { mutate, isPending } = useSendBroadcastEmail()

  const canSend =
    messageTitle.trim().length > 0 &&
    messageBody.trim().length > 0 &&
    ctaLabel.trim().length > 0 &&
    ctaUrl.trim().length > 0 &&
    unsubscribeLink.trim().length > 0
  const audienceLabel = AUDIENCE_OPTIONS.find((option) => option.value === audience)?.label

  const handleSend = () => {
    mutate(
      {
        Highlight_Label: highlightLabel.trim(),
        Highlight_Value: highlightValue.trim(),
        Message_Title: messageTitle.trim(),
        Message_Body: messageBody.trim(),
        Unsubscribe_Link: unsubscribeLink.trim(),
        CTA_URL: ctaUrl.trim(),
        CTA_Label: ctaLabel.trim(),
        user_type: audience,
      },
      {
        onSuccess: () => {
          setMessageTitle("")
          setMessageBody("")
          setHighlightLabel("")
          setHighlightValue("")
          setCtaLabel("")
          setCtaUrl("")
          onSent()
        },
      },
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <AudienceSelect value={audience} onChange={setAudience} idPrefix="email" />

        <div className="space-y-2">
          <Label htmlFor="email-message-title">Message Title</Label>
          <Input
            id="email-message-title"
            placeholder="New Route Alert: Ajah ⇄ Lekki is Live!"
            value={messageTitle}
            onChange={(e) => setMessageTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-message-body">Message Body</Label>
          <Textarea
            id="email-message-body"
            placeholder="Commuting along the expressway just got easier."
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            className="min-h-24"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email-highlight-label">Highlight Label (optional)</Label>
            <Input
              id="email-highlight-label"
              placeholder="New Route"
              value={highlightLabel}
              onChange={(e) => setHighlightLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-highlight-value">Highlight Value (optional)</Label>
            <Input
              id="email-highlight-value"
              placeholder="Ajah to Lekki"
              value={highlightValue}
              onChange={(e) => setHighlightValue(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email-cta-label">CTA Label</Label>
            <Input
              id="email-cta-label"
              placeholder="Book Ride Now"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-cta-url">CTA URL</Label>
            <Input
              id="email-cta-url"
              placeholder="https://deporta.app.link/book?route=ajah-lekki"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
            />
          </div>
        </div>
        <p className="-mt-2 text-xs text-muted-foreground">
          This should be a smart/deferred link that opens the app directly if it's installed, and otherwise sends
          the user to the App Store or Play Store depending on their device. The admin portal doesn't generate that
          link — paste the smart-link URL from wherever it's hosted (e.g. a Branch/OneLink link, or a redirect page
          on the main Deporta site). A raw <code className="rounded bg-muted px-1 py-0.5">deporta://...</code>{" "}
          scheme link alone won't work for recipients without the app installed.
        </p>

        <div className="space-y-2">
          <Label htmlFor="email-unsubscribe">Unsubscribe Link</Label>
          <Input
            id="email-unsubscribe"
            value={unsubscribeLink}
            onChange={(e) => setUnsubscribeLink(e.target.value)}
          />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={!canSend || isPending} className="gap-2">
              <Send className="h-4 w-4" />
              {isPending ? "Sending..." : "Send Broadcast Email"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send this email to {audienceLabel?.toLowerCase()}?</AlertDialogTitle>
              <AlertDialogDescription>
                This email will be delivered immediately to {audienceLabel?.toLowerCase()}. This can&apos;t be
                undone once sent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSend}>Yes, send it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <EmailPreview
        highlightLabel={highlightLabel}
        highlightValue={highlightValue}
        messageTitle={messageTitle}
        messageBody={messageBody}
        ctaLabel={ctaLabel}
      />
    </div>
  )
}

export function BroadcastComposer({ onSentTodayChange }: { onSentTodayChange?: (count: number) => void }) {
  useEffect(() => {
    onSentTodayChange?.(getSentTodayCount())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSent = () => {
    onSentTodayChange?.(recordSentToday())
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle>Broadcast Message</CardTitle>
        <CardDescription>Send a push notification or email to users on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="push">
          <TabsList>
            <TabsTrigger value="push" className="gap-1.5">
              <Bell className="h-4 w-4" />
              Push Notification
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-1.5">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>
          <TabsContent value="push" className="pt-4">
            <PushNotificationTab onSent={handleSent} />
          </TabsContent>
          <TabsContent value="email" className="pt-4">
            <EmailBroadcastTab onSent={handleSent} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
