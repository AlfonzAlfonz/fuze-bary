import { Button, Card, Drawer } from "@heroui/react";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import type { RouterData } from "../App";
import { SidebarContent } from "./SidebarContent";

export const Layout = ({
  children,
  ...router
}: { children: ReactNode; page: string } & RouterData) => {
  return (
    <div className="flex min-h-screen flex-row">
      <Card className="sticky top-0 h-screen hidden md:block min-w-75 p-0">
        <SidebarContent {...router} />
      </Card>
      <Drawer>
        <Button
          variant="outline"
          isIconOnly
          className={"flex md:hidden fixed top-4 right-4 z-50"}
        >
          <Menu />
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="right">
            <Drawer.Dialog className="py-0 px-0">
              <SidebarContent {...router} />
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
      <div className="flex grow flex-row">{children}</div>
    </div>
  );
};
