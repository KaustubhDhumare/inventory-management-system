export const PERMISSIONS = Object.freeze({
  CATALOG_MANAGE: "catalog:manage",
  PURCHASE_ORDERS_MANAGE: "purchase-orders:manage",
  TRANSACTIONS_READ: "transactions:read",
  INVENTORY_SALE: "inventory:sale",
  INVENTORY_RETURN: "inventory:return",
  INVENTORY_DAMAGE: "inventory:damage",
  INVENTORY_ADJUST: "inventory:adjust",
});

export const EMPLOYEE_DEFAULT_PERMISSIONS = Object.freeze([
  PERMISSIONS.INVENTORY_SALE,
  PERMISSIONS.INVENTORY_RETURN,
  PERMISSIONS.INVENTORY_DAMAGE,
]);

export const EMPLOYEE_PERMISSION_GROUPS = Object.freeze([
  {
    title: "Catalog management",
    description: "Create and edit products, categories, and suppliers.",
    permissions: [PERMISSIONS.CATALOG_MANAGE],
  },
  {
    title: "Inventory actions",
    description: "Choose which stock operations this employee can record.",
    permissions: [
      PERMISSIONS.INVENTORY_SALE,
      PERMISSIONS.INVENTORY_RETURN,
      PERMISSIONS.INVENTORY_DAMAGE,
      PERMISSIONS.INVENTORY_ADJUST,
    ],
  },
  {
    title: "Purchasing and reports",
    description: "Manage purchase orders or review transaction history.",
    permissions: [
      PERMISSIONS.PURCHASE_ORDERS_MANAGE,
      PERMISSIONS.TRANSACTIONS_READ,
    ],
  },
]);

export const ASSIGNABLE_EMPLOYEE_PERMISSIONS = Object.freeze(
  EMPLOYEE_PERMISSION_GROUPS.flatMap((group) => group.permissions),
);
