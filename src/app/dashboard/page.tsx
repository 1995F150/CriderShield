import React from 'react';
import { StatCard } from '../../components/dashboard/StatCard';
import { useNetworkStats } from '../../hooks/useNetworkStats';
import { Activity, Shield, Cpu, HardDrive, Clock, Server, Globe } from 'lucide-react';
export default function Dashboard() {
  const stats = useNetworkStats();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="DNS Requests" value={stats.dnsRequests} icon={Activity} status="neutral" />
      <StatCard title="Blocked Queries" value={stats.blockedRequests} icon={Shield} status="green" />
      <StatCard title="CPU Usage" value={stats.cpu} icon={Cpu} status={parseInt(stats.cpu) > 80 ? 'rose' : 'green'} />
      <StatCard title="Memory Usage" value={stats.ram} icon={HardDrive} status="neutral" />
      <StatCard title="Storage" value={stats.storage} icon={HardDrive} status="neutral" />
      <StatCard title="Uptime" value={stats.uptime} icon={Clock} status="neutral" />
      <StatCard title="Docker Status" value={stats.dockerStatus} icon={Server} status={stats.dockerStatus === 'Healthy' ? 'green' : 'amber'} />
      <StatCard title="Tunnel Status" value={stats.tunnelStatus} icon={Globe} status={stats.tunnelStatus === 'Online' ? 'green' : 'rose'} />
    </div>
  );
}
