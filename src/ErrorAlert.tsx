import { Alert } from "@heroui/react";

export const ErrorAlert = ({ e }: { e: unknown }) => {
  return e ? (
    <Alert status="danger">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Description>
          {e instanceof Error ? e.message : String(e)}
        </Alert.Description>
      </Alert.Content>
    </Alert>
  ) : undefined;
};
