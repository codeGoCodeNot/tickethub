import Heading from "@/components/heading";
import { ticketsPath } from "@/path";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading title="Home Page" description="Your home place to to start" />

      <div className="flex flex-1 flex-col items-center">
        <Link href={ticketsPath()} className="underline">
          Go Tickets
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
