import { Inngest, EventSchemas } from "inngest";
import type { MainGoal } from "../types";

type Events = {
  "audit/requested": {
    data: {
      auditId: string;
      businessName: string;
      websiteUrl: string;
      founders?: string[];
      industry?: string;
      contactEmail: string;
      mainGoal: MainGoal;
    };
  };
};

export const inngest = new Inngest({
  id: "ai-audit-engine",
  schemas: new EventSchemas().fromRecord<Events>()
});
