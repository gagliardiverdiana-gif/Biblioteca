import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Alert, Snackbar } from "@mui/material";

type Severity = "success" | "error" | "info" | "warning";
type NotifyFn = (message: string, severity?: Severity) => void;

const NotifyContext = createContext<NotifyFn | null>(null);

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    open: false,
    message: "",
    severity: "success" as Severity,
  });

  const notify = useCallback<NotifyFn>((message, severity = "success") => {
    setState({ open: true, message, severity });
  }, []);

  const chiudi = () => setState((s) => ({ ...s, open: false }));

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") chiudi();
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={state.severity}
          variant="filled"
          onClose={chiudi}
          sx={{ width: "100%" }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotify() {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify deve essere usato dentro NotifyProvider");
  return ctx;
}