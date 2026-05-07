'use client'

import Link from 'next/link'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Building, ChevronRight, Clock, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { formatCurrencyRange, formatEnumLabel, formatRelativeDate, shortenId } from '@/lib/display'
import { jobService } from '@/services/job.service'
import type { Job } from '@/types/job'
import { JobDetailsPane } from '@/components/features/job/job-details-pane'

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'salary_desc'>('newest')
  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    let isMounted = true

    async function loadJobs() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await jobService.listPublic({
          page: 1,
          per_page: 20,
          search: deferredSearch || undefined,
        })

        if (!isMounted) {
          return
        }

        setJobs(response.jobs)
        setTotal(response.meta?.total ?? response.jobs.length)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load jobs right now.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadJobs()

    return () => {
      isMounted = false
    }
  }, [deferredSearch])

  const visibleJobs = useMemo(() => {
    const filteredJobs = jobs.filter((job) =>
      locationFilter
        ? job.location.toLowerCase().includes(locationFilter.toLowerCase())
        : true,
    )

    const nextJobs = [...filteredJobs]
    if (sortBy === 'salary_desc') {
      nextJobs.sort((left, right) => (right.salary_max ?? right.salary_min ?? 0) - (left.salary_max ?? left.salary_min ?? 0))
      return nextJobs
    }

    nextJobs.sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    )
    return nextJobs
  }, [jobs, locationFilter, sortBy])

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white pb-24">
      <section className="bg-primary text-white pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <h1 className="font-heading text-4xl md:text-6xl font-bold">OPEN POSITIONS</h1>

          <div className="bg-white p-2 flex flex-col md:flex-row gap-2 shadow-xl border-4 border-primary">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Job title or description..."
                className="w-full pl-12 pr-4 py-3 bg-transparent text-primary outline-none font-medium placeholder:text-muted-foreground"
              />
            </div>
            <div className="hidden md:block w-px bg-border my-2" />
            <div className="relative flex-1 flex items-center">
              <MapPin className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="Filter by location"
                className="w-full pl-12 pr-4 py-3 bg-transparent text-primary outline-none font-medium placeholder:text-muted-foreground"
              />
            </div>
            <Button size="lg" className="rounded-none rounded-r-none w-full md:w-auto px-8 !py-6 text-lg" type="button" disabled>
              Live Search
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 mt-12">
        <div className={`mx-auto transition-all duration-300 ${selectedJobId ? 'max-w-7xl' : 'max-w-5xl'}`}>
          <div className="flex justify-between items-end mb-8 border-b-4 border-primary pb-4 gap-4 flex-wrap">
            <h2 className="text-2xl font-bold font-heading text-primary">
              {isLoading ? 'Loading roles...' : `${visibleJobs.length} of ${total} roles`}
            </h2>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as 'newest' | 'salary_desc')}
                className="bg-transparent font-medium text-primary outline-none border-b-2 border-border pb-1 focus:border-primary cursor-pointer w-[160px]"
              >
                <option value="newest">Newest</option>
                <option value="salary_desc">Salary: High to Low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-secondary gap-3">
              <Spinner className="size-5" />
              Loading jobs from the backend
            </div>
          ) : errorMessage ? (
            <Empty className="border-2 border-destructive/30">
              <EmptyHeader>
                <EmptyTitle>Could not load jobs</EmptyTitle>
                <EmptyDescription>{errorMessage}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : visibleJobs.length === 0 ? (
            <Empty className="border-2 border-border">
              <EmptyMedia variant="icon">
                <Search className="size-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No jobs match this search</EmptyTitle>
                <EmptyDescription>Try a broader keyword or clear the location filter.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className={`flex flex-col gap-6 transition-all duration-300 ${selectedJobId ? 'w-full lg:w-[45%]' : 'w-full'}`}>
                {visibleJobs.map((job) => (
                  <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="block">
                    <Card className={`group flex flex-col md:flex-row justify-between items-start md:items-center border-2 hover:border-primary transition-all rounded-none cursor-pointer ${selectedJobId === job.id ? 'border-primary bg-accent/20' : ''}`}>
                      <CardHeader className="flex-1 w-full md:w-auto pb-4 md:pb-6">
                      <CardTitle className="text-2xl group-hover:text-cta tracking-tight">
                        {job.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-secondary font-medium mt-4">
                        <span className="flex items-center gap-1.5 bg-accent px-2 py-1 text-sm border border-border">
                          <Building className="w-4 h-4" /> {job.tenant_name || `Tenant ${shortenId(job.tenant_id)}`}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm capitalize">
                          <Clock className="w-4 h-4 text-muted-foreground" /> {formatEnumLabel(job.job_type)}
                        </span>
                        <span className="flex items-center gap-1.5 font-bold text-chart-2 text-sm md:ml-2">
                          {formatCurrencyRange(job.salary_min, job.salary_max)}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto gap-4 md:gap-2 pb-6 md:pt-6">
                      <span className="text-sm font-medium text-muted-foreground block">
                        {formatRelativeDate(job.created_at)}
                      </span>
                      <Button variant="outline" className="group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1">
                        View Role
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                  </div>
                ))}
              </div>
              
              {selectedJobId && (
                <div className="hidden lg:block w-full lg:w-[55%]">
                  <JobDetailsPane 
                    jobId={selectedJobId} 
                    onClose={() => setSelectedJobId(null)} 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
