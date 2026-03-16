import { Card } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Card className="w-full lg:w-[500px]">{children}</Card>
    </div>
  );
};

export default layout;
