import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { homePath } from "@/path";
import Link from "next/link";

const notFound = () => {
  return (
    <Placeholder
      label="Ticket not found"
      button={
        <Button asChild variant="outline">
          <Link href={homePath()}>Go back to tickets</Link>
        </Button>
      }
    />
  );
};
export default notFound;
