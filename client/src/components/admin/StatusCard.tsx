import { formatAmount } from "@/lib/helpers";
import { Card, CardHeader } from "../ui/card";

interface Props {
  label: string;
  value: number;
  isNumber?: boolean;
}

function StatusCard({ label, value, isNumber = true }: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-medium">{label}</h2>
        <p className="text-lg text-gray-500">
          {isNumber && "$ "}
          {formatAmount(value)}
          {isNumber && ".00"}
        </p>
      </CardHeader>
    </Card>
  );
}

export default StatusCard;
