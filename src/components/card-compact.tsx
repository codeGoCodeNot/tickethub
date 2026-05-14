import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type CardCompactProps = {
  title: string;
  description: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
};

const CardCompact = ({
  title,
  description,
  content,
  footer,
}: CardCompactProps) => {
  return (
    <Card className="w-full max-w-[500px] self-center">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default CardCompact;
