import { useState, type Dispatch, type SetStateAction } from "react";
import { BarMenu } from "./BarMenu";
import { BarSettings } from "./BarSettings";
import { BarTabs } from "./BarTabs";
import { Layout } from "./Layout";

export interface RouterData {
  page: "menu" | "tabs" | "settings";
  setPage: Dispatch<SetStateAction<"menu" | "tabs" | "settings">>;
}

function App() {
  const [page, setPage] = useState<RouterData["page"]>("menu");

  return (
    <Layout page={page} setPage={setPage}>
      {page === "menu" && <BarMenu />}
      {page === "tabs" && <BarTabs />}
      {page === "settings" && <BarSettings />}
    </Layout>
  );
}

export default App;
