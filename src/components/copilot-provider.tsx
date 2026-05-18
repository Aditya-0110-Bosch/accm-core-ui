import { createContext, useContext, useMemo, useState } from "react";
import { api } from "@/lib/api";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type CopilotContextValue = {
  open: boolean;
  sending: boolean;
  messages: ChatMessage[];
  setOpen: (open: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  openWithPrompt: (text: string) => Promise<void>;
};

const CopilotContext = createContext<CopilotContextValue | null>(null);

const DEFAULT_MESSAGE =
  "Hi Aarav - I can help you build demands, surface candidates, and analyze workforce signals. What would you like to do?";

function extractField(input: string, key: string): string {
  const regex = new RegExp(`(?:${key})\\s*:\\s*([^;\\n]+)`, "i");
  return input.match(regex)?.[1]?.trim() || "";
}

function parseCreateDemand(text: string) {
  const role = extractField(text, "role");
  const cluster = extractField(text, "cluster");
  const loc = extractField(text, "location|loc");
  const duration = extractField(text, "duration");
  const priority = extractField(text, "priority");
  const rawSkills = extractField(text, "skills");
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

  return {
    role,
    cluster,
    skills,
    loc,
    duration,
    priority: normalizedPriority as "Critical" | "High" | "Medium",
  };
}

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: DEFAULT_MESSAGE },
  ]);

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
            content: `Done. Demand ${created.id} created for ${created.role} in ${created.loc} with priority ${created.priority}.`,
          },
        ]);
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
    () => ({ open, sending, messages, setOpen, sendMessage, openWithPrompt }),
    [open, sending, messages]
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
