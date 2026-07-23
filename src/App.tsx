import { useState, type Dispatch, type SetStateAction } from "react";
import { BarMenu } from "./BarMenu";
import { BarSettings } from "./BarSettings";
import { BarTabs } from "./BarTabs";
import { Layout } from "./Layout";
import { Transactions } from "./Transactions";

export interface RouterData {
  page: "menu" | "tabs" | "transactions" | "settings";
  setPage: Dispatch<
    SetStateAction<"menu" | "tabs" | "transactions" | "settings">
  >;
}

function App() {
  const [page, setPage] = useState<RouterData["page"]>("menu");

  return (
    <Layout page={page} setPage={setPage}>
      {page === "menu" && <BarMenu />}
      {page === "tabs" && <BarTabs />}
      {page === "transactions" && <Transactions />}
      {page === "settings" && <BarSettings />}
    </Layout>
  );
}

export default App;
