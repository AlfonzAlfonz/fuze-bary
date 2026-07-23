import { Button } from "@heroui/react";
import { Martini, NotebookTabs, Settings } from "lucide-react";
import type { ReactNode } from "react";
import type { RouterData } from "../App";
import { Header } from "./Header";
import { config } from "../config";

export const SidebarContent = (props: RouterData & { close?: () => void }) => {
  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <div>
        <Header>{config.branding.name}</Header>
        <NavItem {...props} id="menu">
          <Martini /> Bar
        </NavItem>
        <NavItem {...props} id="tabs">
          <NotebookTabs />
          Účty
        </NavItem>
      </div>
      <NavItem {...props} id="settings">
        <Settings /> Nastavení
      </NavItem>
    </div>
  );
};

const NavItem = ({
  page,
  setPage,
  id,
  children,
}: RouterData & { children: ReactNode; id: RouterData["page"] }) => {
  return (
    <Button
      onPress={() => setPage(id)}
      isDisabled={page === id}
      fullWidth
      variant={page === id ? "secondary" : "ghost"}
      className="justify-start py-6"
      size="lg"
      slot={"close"}
    >
      {children}
    </Button>
  );
};
