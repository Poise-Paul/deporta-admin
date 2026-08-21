"use client"

import { useState } from "react"
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

export type FaqItem = {
  id: string
  question: string
  answer: string
}

const SEED_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I book a trip on the Deporta app?",
    answer:
      "Open the app, enter your pickup and drop-off locations, choose an available route or bus, and confirm your seat. You'll get a booking confirmation with your ticket details.",
  },
  {
    id: "faq-2",
    question: "How can I track my driver in real time?",
    answer:
      "Once a driver is assigned to your trip, the Live Tracking screen shows their current location and estimated arrival time until you're picked up.",
  },
  {
    id: "faq-3",
    question: "What payment methods are supported?",
    answer: "You can pay with a debit/credit card, bank transfer, or your in-app wallet balance.",
  },
  {
    id: "faq-4",
    question: "How do I cancel or reschedule a booking?",
    answer:
      "Go to My Trips, select the booking you want to change, then choose Cancel or Reschedule. Cancellation policies may apply depending on how close it is to departure.",
  },
]

type FaqManagerProps = {
  faqs: FaqItem[]
  onFaqsChange: (faqs: FaqItem[]) => void
}

export { SEED_FAQS }

export function FaqManager({ faqs, onFaqsChange }: FaqManagerProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null)

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openAddDialog = () => {
    setEditingId(null)
    setQuestion("")
    setAnswer("")
    setDialogOpen(true)
  }

  const openEditDialog = (faq: FaqItem) => {
    setEditingId(faq.id)
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setDialogOpen(true)
  }

  const canSave = question.trim().length > 0 && answer.trim().length > 0

  const handleSave = () => {
    if (!canSave) return

    if (editingId) {
      onFaqsChange(
        faqs.map((faq) => (faq.id === editingId ? { ...faq, question: question.trim(), answer: answer.trim() } : faq)),
      )
    } else {
      onFaqsChange([
        ...faqs,
        { id: `faq-${Date.now()}`, question: question.trim(), answer: answer.trim() },
      ])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    onFaqsChange(faqs.filter((faq) => faq.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <Card id="faq-manager" className="bg-card border border-border scroll-mt-6">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>
          Manage the FAQs shown to customers and drivers in the app.{" "}
          <span className="text-amber-600 dark:text-amber-500">
            Not wired to a backend yet — changes here reset on refresh.
          </span>
        </CardDescription>
        <CardAction>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {faqs.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No FAQs yet. Click "Add FAQ" to create the first one.
          </p>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq) => {
              const isOpen = openIds.has(faq.id)
              return (
                <Collapsible key={faq.id} open={isOpen} onOpenChange={() => toggleOpen(faq.id)}>
                  <div className="flex items-center gap-1 rounded-lg border border-border px-3 py-1">
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="flex flex-1 items-center justify-between gap-3 py-3 text-left text-sm font-medium text-foreground"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>
                    </CollapsibleTrigger>
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => openEditDialog(faq)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(faq)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                  <CollapsibleContent className="px-3 pb-3 text-sm text-muted-foreground">
                    {faq.answer}
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update this question and answer." : "Add a new question and answer for the FAQ list."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faq-question">Question</Label>
              <Input
                id="faq-question"
                placeholder="How do I book a trip on the Deporta app?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-answer">Answer</Label>
              <Textarea
                id="faq-answer"
                placeholder="Open the app, enter your pickup and drop-off locations..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-28"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              {editingId ? "Save Changes" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this FAQ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && `"${deleteTarget.question}" will be removed from the list.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
