import React, { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, FileText } from 'lucide-react'
import { type ApiError } from '@/services/api'
import { applicationService } from '@/services/application.service'

export interface SecurePdfViewerProps {
  applicationId: string
  token: string
}

export function SecurePdfViewer({ applicationId, token }: SecurePdfViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadPdf() {
      setIsLoading(true)
      setError(null)
      try {
        const blob = await applicationService.getResume(applicationId, token)
        if (!isMounted) return

        const url = URL.createObjectURL(blob)
        setBlobUrl(url)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to load PDF')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPdf()

    return () => {
      isMounted = false
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId, token])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-64 bg-muted/20 border-2 border-border">
        <Spinner className="w-8 h-8 text-primary mb-4" />
        <p className="text-secondary font-medium">Loading secure document...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-64 bg-destructive/5 border-2 border-destructive/20 text-center">
        <AlertCircle className="w-8 h-8 text-destructive mb-4" />
        <p className="text-destructive font-bold mb-2">Could not load document</p>
        <p className="text-sm text-destructive/80">{error}</p>
      </div>
    )
  }

  if (!blobUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-64 bg-muted/20 border-2 border-border text-center">
        <FileText className="w-8 h-8 text-muted-foreground mb-4" />
        <p className="text-secondary font-medium">No document available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[600px] border-2 border-border flex flex-col bg-muted/30">
      <iframe
        src={blobUrl}
        className="w-full flex-1"
        title="Secure Document Viewer"
      />
    </div>
  )
}
