import { AgentDetail } from '@/components/network/agent-detail/AgentDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NetworkAgentDetailPage({ params }: Props) {
  const { id } = await params;
  return <AgentDetail agentId={id}/>;
}
