"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActiveOrganization } from "@/lib/auth-client";
import { LucideMenu, LucideUsers } from "lucide-react";
import { useState } from "react";
import OrganizationMoreMenu from "./organization-more-menu";

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
  const effectiveActiveId = optimisticActiveId ?? activeOrg?.id;

  return (
    <div className="flex flex-col gap-y-2">
      {organizations.map((org) => {
        const isActive = effectiveActiveId === org.id;
        return (
          <div
            key={org.id}
            className="relative p-4 border rounded-md flex flex-col gap-y-1"
          >
            <div className="absolute top-2 right-2 z-[10]">
              <OrganizationMoreMenu
                id={org.id}
                name={org.name}
                isActive={isActive}
                onSwitch={() => setOptimisticActiveId(org.id)}
                trigger={
                  <Button variant="ghost" size="icon">
                    <LucideMenu />
                  </Button>
                }
              />
            </div>
            <div className="flex items-center gap-x-2 pr-10">
              <span className="font-semibold truncate">{org.name}</span>
              {isActive && (
                <Badge className="shrink-0 text-xs" variant="secondary">
                  Active
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Joined {org.joinedAt}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-x-1">
              <LucideUsers className="size-3" />
              {org.members} members
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default OrganizationCards;
