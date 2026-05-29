import type { Metadata } from 'next'
import LandingNav from '@/components/landing/LandingNav'
import Hero from '@/components/landing/Hero'
import StatsBar from '@/components/landing/StatsBar'
import DualAudience from '@/components/landing/DualAudience'
import HowItWorks from '@/components/landing/HowItWorks'
import AgentShowcase from '@/components/landing/AgentShowcase'
import FeaturedJobs from '@/components/landing/FeaturedJobs'
import Testimonials from '@/components/landing/Testimonials'
import Mission from '@/components/landing/Mission'
import FAQ from '@/components/landing/FAQ'
import SplitCTA from '@/components/landing/SplitCTA'
import LandingFooter from '@/components/landing/LandingFooter'

export const metadata: Metadata = {
  title: 'RemConnect — Premiere Talent, Global Opportunities',
  description: "Connecting Ethiopia's top professionals to remote work with companies around the world.",
}

export default function LandingPage() {
  return (
    <main style={{ overflowX: 'hidden', width: '100%', maxWidth: '100%' }}>
      <LandingNav />
      <Hero />
      <StatsBar />
      <DualAudience />
      <HowItWorks />
      <AgentShowcase />
      <FeaturedJobs />
      <Testimonials />
      <Mission />
      <FAQ />
      <SplitCTA />
      <LandingFooter />
    </main>
  )
}
