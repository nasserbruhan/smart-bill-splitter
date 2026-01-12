
export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // Array of member IDs
}

export interface Member {
  id: string;
  name: string;
}

export interface ReceiptData {
  items: Omit<ReceiptItem, 'assignedTo' | 'id'>[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface BillSummary {
  memberId: string;
  memberName: string;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}
