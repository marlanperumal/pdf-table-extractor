import { PdfViewer } from "@/components/pdf-viewer"
import { ConfigPanel } from "@/components/config-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function Page() {
  return (
    <main className="h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={65} minSize={30}>
          <PdfViewer />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35} minSize={20}>
          <ConfigPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}

