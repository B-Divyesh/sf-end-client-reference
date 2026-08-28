export interface RelationshipRecord {
  id: string;
  billingClient: string;
  endClient: string;
  reference: string;
  invoiceNumber: string;
  servicePeriod: string;
  sourceFileName: string;
  createdAt: string;
}

export interface PackageDetails {
  billingClient: string;
  endClient: string;
  reference: string;
  invoiceNumber: string;
  servicePeriod: string;
  sourceFileName: string;
}
