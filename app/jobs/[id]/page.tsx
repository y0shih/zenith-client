'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Building, Clock, DollarSign, MapPin, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/components/layout/session-provider'
import { CommentThread } from '@/components/features/job/comment-thread'
import { canManageTenant } from '@/lib/auth'
import { formatCurrencyRange, formatEnumLabel, formatRelativeDate, shortenId } from '@/lib/display'
import { ApiError } from '@/services/api'
import { applicationService } from '@/services/application.service'
import { commentService, type JobComment } from '@/services/comment.service'
import { jobService } from '@/services/job.service'
import { mediaService } from '@/services/media.service'
import type { Job } from '@/types/job'
import { FileUpload } from '@/components/ui/file-upload'
import { ResumePicker } from '@/components/features/job/resume-picker'
import { toast } from 'sonner'

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken, activeTenantId, isAuthenticated, user } = useSession()
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

  const jobId = params.id

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

        // If user chose to upload a brand-new file, upload it first
        if (showNewUpload && resumeFile) {
          try {
            const uploadRes = await mediaService.upload('media', resumeFile, accessToken)
            resumeKey = uploadRes.url
          } catch {
            toast.error('Failed to upload CV. Please try again.')
            return
          }
        }

        await applicationService.apply(
          jobId,
          {
            resume_url: resumeKey || undefined,
            cover_letter: coverLetter || undefined,
          },
          accessToken,
        )

        toast.success('Application submitted successfully.')
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
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center gap-3">
        <Spinner className="size-5" />
        Loading job details
      </main>
    )
  }

  if (errorMessage || !job) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold text-primary">Job unavailable</h1>
          <p className="text-secondary">{errorMessage ?? 'The requested job could not be found.'}</p>
          <Button asChild>
            <Link href="/jobs">Back to jobs</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <div className="bg-primary text-white pt-24 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-cta hover:text-white transition-colors mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-white/80 font-medium">
                <span className="flex items-center gap-2"><Building className="w-5 h-5" /> Tenant {shortenId(job.tenant_id)}</span>
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {job.location}</span>
                <span className="flex items-center gap-2 capitalize"><Clock className="w-5 h-5" /> {formatEnumLabel(job.job_type)}</span>
                <span className="flex items-center gap-2 text-chart-2 font-bold"><DollarSign className="w-5 h-5" /> {formatCurrencyRange(job.salary_min, job.salary_max)}</span>
              </div>
            </div>

            <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto px-8 !py-6 text-lg border-2 border-transparent hover:border-white">
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-2 border-primary rounded-none shadow-xl">
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
                    <Label htmlFor="cover-letter" className="font-bold text-primary">Cover Letter (Optional)</Label>
                    <textarea
                      id="cover-letter"
                      rows={4}
                      value={coverLetter}
                      onChange={(event) => setCoverLetter(event.target.value)}
                      className="border-2 border-border p-3 focus:border-primary focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground w-full"
                      placeholder="Why are you a great fit for this role?"
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
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="font-heading text-2xl font-bold text-primary mb-4 border-b-2 border-border pb-2">About the Role</h2>
            <div className="prose prose-slate max-w-none text-secondary">
              <p className="text-lg whitespace-pre-line">{job.description}</p>
            </div>
          </section>

          <section className="mt-16 pt-8 border-t-4 border-primary">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-primary">Discussion and Q&A</h2>
            </div>

            <Card className="border-2 border-border rounded-none shadow-none">
              <CardContent className="p-4 space-y-4">
                <Label htmlFor="job-comment" className="font-bold text-primary">Add a comment</Label>
                <textarea
                  id="job-comment"
                  rows={3}
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                  className="w-full border-2 border-border p-3 focus:border-primary focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground"
                  placeholder="Ask a question about this role..."
                />
                <div className="flex justify-end">
                  <Button type="button" className="rounded-none gap-2 px-6" onClick={handleCommentSubmit} disabled={isCommenting}>
                    {isCommenting ? <Spinner className="size-4" /> : null}
                    Post Comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 mt-8">
              {commentThreads.length ? (
                commentThreads.map((thread) => (
                  <CommentThread
                    key={`${thread.root.author}-${thread.root.timestamp}-${thread.root.content}`}
                    root={thread.root}
                    replies={thread.replies}
                  />
                ))
              ) : (
                <p className="text-secondary">No discussion yet. Be the first to ask a question.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-primary rounded-none shadow-[4px_4px_0_0_#0F172A]">
            <CardContent className="p-6">
              <h3 className="font-heading text-xl font-bold text-primary mb-4">Post Description</h3>
              <div className="space-y-2 text-sm text-secondary font-medium">
                <p><strong>Status:</strong> <span className="capitalize">{formatEnumLabel(job.status)}</span></p>
                <p><strong>Posted:</strong> {formatRelativeDate(job.created_at)}</p>
                <p><strong>Approved:</strong> {job.approved_at ? formatRelativeDate(job.approved_at) : 'Pending review or unavailable'}</p>
                <p><strong>Tenant:</strong> {job.tenant_name || 'Organization unavailable'}</p>
                <p><strong>Employer:</strong> {job.employer_name || 'Anonymous'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
