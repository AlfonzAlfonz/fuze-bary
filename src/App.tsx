import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { BarMenu } from "./BarMenu";
import { BarTabs } from "./BarTabs";
import { BarSettings } from "./BarSettings";

function App() {
  const [page, setPage] = useState<"menu" | "tabs" | "settings">("menu");

  return (
    <Stack sx={{ minHeight: "100vh" }} direction="row" gap={2}>
      <Card
        sx={{
          width: "172px",
          height: "100vh",
          position: "sticky",
          top: 0,
          pb: 2,
        }}
      >
        <Stack gap={1} pt={2.5} justifyContent="space-between" height="100%">
          <Stack gap={2}>
            <Typography variant="h5" textAlign="center" mb={0.5}>
              Fůůůze bary
            </Typography>
            <Button onClick={() => setPage("menu")} disabled={page === "menu"}>
              Bar
            </Button>
            <Button onClick={() => setPage("tabs")} disabled={page === "tabs"}>
              Ůčty
            </Button>
          </Stack>
          <Button
            onClick={() => setPage("settings")}
            disabled={page === "settings"}
          >
            Nastavení
          </Button>
        </Stack>
      </Card>
      <Stack py={2} direction="row" gap={2} flexGrow={1}>
        {page === "menu" && <BarMenu />}
        {page === "tabs" && <BarTabs />}
        {page === "settings" && <BarSettings />}
      </Stack>
    </Stack>
  );
}

export default App;
