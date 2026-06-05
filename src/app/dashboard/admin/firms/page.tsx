"use client";
import { useEffect, useState } from "react";

type Firm = {
  id: string;
  name: string;
  inn: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  status: string;
  createdAt: string;
  owner: { name: string; email: string };
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "На проверке",
  APPROVED: "Одобрена",
  REJECTED: "Отклонена",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-sun-100 text-sun-700",
  APPROVED: "bg-success-100 text-success-700",
  REJECTED: "bg-accent/10 text-accent",
};

export default function AdminFirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/firms");
    const data = await res.json();
    setFirms(data.firms ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/firms/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (loading) return <div className="card text-ink-500">Загрузка…</div>;

  return (
    <div className="space-y-4">
      <h1 className="heading-serif text-2xl">Юридические конторы</h1>
      {firms.length === 0 ? (
        <div className="card text-ink-500">Заявок пока нет.</div>
      ) : (
        firms.map(firm => (
          <div key={firm.id} className="card space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="font-bold text-lg">{firm.name}</div>
                <div className="text-xs text-ink-400 mt-0.5">
                  ИНН: {firm.inn} · Владелец: {firm.owner.name} ({firm.owner.email})
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[firm.status] ?? ""}`}>
                {STATUS_LABEL[firm.status] ?? firm.status}
              </span>
            </div>
            <div className="text-sm text-ink-600 space-y-1">
              <div>📍 {firm.address}</div>
              {firm.phone && <div>📞 {firm.phone}</div>}
              {firm.website && <div>🌐 <a href={firm.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">{firm.website}</a></div>}
              {firm.description && <div className="text-ink-500 pt-1">{firm.description}</div>}
            </div>
            <div className="flex gap-2 pt-1">
              {firm.status !== "APPROVED" && (
                <button
                  onClick={() => setStatus(firm.id, "APPROVED")}
                  className="btn-primary text-sm px-4 py-1.5"
                >
                  Одобрить
                </button>
              )}
              {firm.status !== "REJECTED" && (
                <button
                  onClick={() => setStatus(firm.id, "REJECTED")}
                  className="btn-outline text-sm px-4 py-1.5 text-accent border-accent/30 hover:bg-accent/5"
                >
                  Отклонить
                </button>
              )}
              {firm.status !== "PENDING" && (
                <button
                  onClick={() => setStatus(firm.id, "PENDING")}
                  className="btn-outline text-sm px-4 py-1.5"
                >
                  На проверку
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
