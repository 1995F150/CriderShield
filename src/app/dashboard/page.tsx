'use client';

import React from 'react';
import { StatCard } from '../../components/dashboard/StatCard';
import { useServerTelemetry } from '../../hooks/useServerTelemetry';
import ProgressBar from '../../components/dashboard/ProgressBar';
import { 
  Activity, Shield, Cpu, HardDrive, Clock, Server, 
  Terminal, Monitor, Database 
} from 'lucide-react';

export default function Dashboard() {
  const { data: telemetry, error } = useServerTelemetry();

  if (error) {
    return (
      <div className="p-6 text-rose-500 bg-rose-500/10 rounded-lg border border-rose-500/20">
        Error connecting to server telemetry: {error}
      </div>
    );
  }

  if (!telemetry) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400">
        <Activity className="w-6 h-6 mr-2 animate-pulse" />
        Connecting to live server stream...
      </div>
    );
  }

  // Calculate usage percentages
  const cpuPercent = telemetry.load.currentLoad;
  const memPercent = (telemetry.mem.active / telemetry.mem.total) * 100;
  const disk = telemetry.fs[0];
  const diskPercent = disk.use;

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="CPU Load" 
          value={`${cpuPercent.toFixed(1)}%`} 
          icon={<Cpu />} 
          status={cpuPercent > 85 ? 'rose' : cpuPercent > 60 ? 'amber' : 'green'} 
        />
        <StatCard 
          title="Memory Usage" 
          value={`${(telemetry.mem.active / 1024 / 1024 / 1024).toFixed(1)} GB`} 
          icon={<Database />} 
          status={memPercent > 85 ? 'rose' : memPercent > 60 ? 'amber' : 'green'} 
        />
        <StatCard 
          title="Storage Used" 
          value={`${diskPercent.toFixed(1)}%`} 
          icon={<HardDrive />} 
          status={diskPercent > 85 ? 'rose' : diskPercent > 60 ? 'amber' : 'green'} 
        />
        <StatCard 
          title="Uptime" 
          value={`${Math.floor(telemetry.time.uptime / 3600)}h ${Math.floor((telemetry.time.uptime % 3600) / 60)}m`} 
          icon={<Clock />} 
          status="neutral" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Information */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center mb-6">
            <Server className="w-5 h-5 text-indigo-400 mr-2" />
            <h2 className="text-lg font-semibold text-slate-100">System Information</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400">OS</span>
              <span className="text-slate-100 font-medium">{telemetry.os.distro} {telemetry.os.release}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Kernel</span>
              <span className="text-slate-100 font-medium">{telemetry.os.kernel}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Architecture</span>
              <span className="text-slate-100 font-medium">{telemetry.os.arch}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Hostname</span>
              <span className="text-slate-100 font-medium">{telemetry.os.hostname}</span>
            </div>
          </div>
        </div>

        {/* Hardware Usage Details */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center mb-6">
            <Monitor className="w-5 h-5 text-emerald-400 mr-2" />
            <h2 className="text-lg font-semibold text-slate-100">Hardware Usage</h2>
          </div>
          <ProgressBar label="CPU Core Load" value={cpuPercent} max={100} />
          <ProgressBar 
            label="Memory (Active)" 
            value={telemetry.mem.active / 1024 / 1024 / 1024} 
            max={telemetry.mem.total / 1024 / 1024 / 1024} 
            unit=" GB" 
          />
          <ProgressBar 
            label="Disk Storage" 
            value={disk.used / 1024 / 1024 / 1024} 
            max={disk.size / 1024 / 1024 / 1024} 
            unit=" GB" 
          />
        </div>
      </div>

      {/* Top Processes */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center mb-6">
          <Terminal className="w-5 h-5 text-amber-400 mr-2" />
          <h2 className="text-lg font-semibold text-slate-100">Top Processes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-slate-700">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">PID</th>
                <th className="pb-3 font-medium text-right">CPU%</th>
                <th className="pb-3 font-medium text-right">MEM%</th>
                <th className="pb-3 font-medium">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {telemetry.proc.list.slice(0, 10).map((proc: any) => (
                <tr key={proc.pid} className="text-sm">
                  <td className="py-3 text-slate-100 font-medium">{proc.name}</td>
                  <td className="py-3 text-slate-400">{proc.pid}</td>
                  <td className="py-3 text-right text-slate-100">{proc.cpu.toFixed(1)}%</td>
                  <td className="py-3 text-right text-slate-100">{proc.mem.toFixed(1)}%</td>
                  <td className="py-3 text-slate-400">{proc.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
