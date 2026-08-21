"use client"

import { useState } from "react"
import { Bell, Info, Mail, Send } from "lucide-react"
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
import { useSendBroadcastEmail, useSendPushNotification } from "@/api/cms"

const TITLE_LIMIT = 65
const MESSAGE_LIMIT = 240

const AUDIENCE_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "drivers", label: "Drivers" },
  { value: "staff", label: "All Staff" },
] as const

type Audience = (typeof AUDIENCE_OPTIONS)[number]["value"]

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
      <p className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Audience targeting isn&apos;t wired up yet — every send currently reaches all users regardless of this
        selection.
      </p>
    </div>
  )
}

function PushNotificationTab() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState<Audience>("all")
  const { mutate, isPending } = useSendPushNotification()

  const canSend = title.trim().length > 0 && message.trim().length > 0
  const audienceLabel = AUDIENCE_OPTIONS.find((option) => option.value === audience)?.label

  const handleSend = () => {
    // audience is intentionally not sent yet — backend only supports "all users" for now
    mutate(
      { title: title.trim(), message: message.trim() },
      {
        onSuccess: () => {
          setTitle("")
          setMessage("")
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
              <AlertDialogTitle>Send this notification to all users?</AlertDialogTitle>
              <AlertDialogDescription>
                This push notification will be delivered immediately to every user on the platform. This
                can&apos;t be undone once sent.
                {audience !== "all" && (
                  <span className="mt-2 block text-amber-600 dark:text-amber-500">
                    Note: audience targeting isn&apos;t live yet, so this will go to all users, not just{" "}
                    {audienceLabel}.
                  </span>
                )}
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

function EmailBroadcastTab() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState<Audience>("all")
  const { mutate, isPending } = useSendBroadcastEmail()

  const canSend = title.trim().length > 0 && message.trim().length > 0
  const audienceLabel = AUDIENCE_OPTIONS.find((option) => option.value === audience)?.label

  const handleSend = () => {
    // audience is intentionally not sent yet — backend only supports "all users" for now
    mutate(
      { title: title.trim(), message: message.trim() },
      {
        onSuccess: () => {
          setTitle("")
          setMessage("")
        },
      },
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <AudienceSelect value={audience} onChange={setAudience} idPrefix="email" />

        <div className="space-y-2">
          <Label htmlFor="email-title">Subject</Label>
          <Input
            id="email-title"
            placeholder="Important Announcement"
            value={title}
            maxLength={TITLE_LIMIT}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-message">Message</Label>
          <Textarea
            id="email-message"
            placeholder="We have updated our terms and conditions."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-40"
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
              <AlertDialogTitle>Send this email to all users?</AlertDialogTitle>
              <AlertDialogDescription>
                This email will be delivered immediately to every user&apos;s inbox. This can&apos;t be undone
                once sent.
                {audience !== "all" && (
                  <span className="mt-2 block text-amber-600 dark:text-amber-500">
                    Note: audience targeting isn&apos;t live yet, so this will go to all users, not just{" "}
                    {audienceLabel}.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSend}>Yes, send it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Preview</p>
        <div className="mt-3 rounded-md border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">From: Deporta Transport</p>
          <p className="mt-2 font-semibold text-foreground">{title || "Subject line"}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {message || "Your message will appear here as you type."}
          </p>
        </div>
      </div>
    </div>
  )
}

export function BroadcastComposer() {
  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle>Broadcast Message</CardTitle>
        <CardDescription>Send a push notification or email to every user on the platform.</CardDescription>
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
            <PushNotificationTab />
          </TabsContent>
          <TabsContent value="email" className="pt-4">
            <EmailBroadcastTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
