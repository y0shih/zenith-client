'use client'

import { useState } from 'react'

interface UserProfile {
  name: string
  headline: string
  location: string
  email: string
  phone: string
  about: string
  skills: string[]
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    headline: 'Senior Full Stack Engineer',
    location: 'San Francisco, CA',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    about: 'Passionate full-stack engineer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud infrastructure. Love mentoring junior developers and contributing to open-source projects.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'UI Design'],
    experience: [
      {
        title: 'Senior Full Stack Engineer',
        company: 'Tech Corp',
        duration: '2021 - Present',
        description: 'Leading the development of customer-facing web applications. Mentored 5 junior developers.',
      },
      {
        title: 'Full Stack Developer',
        company: 'StartUp Inc',
        duration: '2018 - 2021',
        description: 'Built and maintained multiple React applications with Node.js backends.',
      },
      {
        title: 'Frontend Developer',
        company: 'Design Studio',
        duration: '2015 - 2018',
        description: 'Developed responsive web interfaces using React and modern CSS.',
      },
    ],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                JD
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="text-2xl font-bold bg-card border border-border rounded px-2 py-1 text-foreground w-full"
                    />
                    <input
                      type="text"
                      name="headline"
                      value={profile.headline}
                      onChange={handleInputChange}
                      className="text-sm bg-card border border-border rounded px-2 py-1 text-muted-foreground w-full"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                    <p className="text-muted-foreground">{profile.headline}</p>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="divide-y divide-border overflow-y-auto" style={{ height: 'calc(100% - 150px)' }}>
          {/* Contact Info */}
          <section className="p-6 md:p-8 bg-card">
            <h2 className="text-xl font-bold text-foreground mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  />
                ) : (
                  <p className="text-foreground">{profile.email}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  />
                ) : (
                  <p className="text-foreground">{profile.phone}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  />
                ) : (
                  <p className="text-foreground">{profile.location}</p>
                )}
              </div>
            </div>
          </section>

          {/* About */}
          <section className="p-6 md:p-8 bg-card">
            <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
            {isEditing ? (
              <textarea
                name="about"
                value={profile.about}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
              />
            ) : (
              <p className="text-foreground leading-relaxed">{profile.about}</p>
            )}
          </section>

          {/* Skills */}
          <section className="p-6 md:p-8 bg-card">
            <h2 className="text-xl font-bold text-foreground mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="p-6 md:p-8 bg-card">
            <h2 className="text-xl font-bold text-foreground mb-4">Experience</h2>
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h3 className="font-semibold text-foreground">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.duration}</p>
                  <p className="text-sm text-foreground mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
