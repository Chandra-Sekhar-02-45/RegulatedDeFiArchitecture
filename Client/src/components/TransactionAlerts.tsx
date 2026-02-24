type Status = "idle" | "pending" | "success" | "error";

type Props = {
  status: Status;
  message?: string;
};

export function TransactionAlerts({ status, message }: Props) {
  if (status === "idle") return null;
  if (status === "pending") return <div className="alert info">{message ?? "Transaction pending..."}</div>;
  if (status === "success") return <div className="alert success">{message ?? "Transaction confirmed."}</div>;
  return <div className="alert error">{message ?? "Transaction failed."}</div>;
}
