'use client';
import React, { useState, useEffect, FormEvent } from 'react';

export default function RulesPage() {
  const [rules, setRules] = useState<any>([]);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => { fetch('/api/v1/rules').then(r => r.json()).then(setRules); }, []);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    data.enabled = data.enabled === 'on' ? 1 : 0;
    await fetch(editing ? `/api/v1/rules/${editing.id}` : '/api/v1/rules', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setEditing(null);
    fetch('/api/v1/rules').then(r => r.json()).then(setRules);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Rules</h1>
      <form onSubmit={save} className="my-4 grid grid-cols-2 gap-4 border p-4">
        <select name="type" className="border p-2"><option value="global">Global</option><option value="device">Device</option></select>
        <input name="target" className="border p-2" placeholder="Target MAC" />
        <select name="action" className="border p-2"><option value="BLOCK">Block</option><option value="ALLOW">Allow</option></select>
        <input name="domain" className="border p-2" placeholder="domain.com" />
        <select name="category" className="border p-2"><option value="">Category</option><option value="Ads">Ads</option></select>
        <select name="schedule" className="border p-2"><option value="">Schedule</option><option value="school-hours">School Hours</option></select>
        <input name="priority" type="number" className="border p-2" placeholder="Priority" />
        <label><input name="enabled" type="checkbox" defaultChecked /> Enabled</label>
        <button className="bg-blue-600 text-white p-2">Save Rule</button>
      </form>
      <table className="w-full border mt-4 text-left">
        <thead className="bg-gray-100"><tr><th>Priority</th><th>Type</th><th>Rule</th><th>Action</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {rules.map((r: any) => (
            <tr key={r.id} className="border-b">
              <td>{r.priority}</td>
              <td>{r.type}</td>
              <td>{r.target || r.domain || r.category}</td>
              <td>{r.action}</td>
              <td>{r.enabled ? 'Enabled' : 'Disabled'}</td>
              <td>
                <button onClick={() => setEditing(r)} className="mr-2 text-blue-600">Edit</button>
                <button onClick={() => { fetch(`/api/v1/rules/${r.id}`, { method: 'DELETE' }).then(() => fetch('/api/v1/rules').then(r => r.json()).then(setRules)); }} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
