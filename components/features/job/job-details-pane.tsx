'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Building, Clock, DollarSign, MapPin, MessageSquare, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/components/layout/session-provider'
import { CommentThread } from '@/components/features/job/comment-thread'
import { formatCurrencyRange, formatEnumLabel, formatRelativeDate, shortenId } from '@/lib/display'
import { ApiError } from '@/services/api'
import { applicationService } from '@/services/application.service'
import { chatService } from '@/services/chat.service'
import { commentService, type JobComment } from '@/services/comment.service'
import { jobService } from '@/services/job.service'
import { mediaService } from '@/services/media.service'
import type { Job } from '@/types/job'
import { FileUpload } from '@/components/ui/file-upload'
import { ResumePicker } from '@/components/features/job/resume-picker'
import { toast } from 'sonner'

interface JobDetailsPaneProps {
  jobId: string
  onClose?: () => void
}

export function JobDetailsPane({ jobId, onClose }: JobDetailsPaneProps) {
  const router = useRouter()
  const { accessToken, isAuthenticated, user } = useSession()
  const [job, setJob] = useState<Job | null>(null)
  const [comments, setComments] = useState<JobComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [selectedResumeUrl, setSelectedResumeUrl] = useState<string | undefined>(undefined)
  const [showNewUpload, setShowNewUpload] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [commentBody, setCommentBody] = useState('')
  const [isApplyOpen, setIsApplyOpen] = useState(false)
  const [isApplying, startApplyTransition] = useTransition()
  const [isCommenting, startCommentTransition] = useTransition()

  useEffect(() => {
    let isMounted = true

    async function loadPage() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const [jobData, commentData] = await Promise.all([
          jobService.getById(jobId),
          commentService.listForJob(jobId),
        ])

        if (!isMounted) {
          return
        }

        setJob(jobData)
        setComments(commentData.comments || [])
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load this job.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPage()

    return () => {
      isMounted = false
    }
  }, [jobId])

  const commentThreads = useMemo(
    () =>
      (comments || []).map((comment) => ({
        root: {
          initials: comment.author.full_name
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join(''),
          author: comment.author.full_name,
          timestamp: formatRelativeDate(comment.created_at),
          content: comment.content,
          marker: comment.is_official_reply
            ? { variant: 'official' as const, label: 'Official' }
            : comment.author.role === 'system_admin'
              ? { variant: 'moderator' as const, label: 'Moderator' }
              : undefined,
        },
        replies: (comment.replies || []).map((reply) => ({
          initials: reply.author.full_name
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join(''),
          author: reply.author.full_name,
          timestamp: formatRelativeDate(reply.created_at),
          content: reply.content,
          marker: reply.is_official_reply
            ? { variant: 'official' as const, label: 'Official' }
            : undefined,
        })),
      })),
    [comments],
  )

  const handleApply = () => {
    if (!isAuthenticated || !accessToken) {
      toast.error('Please log in as a candidate before applying.')
      router.push('/login')
      return
    }

    if (user?.role !== 'candidate') {
      toast.error('Only candidate accounts can apply to jobs.')
      return
    }

    startApplyTransition(async () => {
      try {
        let resumeKey: string | undefined = selectedResumeUrl

        if (showNewUpload && resumeFile) {
          try {
            const uploadRes = await mediaService.upload('media', resumeFile, accessToken)
            resumeKey = uploadRes.url
          } catch {
            toast.error('Failed to upload CV. Please try again.')
            return
          }
        }

        const newApp = await applicationService.apply(
          jobId,
          {
            resume_url: resumeKey || undefined,
          },
          accessToken,
        )

        if (coverLetter?.trim()) {
          try {
            await chatService.sendMessage(newApp.id, coverLetter.trim(), accessToken)
          } catch (err) {
            console.error('Failed to send cover letter to chat', err)
          }
        }

        toast.success('Application submitted successfully. Chat opened with employer.')
        setResumeFile(null)
        setSelectedResumeUrl(undefined)
        setShowNewUpload(false)
        setCoverLetter('')
        setIsApplyOpen(false)
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to submit your application.')
      }
    })
  }

  const handleCommentSubmit = () => {
    if (!isAuthenticated || !accessToken) {
      toast.error('Please log in before posting a comment.')
      router.push('/login')
      return
    }

    if (!commentBody.trim()) {
      toast.error('Comment cannot be empty.')
      return
    }

    startCommentTransition(async () => {
      try {
        const createdComment = await commentService.create(
          jobId,
          { content: commentBody.trim() },
          accessToken,
        )

        setComments((current) => [createdComment, ...current])
        setCommentBody('')
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to post your comment.')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-card border-2 border-border p-8 min-h-[400px]">
        <Spinner className="size-8 text-primary" />
        <span className="text-secondary font-medium">Loading details...</span>
      </div>
    )
  }

  if (errorMessage || !job) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-card border-2 border-border p-8 min-h-[400px]">
        <h3 className="font-heading text-2xl font-bold text-primary">Job unavailable</h3>
        <p className="text-secondary">{errorMessage ?? 'The requested job could not be found.'}</p>
        {onClose && (
          <Button onClick={onClose} variant="outline" className="border-2">
            Close Panel
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-card border-2 border-primary shadow-[4px_4px_0_0_#0F172A] flex flex-col sticky top-24">
      {/* Header section with sticky top */}
      <div className="bg-primary text-white p-6 shrink-0 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 transition-colors rounded-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 pr-8">{job.title}</h2>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-white/80 font-medium text-sm">
          <span className="flex items-center gap-1.5"><Building className="w-4 h-4" /> {job.tenant_name || `Tenant ${shortenId(job.tenant_id)}`}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
          <span className="flex items-center gap-1.5 capitalize"><Clock className="w-4 h-4" /> {formatEnumLabel(job.job_type)}</span>
          <span className="flex items-center gap-1.5 text-chart-2 font-bold"><DollarSign className="w-4 h-4" /> {formatCurrencyRange(job.salary_min, job.salary_max)}</span>
        </div>
        
        <div className="mt-6">
          <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full border-2 border-transparent hover:border-white bg-cta text-primary hover:bg-cta/90 hover:text-primary">
                Apply Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-2 border-primary rounded-none shadow-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl font-bold text-primary">Apply for this role</DialogTitle>
                <DialogDescription className="text-base text-secondary">
                  Candidate accounts can submit a PDF resume and optional cover letter.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="font-bold text-primary">Select your CV</Label>
                  {isAuthenticated && accessToken && user?.role === 'candidate' && !showNewUpload ? (
                    <ResumePicker
                      token={accessToken}
                      selectedUrl={selectedResumeUrl}
                      onSelect={(resume) => setSelectedResumeUrl(resume?.file_url)}
                      onUploadNew={() => setShowNewUpload(true)}
                    />
                  ) : (
                    <>
                      <FileUpload
                        accept=".pdf,application/pdf"
                        maxSizeMB={5}
                        value={resumeFile}
                        onChange={setResumeFile}
                        disabled={isApplying}
                      />
                      <button
                        type="button"
                        onClick={() => { setShowNewUpload(false); setResumeFile(null) }}
                        className="text-xs text-secondary hover:text-primary transition-colors text-left"
                      >
                        ← Back to resume library
                      </button>
                    </>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cover-letter" className="font-bold text-primary">Message to Employer (Cover Letter)</Label>
                  <textarea
                    id="cover-letter"
                    rows={4}
                    value={coverLetter}
                    onChange={(event) => setCoverLetter(event.target.value)}
                    className="border-2 border-border p-3 focus:border-primary focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground w-full"
                    placeholder="Introduce yourself. This will start a conversation with the employer."
                  />
                </div>
                <Button type="button" className="w-full text-lg rounded-none !py-6" onClick={handleApply} disabled={isApplying}>
                  {isApplying ? <Spinner className="size-4" /> : null}
                  Submit Application
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6 flex-1 space-y-8">
        <section>
          <h3 className="font-heading text-xl font-bold text-primary mb-3 border-b-2 border-border pb-2">About the Role</h3>
          <div className="prose prose-slate max-w-none text-secondary text-sm">
            <p className="whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>
        </section>

        <section className="bg-accent/50 p-4 border border-border">
          <h3 className="font-heading text-lg font-bold text-primary mb-3">Post Details</h3>
          <div className="space-y-2 text-sm text-secondary">
            <p><strong>Status:</strong> <span className="capitalize">{formatEnumLabel(job.status)}</span></p>
            <p><strong>Posted:</strong> {formatRelativeDate(job.created_at)}</p>
            <p><strong>Approved:</strong> {job.approved_at ? formatRelativeDate(job.approved_at) : 'Pending review'}</p>
            <p><strong>Tenant:</strong> {job.tenant_name || 'Organization unavailable'}</p>
            <p><strong>Employer:</strong> {job.employer_name || 'Anonymous'}</p>
          </div>
        </section>

        <section className="pt-4 border-t-2 border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="font-heading text-lg font-bold text-primary">Q&A</h3>
          </div>

          <div className="space-y-3 mb-6">
            <Label htmlFor="job-comment" className="sr-only">Add a comment</Label>
            <textarea
              id="job-comment"
              rows={2}
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              className="w-full border-2 border-border p-2 text-sm focus:border-primary focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground"
              placeholder="Ask a question..."
            />
            <Button type="button" size="sm" className="w-full rounded-none" onClick={handleCommentSubmit} disabled={isCommenting}>
              {isCommenting ? <Spinner className="size-3 mr-2" /> : null}
              Post Comment
            </Button>
          </div>

          <div className="space-y-4">
            {commentThreads.length ? (
              commentThreads.map((thread) => (
                <CommentThread
                  key={`${thread.root.author}-${thread.root.timestamp}-${thread.root.content}`}
                  root={thread.root}
                  replies={thread.replies}
                />
              ))
            ) : (
              <p className="text-sm text-secondary text-center py-4">No questions asked yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
