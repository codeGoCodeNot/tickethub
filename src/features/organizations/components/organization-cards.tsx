"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { organization, useActiveOrganization } from "@/lib/auth-client";
import { LucideLoaderCircle, LucideMenu, LucideUsers } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import OrganizationMoreMenu from "./organization-more-menu";
import { motion } from "framer-motion";

type OrganizationCardsProps = {
  organizations: {
    id: string;
    name: string;
    joinedAt: string;
    members: number;
  }[];
};

const OrganizationCards = ({
  organizations,
}: OrganizationCardsProps): React.JSX.Element => {
  const { data: activeOrg } = useActiveOrganization();
  const [optimisticActiveId, setOptimisticActiveId] = useState<string | null>(
    null,
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const effectiveActiveId = optimisticActiveId ?? activeOrg?.id;

  const handleSwitch = async (id: string, name: string) => {
    setOptimisticActiveId(id);
    setPendingId(id);
    await organization.setActive({ organizationId: id });
    toast.success(`Switched to ${name}`);
    setPendingId(null);
  };

  return (
    <div className="flex flex-col gap-y-2">
      {organizations.map((org) => {
        const isActive = effectiveActiveId === org.id;
        const isPending = pendingId === org.id;
        return (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative p-4 border rounded-md flex flex-col gap-y-1"
          >
            <div className="absolute top-2 right-2 z-[10]">
              <OrganizationMoreMenu
                isActive={isActive}
                onSwitch={() => handleSwitch(org.id, org.name)}
                trigger={
                  <Button variant="ghost" size="icon">
                    <LucideMenu />
                  </Button>
                }
              />
            </div>
            <div className="flex items-center gap-x-2 pr-10">
              <span className="font-semibold truncate">{org.name}</span>
              {isActive &&
                (isPending ? (
                  <LucideLoaderCircle className="animate-spin size-3 shrink-0" />
                ) : (
                  <Badge className="shrink-0 text-xs" variant="secondary">
                    Active
                  </Badge>
                ))}
            </div>
            <span className="text-xs text-muted-foreground">
              Joined {org.joinedAt}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-x-1">
              <LucideUsers className="size-3" />
              {org.members} members
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OrganizationCards;
