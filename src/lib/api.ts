const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

type FetchOptions = RequestInit & {
  bodyJson?: unknown;
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { bodyJson, headers, ...rest } = options;
  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: bodyJson === undefined ? rest.body : JSON.stringify(bodyJson),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }

  return (await response.json()) as T;
}

export type OverviewResponse = {
  kpis: Array<{ label: string; value: string; delta: string }>;
  activity: Array<{ who: string; what: string; target: string; time: string; score?: number | null }>;
};

export type ProjectStatus = "Planning" | "Staffing" | "In Flight" | "At Risk" | "Closing";

export type Project = {
  id: string;
  name: string;
  client: string;
  bu: string;
  delivery: string;
  timeline: string;
  status: ProjectStatus;
  fulfillment: number;
  capacity: "healthy" | "watch" | "critical";
  openDemands: number;
  assigned: number;
  required: number;
  clusters: string[];
  pm: string;
};

export type Demand = {
  id: string;
  role: string;
  cluster: string;
  skills: string[];
  loc: string;
  duration: string;
  priority: "Critical" | "High" | "Medium";
  applicants: number;
  match: number;
  status: string;
  isNew?: boolean;
};

export type SkillsResponse = {
  tree: Array<{ name: string; count: number; children?: Array<{ name: string; count: number }> }>;
  primarySkills: Array<{ n: string; lvl: string; talents: number }>;
  insight: string;
};

export type TalentResponse = {
  profile: { name: string; location: string; role: string; completeness: number };
  topSkills: string[];
  applications: Array<{ id: string; role: string; stage: string; match: number }>;
  recommendations: Array<{ role: string; loc: string; match: number }>;
};

export type AIMatchingResponse = {
  engines: Array<{ name: string; desc: string; status: string; calls: string }>;
  candidates: Array<{ name: string; role: string; match: number; gaps: number; badges: string[] }>;
};

export type InsightsResponse = {
  outcomes: Array<{ label: string; value: string; delta: number; positive: boolean; sub: string }>;
  forecast: Array<{ q: string; d: number; s: number }>;
};

export type GovernanceResponse = {
  roles: Array<{ id: string; name: string; members: number; scope: string; highlight?: boolean }>;
  capabilities: string[];
  matrix: Record<string, Record<string, "full" | "scoped" | "read" | "none">>;
  workflows: Array<{ title: string; stages: string[]; meta: string }>;
};

export type AdminResponse = {
  stats: Array<{ label: string; value: string; sub: string }>;
  approvalQueue: Array<{ skill: string; type: string; owner: string; sla: string; urgent: boolean }>;
  auditLog: Array<{ text: string; who: string; time: string }>;
  platformHealth: Array<{ label: string; status: string; warn?: boolean }>;
};

export type CopilotResponse = { reply: string; model: string };

export const api = {
  getOverview: () => request<OverviewResponse>("/api/overview"),
  getProjects: (filter = "All") => request<{ projects: Project[] }>(`/api/projects?filter=${encodeURIComponent(filter)}`),
  getMarketplace: () => request<{ total?: number; demands: Demand[] }>("/api/marketplace"),
  getDemandCount: () => request<{ total: number }>("/api/demands/count"),
  createDemand: (payload: Omit<Demand, "id" | "applicants" | "match" | "status" | "isNew">) =>
    request<Demand>("/api/marketplace", { method: "POST", bodyJson: payload }),
  getSkills: () => request<SkillsResponse>("/api/skills"),
  getTalent: () => request<TalentResponse>("/api/talent"),
  getAIMatching: (demandId = "DM-2026-000145") =>
    request<AIMatchingResponse>(`/api/ai-matching?demand_id=${encodeURIComponent(demandId)}`),
  getInsights: () => request<InsightsResponse>("/api/insights"),
  getGovernance: () => request<GovernanceResponse>("/api/governance"),
  getAdmin: () => request<AdminResponse>("/api/admin"),
  copilotChat: (messages: Array<{ role: "user" | "assistant"; content: string }>) =>
    request<CopilotResponse>("/api/copilot/chat", { method: "POST", bodyJson: { messages } }),
};
