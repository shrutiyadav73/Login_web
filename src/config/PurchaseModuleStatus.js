const PurchaseModuleStatus = {
  order: {
    in_verification: 0,
    in_approval: 0,
    in_correction: 0,
    approved: 0,
    cancelled: 0,
    send_to_vendor: 1,
    order_confirmed: 2,
    order_dispatched: 2,
    po_received: 3,
    completed: 3,
  },
  igi: {
    pending: 0,
    in_progress: 1,
    inspection_completed: 2,
    inverted_into_inventory: 3,
  },
  receive: {
    po_received: 0,
    send_to_igi: 1,
    inspection_started: 2,
    inspection_completed: 3,
    inverted_into_inventory: 4,
  },
};

export default PurchaseModuleStatus;
