import { Separator } from "./ui/separator";

type HeadingProps = {
  title: string;
  description: string;
  breadcrumbs?: React.ReactNode;
  tabs?: React.ReactNode;
  actions?: React.ReactNode;
};

const Heading = ({
  title,
  description,
  breadcrumbs,
  tabs,
  actions,
}: HeadingProps) => {
  return (
    <>
      {breadcrumbs && <div className="px-8">{breadcrumbs}</div>}
      {tabs}
      <div className="flex justify-between flex-col px-8 gap-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
      <Separator />
    </>
  );
};

export default Heading;
