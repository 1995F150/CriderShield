'use client';
import React, { useEffect, useState } from 'react';
import { Shield, Clock, Tag, Trash2, Plus } from 'lucide-react';

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [devices, setDevices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newRule, setNewRule] = useState({ mac_address: '', category_id: '', schedule_id: '', action: 'Block' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [r, d, c, s] = await Promise.all([
        fetch('http://localhost:3000/api/v1/rules').then(res => res.json()),
        fetch('http://localhost:3000/api/v1/devices').then(res => res.json()),
        fetch('http://localhost:3000/api/v1/rules/categories').then(res => res.json()),
        fetch('http://localhost:3000/api/v1/rules/schedules').then(res => res.json()),
      ]);
      setRules(r || []);
      setDevices(d || []);
      setCategories(c || []);
      setSchedules(s || []);
    } catch (e) {
      console.error('Error fetching rules data', e);
    }
  };

  const handleAddRule = async () => {
    if (!newRule.mac_address || !newRule.category_id) return;
    await fetch('http://localhost:3000/api/v1/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRule)
    });
    setNewRule({ mac_address: '', category_id: '', schedule_id: '', action: 'Block' });
    fetchData();
  };

  const handleDeleteRule = async (id: number) => {
    await fetch(`http://localhost:3000/api/v1/rules/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold dark:text-white flex items-center">
        <Shield className="mr-2 text-blue-500" /> Access Control Rules
      </h1>
      
      {/* Add Rule Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold dark:text-white flex items-center">
          <Plus className="mr-2 text-green-500" size={20}/> Create New Rule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="border p-2 rounded dark:bg-gray-700 dark:text-white" value={newRule.mac_address} onChange={e => setNewRule({...newRule, mac_address: e.target.value})}>
            <option value="">Select Device</option>
            {devices.map((d: any) => <option key={d.mac_address} value={d.mac_address}>{d.friendly_name || d.hostname || d.mac_address}</option>)}
          </select>
          <select className="border p-2 rounded dark:bg-gray-700 dark:text-white" value={newRule.category_id} onChange={e => setNewRule({...newRule, category_id: e.target.value})}>
            <option value="">Select Category</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="border p-2 rounded dark:bg-gray-700 dark:text-white" value={newRule.schedule_id} onChange={e => setNewRule({...newRule, schedule_id: e.target.value})}>
            <option value="">Always On (Default)</option>
            {schedules.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button onClick={handleAddRule} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">Add Rule</button>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rules.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No rules configured.</td>
              </tr>
            ) : rules.map((r: any) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{r.mac_address}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 flex items-center">
                  <Tag className="mr-2 text-purple-400" size={16}/> {r.category_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    <Clock className="mr-2 text-orange-400" size={16}/> {r.schedule_name || 'Always'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${r.action === 'Block' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {r.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDeleteRule(r.id)} className="text-red-600 hover:text-red-900 transition p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
