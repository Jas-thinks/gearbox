type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  [key: string]: unknown;
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const output = formatLog(entry);

  switch (level) {
    case "error":
      console.error(output);
      break;
    case "warn":
      console.warn(output);
      break;
    default:
      console.log(output);
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),

  apiCall: (
    method: string,
    path: string,
    requestId: string,
    meta?: Record<string, unknown>
  ) => {
    log("info", "API request", { method, path, requestId, ...meta });
  },

  waitlistSignup: (email: string, requestId: string, city: string) => {
    log("info", "Waitlist signup", { email, city, requestId, action: "waitlist.signup" });
  },

  contactSubmission: (email: string, requestId: string, subject: string) => {
    log("info", "Contact submission", { email, subject, requestId, action: "contact.submit" });
  },
};
