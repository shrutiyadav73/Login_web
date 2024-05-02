import { Chip } from "@mui/material";

export default function StatusChip({ status, fontSize }) {
  const STATUS = {
    po_generated: {
      bgColor: "#36B37E",
      txtColor: "#fff",
      txt: "PO Generated",
    },
    send_to_vendor: {
      bgColor: "#36B37E",
      txtColor: "#fff",
      txt: "Send To Vendor",
    },
    order_confirmed: {
      bgColor: "#36B37E",
      txtColor: "#fff",
      txt: "Order Confirmed",
    },
    order_dispatched: {
      bgColor: "#FFAB00",
      txtColor: "#fff",
      txt: "Order Dispatched",
    },
    cancelled: {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Cancelled",
    },
    in_correction: {
      bgColor: "#FFAB00",
      txtColor: "#fff",
      txt: "In Correction",
    },
    correction: {
      bgColor: "#FFAB00",
      txtColor: "#fff",
      txt: "Correction",
    },
    in_verification: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "In Verification",
    },
    generated: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "Generated",
    },
    pending: {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Pending",
    },
    approved: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Approved",
    },

    creator: {
      bgColor: "#FF2D00",
      txtColor: "#fff",
      txt: "Creator",
    },

    active: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Active",
    },

    true: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Active",
    },

    inactive: {
      bgColor: "#FF5630",
      txtColor: "#000",
      txt: "Inactive",
    },

    false: {
      bgColor: "#FF5630",
      txtColor: "#000",
      txt: "Inactive",
    },

    deleted: {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Deleted",
    },

    verifier: {
      bgColor: "#F8C471",
      txtColor: "#000",
      txt: "Verifier",
    },

    approver: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Approver",
    },
    rejected: {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Rejected",
    },
    cancel: {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Cancel",
    },
    withdrawal: {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Cancel",
    },
    withdraw: {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Withdraw",
    },

    inspection_pending: {
      bgColor: "#FFAB00",
      txtColor: "#fff",
      txt: "Inspection Pending",
    },
    inspection_started: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "Inspection Started",
    },
    inspection_failed: {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Inspection Failed",
    },
    inspection_success: {
      bgColor: "#36B37E",
      txtColor: "#fff",
      txt: "Inspection Success",
    },
    paid: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Paid",
    },
    send_to_accounts: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "Send to Accounts",
    },
    reject_by_accounts: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "Reject by Accounts",
    },
    bill_in_accounts: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "Bill in Accounts",
    },
    stock_to_inventory: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "Stock to Inventory",
    },
    done: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Done",
    },
    bill_paid: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Bill Paid",
    },
    purchase_received: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Purchase Receive",
    },
    order_received: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Order Received",
    },
    order_in_transit: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "Order in Transit",
    },
    order_cancel: {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Order Cancel",
    },
    "not-generated": {
      bgColor: "#FF5630",
      txtColor: "#fff",
      txt: "Order Cancel",
    },
    quote_received: {
      bgColor: "#36B37E",
      txtColor: "#fff",
      txt: "Quote Receive",
    },
    in_approval: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "In Approval",
    },
    quote_receive: {
      bgColor: "#36B37E",
      txtColor: "#fff",
      txt: "Quote Receive",
    },
    po_received: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Material Received",
    },
    purchase_initiated: {
      bgColor: "#F5B041",
      txtColor: "#000",
      txt: "Purchase Initiated",
    },
    purchase_completed: {
      bgColor: "#229954",
      txtColor: "#000",
      txt: "Purchase Completed",
    },
    send_to_igi: {
      bgColor: "#F3E87C",
      txtColor: "#000",
      txt: "Send To IGI",
    },

    in_progress: {
      bgColor: "#F8C471",
      txtColor: "#000",
      txt: "In Progress",
    },

    inspection_completed: {
      bgColor: "#36B37E",
      txtColor: "#fff",
      txt: "Inspection Completed",
    },

    completed: {
      bgColor: "#36B37E",
      txtColor: "#fff",
      txt: "Completed",
    },
    inverted_into_inventory: {
      bgColor: "#36B37E",
      txtColor: "#000",
      txt: "Inverted into Inventory",
    },
  };

  status = status ? status.toLowerCase() : "";

  return (
    <Chip
      size="small"
      sx={{
        color: STATUS[status]?.txtColor ?? "black",
        backgroundColor: STATUS[status]?.bgColor ?? "gray",
        fontSize: fontSize ?? "13px",
        lineHeight: "auto",
        height: "auto",
      }}
      label={STATUS[status]?.txt ?? "Unknown"}
    />
  );
}
