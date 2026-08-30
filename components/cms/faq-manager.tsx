"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
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
import { useCreateFaq, useDeleteFaq, useEditFaq, useFaqs, type FaqRecord } from "@/api/faqs"

type FaqManagerProps = {
  onCountChange?: (count: number) => void
}

export function FaqManager({ onCountChange }: FaqManagerProps) {
  const { data, isLoading } = useFaqs()
  const faqs = data?.faqs ?? []
  const total = data?.total ?? faqs.length
  const createFaq = useCreateFaq()
  const editFaq = useEditFaq()
  const deleteFaq = useDeleteFaq()

  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [paragraph, setParagraph] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<FaqRecord | null>(null)

  useEffect(() => {
    onCountChange?.(total)
  }, [total, onCountChange])

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
    setTitle("")
    setParagraph("")
    setDialogOpen(true)
  }

  const openEditDialog = (faq: FaqRecord) => {
    setEditingId(faq._id)
    setTitle(faq.title)
    setParagraph(faq.paragraph)
    setDialogOpen(true)
  }

  const canSave = title.trim().length > 0 && paragraph.trim().length > 0
  const isSaving = createFaq.isPending || editFaq.isPending

  const handleSave = () => {
    if (!canSave) return

    if (editingId) {
      editFaq.mutate(
        { faq_id: editingId, title: title.trim(), paragraph: paragraph.trim() },
        { onSuccess: () => setDialogOpen(false) },
      )
    } else {
      createFaq.mutate(
        { title: title.trim(), paragraph: paragraph.trim() },
        { onSuccess: () => setDialogOpen(false) },
      )
    }
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteFaq.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })
  }

  return (
    <Card id="faq-manager" className="bg-card border border-border scroll-mt-6">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Manage the FAQs shown to customers and drivers in the app.</CardDescription>
        <CardAction>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" />
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No FAQs yet. Click &quot;Add FAQ&quot; to create the first one.
          </p>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq) => {
              const isOpen = openIds.has(faq._id)
              return (
                <Collapsible key={faq._id} open={isOpen} onOpenChange={() => toggleOpen(faq._id)}>
                  <div className="flex items-center gap-1 rounded-lg border border-border px-3 py-1">
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="flex flex-1 items-center justify-between gap-3 py-3 text-left text-sm font-medium text-foreground"
                      >
                        <span>{faq.title}</span>
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
                    {faq.paragraph}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-answer">Answer</Label>
              <Textarea
                id="faq-answer"
                placeholder="Open the app, enter your pickup and drop-off locations..."
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                className="min-h-28"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave || isSaving}>
              {isSaving ? "Saving..." : editingId ? "Save Changes" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this FAQ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && `"${deleteTarget.title}" will be removed from the list.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteFaq.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteFaq.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
