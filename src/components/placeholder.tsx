import { LucideTriangleAlert } from "lucide-react";

type PlaceholderProps = {
  label: string;
  icon?: React.ReactNode;
  button?: React.ReactNode;
};

const Placeholder = ({
  label,
  icon = <LucideTriangleAlert className="text-red-600 w-16 h-16" />,
  button = null,
}: PlaceholderProps) => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-y-4">
        <div className="mb-4">{icon}</div>
        <div className="flex flex-col gap-y-2">
          <h2 className="text-lg text-center text-foreground font-medium">
            {label}
          </h2>
          <div>{button}</div>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
