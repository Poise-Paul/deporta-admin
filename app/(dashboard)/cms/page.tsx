import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ImageIcon, Bell, HelpCircle } from "lucide-react"

const cmsModules = [
  {
    title: "Content Pages",
    description: "Manage static content pages for the app",
    icon: FileText,
    count: 12,
  },
  {
    title: "Media Library",
    description: "Upload and manage images and videos",
    icon: ImageIcon,
    count: 156,
  },
  {
    title: "Notifications",
    description: "Send push notifications to users",
    icon: Bell,
    count: 8,
  },
  {
    title: "FAQs",
    description: "Manage frequently asked questions",
    icon: HelpCircle,
    count: 24,
  },
]

export default function CMSPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cmsModules.map((module) => (
          <Card
            key={module.title}
            className="bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer"
          >
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
        ))}
      </div>

      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a module above to manage content for the DEPORTA Transport apps.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
