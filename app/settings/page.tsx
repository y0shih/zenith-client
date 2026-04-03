'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { 
  User, 
  Settings, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Save,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

type SettingsSection = 'profile' | 'account' | 'notifications' | 'security'

const SECTION_CONFIG: Record<SettingsSection, { label: string; icon: any }> = {
  profile: { label: 'Public Profile', icon: User },
  account: { label: 'Account Settings', icon: Settings },
  notifications: { label: 'Notifications', icon: Bell },
  security: { label: 'Security', icon: Shield },
}

const slideVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-border bg-card p-4 md:p-6 space-y-2">
        <div className="mb-8 px-2">
          <h1 className="font-heading text-xl font-bold text-primary tracking-tight">Settings</h1>
          <p className="text-xs text-secondary font-medium uppercase tracking-widest mt-1">Management Apex</p>
        </div>

        <nav className="space-y-1">
          {(Object.keys(SECTION_CONFIG) as SettingsSection[]).map((key) => {
            const { label, icon: Icon } = SECTION_CONFIG[key]
            const isActive = activeSection === key
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-primary-foreground border-l-2 border-cta' 
                    : 'text-secondary hover:bg-muted hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-secondary group-hover:text-primary'}`} />
                  <span className="text-sm font-bold tracking-tight">{label}</span>
                </div>
                {isActive && <ChevronRight className="w-3 h-3" />}
              </button>
            )
          })}
        </nav>

        <div className="pt-8 mt-8 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-destructive hover:bg-destructive/5 transition-colors group">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-4xl overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-10"
          >
            {/* Header */}
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary tracking-tight">
                {SECTION_CONFIG[activeSection].label}
              </h2>
              <p className="text-secondary mt-2 font-medium">
                Manage your {activeSection} preferences and settings.
              </p>
            </div>

            <Separator className="bg-muted" />

            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="s-name" className="text-xs font-bold uppercase tracking-widest text-secondary/60">Full Name</Label>
                    <Input id="s-name" placeholder="John Doe" className="rounded-none border-0 border-b-2 border-muted focus-visible:border-cta bg-transparent px-0 py-4 h-auto text-lg transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-headline" className="text-xs font-bold uppercase tracking-widest text-secondary/60">Headline</Label>
                    <Input id="s-headline" placeholder="Senior Backend Engineer" className="rounded-none border-0 border-b-2 border-muted focus-visible:border-cta bg-transparent px-0 py-4 h-auto text-lg transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="s-bio" className="text-xs font-bold uppercase tracking-widest text-secondary/60">Bio</Label>
                  <Textarea id="s-bio" rows={4} placeholder="Briefly describe your expertise..." className="rounded-none border-2 border-muted focus-visible:border-cta bg-transparent p-4 text-base transition-colors" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-secondary/60">Profile Visibility</Label>
                  <div className="flex items-center justify-between p-4 bg-muted/30 border border-border">
                    <div>
                      <p className="text-sm font-bold text-primary">Public Search</p>
                      <p className="text-xs text-secondary font-medium">Allow employers to find you in search results.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="pt-6">
                  <Button className="rounded-none h-12 px-8 bg-primary hover:bg-cta transition-colors font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Account Section */}
            {activeSection === 'account' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="s-email" className="text-xs font-bold uppercase tracking-widest text-secondary/60">Primary Email</Label>
                  <Input id="s-email" type="email" placeholder="john@example.com" className="rounded-none border-0 border-b-2 border-muted focus-visible:border-cta bg-transparent px-0 py-4 h-auto text-lg transition-colors" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-secondary/60">Language Preference</Label>
                  <div className="p-4 bg-muted/30 border border-border flex items-center justify-between">
                    <span className="text-sm font-bold">English (US)</span>
                    <Button variant="outline" size="sm" className="rounded-none text-[10px] uppercase font-bold tracking-widest border-2">Change</Button>
                  </div>
                </div>

                <div className="pt-10 border-t border-muted">
                    <h3 className="text-sm font-bold text-destructive uppercase tracking-widest mb-4">Danger Zone</h3>
                    <div className="p-4 border-2 border-destructive/20 bg-destructive/5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold text-primary">Deactivate Account</p>
                            <p className="text-xs text-secondary font-medium mt-0.5">This action is irreversible. All data will be removed.</p>
                        </div>
                        <Button variant="destructive" size="sm" className="rounded-none font-bold uppercase text-[10px] tracking-widest">
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                {[
                  { title: 'Job Alerts', desc: 'Get notified when new jobs matching your skills are posted.' },
                  { title: 'Application Updates', desc: 'Receive alerts when an employer views or updates your application status.' },
                  { title: 'Messages', desc: 'Direct messages from employers and collaborators.' },
                  { title: 'Platform Updates', desc: 'Occasional news about Zenith platform features.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border bg-card">
                    <div>
                      <p className="text-sm font-bold text-primary">{item.title}</p>
                      <p className="text-xs text-secondary font-medium">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={i < 3} />
                  </div>
                ))}
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-secondary/60">Current Password</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-none border-0 border-b-2 border-muted focus-visible:border-cta bg-transparent px-0 py-4 h-auto text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-secondary/60">New Password</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-none border-0 border-b-2 border-muted focus-visible:border-cta bg-transparent px-0 py-4 h-auto text-lg" />
                  </div>
                </div>

                <div className="p-4 bg-muted/30 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cta/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-cta" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Two-Factor Authentication</p>
                      <p className="text-xs text-secondary font-medium">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-none text-[10px] uppercase font-bold tracking-widest border-2">Enable</Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
