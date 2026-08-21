"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, HelpCircle } from "lucide-react"
import { BroadcastComposer } from "@/components/cms/broadcast-composer"
import { FaqManager, SEED_FAQS, type FaqItem } from "@/components/cms/faq-manager"

export default function CMSPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(SEED_FAQS)

  const cmsModules = [
    {
      title: "Notifications",
      description: "Send push notifications or emails to users",
      icon: Bell,
      count: 8,
      href: "#broadcast-message",
    },
    {
      title: "FAQs",
      description: "Manage frequently asked questions",
      icon: HelpCircle,
      count: faqs.length,
      href: "#faq-manager",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {cmsModules.map((module) => (
          <a key={module.title} href={module.href}>
            <Card className="bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <module.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{module.count}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-1">{module.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <div id="broadcast-message" className="scroll-mt-6">
        <BroadcastComposer />
      </div>

      <FaqManager faqs={faqs} onFaqsChange={setFaqs} />
    </div>
  )
}
