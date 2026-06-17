import { getAgentLeadsQueue } from '@/lib/data/leads'
import { VideoQueue } from '@/components/video-queue/VideoQueue'

export default async function VideoQueuePage() {
  const { leads, error } = await getAgentLeadsQueue()
  return <VideoQueue leads={leads} error={error} />
}
