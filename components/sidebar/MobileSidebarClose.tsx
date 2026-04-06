"use client"

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

const MobileSidebarClose = () => {

    const {setOpenMobile} = useSidebar()

  return (
    <Button type="button" size={"icon-sm"} variant={"ghost"} className="lg:hidden" onClick={() => setOpenMobile(false)}>
      <X />
    </Button>
  );
};

export default MobileSidebarClose;
