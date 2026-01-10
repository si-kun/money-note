import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const loading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Button disabled size="sm">
        <Spinner />
        Loading...
      </Button>
    </div>
  );
};

export default loading;
