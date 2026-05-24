"use client";

import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { LucideMail, LucideShield } from "lucide-react";

type MembershipCardsProps = {
  memberships: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    joinedAt: string;
    role: string;
  }[];
};

const MembershipCards = ({ memberships }: MembershipCardsProps): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-y-2">
      <AnimatePresence initial={false}>
        {memberships.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -60, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-4 border rounded-md flex flex-col gap-y-1"
          >
            <div className="flex items-center gap-x-2">
              <span className="font-semibold truncate">{m.name}</span>
              <Badge variant="outline" className="capitalize shrink-0 text-xs">{m.role}</Badge>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-x-1">
              <LucideMail className="size-3" />
              {m.email}
            </span>
            <span className="text-xs text-muted-foreground">
              Joined {m.joinedAt}
            </span>
            <div className="flex items-center gap-x-1 mt-1">
              <LucideShield className="size-3" />
              <Badge variant={m.emailVerified ? "default" : "secondary"} className="text-xs">
                {m.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MembershipCards;
