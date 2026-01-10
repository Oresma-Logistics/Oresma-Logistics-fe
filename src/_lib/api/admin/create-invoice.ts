import { axiosInstance2 } from "@/_lib/axios";

export type InvoiceType = {
  currency: string;
  estimatedFare: string;
  baseFare?: string;
  distanceFare?: string;
  timeFare?: string;
  surgeMultiplier?: string;
  tax?: string;
  serviceFee?: string;
  total?: string;
};

type InvoiceProps = {
  data: InvoiceType;
  id: string;
};

export async function CreateInvoice({ data, id }: InvoiceProps) {
  const response = await axiosInstance2.patch(
    `ride-requests/${id}/invoice`,
    data
  );
  return response.data;
}
