import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ticketsPath } from "@/path";

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-3">
      <h1 className="text-8xl font-bold">403</h1>
      <p className="text-muted-foreground">
        You are not allowed to access this page.
      </p>
      <Button variant="outline" asChild>
        <Link href={ticketsPath()}>Go Back</Link>
      </Button>
    </div>
  );
};

export default ForbiddenPage;
