import { LucideLoaderCircle } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center self-center mt-60">
      <LucideLoaderCircle className="animate-spin h-16 w-16" />
    </div>
  );
};

export default Spinner;
