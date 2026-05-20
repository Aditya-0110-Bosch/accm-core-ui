import { createContext, useContext, useMemo, useState } from "react";
import { api, type CandidatePreview } from "@/lib/api";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type PendingAllocation = {
  demandId: string;
  candidates: CandidatePreview[];
};

type CopilotContextValue = {
  open: boolean;
  sending: boolean;
  messages: ChatMessage[];
  pendingAllocation: PendingAllocation | null;
  setOpen: (open: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  openWithPrompt: (text: string) => Promise<void>;
  approveCandidate: (talentId: number) => Promise<void>;
  approveAll: () => Promise<void>;
  rejectAllocation: () => void;
};

const CopilotContext = createContext<CopilotContextValue | null>(null);

const DEFAULT_MESSAGE =
  "Hi Aarav - I can help you build demands, surface candidates, and analyze workforce signals. What would you like to do?";

function extractField(input: string, key: string): string {
  const regex = new RegExp(`(?:${key})\\s*:\\s*([^;\\n]+)`, "i");
  return input.match(regex)?.[1]?.trim() || "";
}

function formatAllocationReply(created: {
  id: string;
  role: string;
  loc: string;
  priority: string;
}) {
  return [
    `Demand **${created.id}** created for **${created.role}** in ${created.loc} (${created.priority} priority).`,
    "",
    `When you're ready to allocate, say: **allocate demand ${created.id}**`,
  ].join("\n");
}

function parseCreateDemand(text: string) {
  const role = extractField(text, "role");
  const cluster = extractField(text, "cluster");
  const loc = extractField(text, "location|loc");
  const duration = extractField(text, "duration");
  const priority = extractField(text, "priority");
  const rawSkills = extractField(text, "skills");
  const capacityStr = extractField(text, "capacity|cap");
  const skills = rawSkills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!role || !cluster || !loc || !duration || !priority || skills.length === 0) {
    return null;
  }

  const normalizedPriority =
    priority.toLowerCase().startsWith("c")
      ? "Critical"
      : priority.toLowerCase().startsWith("h")
        ? "High"
        : "Medium";

  const required_capacity = capacityStr ? Math.min(1.2, Math.max(0.1, parseFloat(capacityStr) || 1.0)) : 1.0;

  return {
    role,
    cluster,
    skills,
    loc,
    duration,
    priority: normalizedPriority as "Critical" | "High" | "Medium",
    required_capacity,
  };
}

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: DEFAULT_MESSAGE },
  ]);
  const [pendingAllocation, setPendingAllocation] = useState<PendingAllocation | null>(null);

  const approveCandidate = async (talentId: number) => {
    if (!pendingAllocation) return;
    setSending(true);
    try {
      const result = await api.confirmAllocation(pendingAllocation.demandId, [talentId]);
      const name = result.allocated[0]?.name || "Candidate";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `${name} has been allocated to ${pendingAllocation.demandId}.` },
      ]);
      setPendingAllocation(null);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error instanceof Error ? error.message : "Allocation failed." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const approveAll = async () => {
    if (!pendingAllocation) return;
    setSending(true);
    try {
      const allIds = pendingAllocation.candidates.map((c) => c.talent_id);
      const result = await api.confirmAllocation(pendingAllocation.demandId, allIds);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.message },
      ]);
      setPendingAllocation(null);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error instanceof Error ? error.message : "Allocation failed." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const rejectAllocation = () => {
    setPendingAllocation(null);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Allocation cancelled. No candidates were assigned." },
    ]);
  };

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || sending) return;

    const userMessage: ChatMessage = { role: "user", content };
    const next = [...messages, userMessage];
    setMessages(next);
    setSending(true);

    try {
      const lower = content.toLowerCase();

      if (lower.includes("how many") && lower.includes("demand")) {
        const count = await api.getDemandCount();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `You currently have ${count.total} total demands in the system.`,
          },
        ]);
        return;
      }

      if (lower.startsWith("create demand") || lower.includes("create a demand")) {
        const draft = parseCreateDemand(content);
        if (!draft) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "I can create it right now. Use this format: Create demand; role: Senior ML Engineer; cluster: Data, AI & ML; skills: PyTorch, LLM Eval, Vector DB; loc: Bengaluru - Hybrid; duration: 9 months; priority: Critical",
            },
          ]);
          return;
        }

        const created = await api.createDemand(draft);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: formatAllocationReply(created),
          },
        ]);
        return;
      }

      const allocateMatch = content.match(/allocate\s+(?:demand\s+)?(DM-\d{4}-\d{6})/i);
      if (allocateMatch) {
        const demandId = allocateMatch[1].toUpperCase();
        const result = await api.getCandidates(demandId);
        if (result.candidates.length === 0) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `No available candidates found for ${demandId}.` },
          ]);
        } else {
          setPendingAllocation({ demandId, candidates: result.candidates });
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Found ${result.candidates.length} candidate(s) for ${demandId}. Please review and approve below.`,
            },
          ]);
        }
        return;
      }

      const result = await api.copilotChat(next);
      setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
    } catch (error) {
      const fallback =
        error instanceof Error && error.message.includes("Failed to fetch")
          ? "I cannot reach the backend right now. Please start the backend at http://127.0.0.1:8000 and try again."
          : error instanceof Error
            ? `Request failed: ${error.message}`
            : "Request failed.";

      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
    } finally {
      setSending(false);
    }
  };

  const openWithPrompt = async (text: string) => {
    setOpen(true);
    await sendMessage(text);
  };

  const value = useMemo(
    () => ({ open, sending, messages, pendingAllocation, setOpen, sendMessage, openWithPrompt, approveCandidate, approveAll, rejectAllocation }),
    [open, sending, messages, pendingAllocation]
  );

  return <CopilotContext.Provider value={value}>{children}</CopilotContext.Provider>;
}

export function useCopilot() {
  const value = useContext(CopilotContext);
  if (!value) {
    throw new Error("useCopilot must be used within CopilotProvider");
  }
  return value;
}
