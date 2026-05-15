import RedirectToast from "@/components/redirect-toast";
import { Suspense } from "react";

type RootTemplateProps = {
  children: React.ReactNode;
};

export default function RootTemplate({ children }: RootTemplateProps) {
  return (
    <>
      <>{children}</>
      <Suspense fallback={null}>
        <RedirectToast />
      </Suspense>
    </>
  );
}
