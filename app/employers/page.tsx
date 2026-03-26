'use client'

import { useState } from 'react'

interface Employer {
  id: string
  name: string
  logo: string
  position: string
  industry: string
  contactDate: string
  status: 'interested' | 'interview' | 'offer' | 'rejected'
  message: string
}

export default function EmployersPage() {
  const [filterStatus, setFilterStatus] = useState<Employer['status'] | 'all'>('all')

  const employers: Employer[] = [
    {
      id: '1',
      name: 'Tech Corp',
      logo: 'TC',
      position: 'Senior Full Stack Engineer',
      industry: 'Software',
      contactDate: '2 hours ago',
      status: 'interview',
      message: 'We are impressed with your application and would like to schedule an interview.',
    },
    {
      id: '2',
      name: 'Design Studios',
      logo: 'DS',
      position: 'Product Designer',
      industry: 'Design',
      contactDate: '1 day ago',
      status: 'interested',
      message: 'We would love to learn more about your design experience.',
    },
    {
      id: '3',
      name: 'Cloud Systems',
      logo: 'CS',
      position: 'DevOps Engineer',
      industry: 'Cloud Infrastructure',
      contactDate: '2 days ago',
      status: 'offer',
      message: 'We are pleased to extend an offer for the DevOps Engineer position.',
    },
    {
      id: '4',
      name: 'StartUp Inc',
      logo: 'SI',
      position: 'Full Stack Developer',
      industry: 'Software',
      contactDate: '1 week ago',
      status: 'rejected',
      message: 'Thank you for your interest. We have decided to move forward with other candidates.',
    },
    {
      id: '5',
      name: 'Mobile First Labs',
      logo: 'MF',
      position: 'React Native Developer',
      industry: 'Mobile Apps',
      contactDate: '3 days ago',
      status: 'interested',
      message: 'Your mobile development skills look promising. Let&apos;s connect!',
    },
  ]

  const getStatusColor = (status: Employer['status']) => {
    switch (status) {
      case 'interested':
        return 'bg-blue-100 text-blue-700'
      case 'interview':
        return 'bg-purple-100 text-purple-700'
      case 'offer':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: Employer['status']) => {
    switch (status) {
      case 'interested':
        return 'Interested'
      case 'interview':
        return 'Interview'
      case 'offer':
        return 'Offer'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }

  const filteredEmployers =
    filterStatus === 'all'
      ? employers
      : employers.filter((emp) => emp.status === filterStatus)

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 md:p-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-foreground">Employers That Contacted You</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all your employer interactions in one place
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(['all', 'interested', 'interview', 'offer', 'rejected'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {status === 'all' ? 'All' : getStatusLabel(status as Employer['status'])}
                </button>
              )
            )}
          </div>
        </div>

        {/* Employers List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 160px)' }}>
          <div className="divide-y divide-border">
            {filteredEmployers.map((employer) => (
              <div
                key={employer.id}
                className="p-6 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/80 to-primary/50 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {employer.logo}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {employer.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {employer.position}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(
                          employer.status
                        )}`}
                      >
                        {getStatusLabel(employer.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Industry: </span>
                        <span className="text-foreground">{employer.industry}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contacted: </span>
                        <span className="text-foreground">{employer.contactDate}</span>
                      </div>
                    </div>

                    <p className="text-sm text-foreground bg-muted/50 p-3 rounded">
                      {employer.message}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:opacity-90 transition-opacity font-medium">
                        View Message
                      </button>
                      <button className="px-4 py-2 bg-muted text-foreground text-sm rounded hover:bg-muted/80 transition-colors font-medium">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEmployers.length === 0 && (
            <div className="flex items-center justify-center h-96 text-center">
              <div>
                <p className="text-2xl mb-2">📭</p>
                <p className="text-foreground font-medium">No employers found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep applying to see employer contacts
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
