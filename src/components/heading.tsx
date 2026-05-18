import { Separator } from "./ui/separator";

type HeadingProps = {
  title: string;
  description: string;
  breadcrumbs?: React.ReactNode;
  tabs?: React.ReactNode;
};

const Heading = ({ title, description, breadcrumbs, tabs }: HeadingProps) => {
  return (
    <>
      {breadcrumbs && <div className="px-8">{breadcrumbs}</div>}
      {tabs}
      <div className="flex justify-between flex-col px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Heading;
