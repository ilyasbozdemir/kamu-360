export type RefreshPolicy = "source" | "preserve" | "manual";
export type Scope = "global" | "document";

export type SqlMapping = {
  kind: "column";
  table: string;
  column: string;
  whereColumn: string;
  scopeId: "globalId" | "documentId";
};

export type StaticMapping = {
  kind: "static";
  value: unknown;
};

export type CollectionMapping = {
  kind: "collection";
  table: string;
  whereColumn: string;
  scopeId: "globalId" | "documentId";
  fields: Record<string, string>;
  orderBy?: string;
};

export type RelationMapping = {
  kind: "relation";
  table: string;
  whereColumn: string;
  scopeId: "globalId" | "documentId";
  localColumn: string;
  relatedTable: string;
  foreignColumn: string;
  selectColumn: string;
};

/** Declarative calculations only: no arbitrary JavaScript or SQL injection */
export type ComputedMapping = {
  kind: "computed";
  operation: "sum" | "count";
  sourcePath: `${Scope}.${string}` | string;
  /** Required for sum: numeric property of each row */
  valueField?: string;
  /** Optional multiplier for sum (e.g. miktar * birimFiyat) */
  multiplyField?: string;
};

export type Mapping = SqlMapping | StaticMapping | CollectionMapping | RelationMapping | ComputedMapping;

export type FieldValueType = "string" | "number" | "boolean" | "object" | "array";

export interface FieldDefinition {
  path: string;
  label?: string;
  placeholder?: string;
  mapping: Mapping;
  refreshPolicy: RefreshPolicy;
  valueType?: FieldValueType;
  collectionFieldTypes?: Record<string, FieldValueType>;
  editable?: boolean;
  required?: boolean;
}

export type FormField = {
  path: string;
  label: string;
  kind: "text" | "date" | "number" | "table" | "select";
  editable?: boolean;
};

export interface TemplateDefinition {
  id: string;
  title: string;
  docNo: string;
  version: number;
  schemaVersion: number;
  fields: readonly FieldDefinition[];
  form: readonly FormField[];
}

export type SnapshotEnvelope<T = Record<string, unknown>> = {
  id: string;
  templateId: string;
  templateVersion: number;
  schemaVersion: number;
  documentId: string;
  revision: number;
  createdAt: string;
  data: T;
  overrides: Record<string, unknown>;
  contentHash?: string;
  operator?: string;
};

export type ResolveContext = {
  globalId: string;
  documentId: string;
};

export interface DataSource {
  resolve(mapping: Mapping, context: ResolveContext): unknown;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  documentId: string;
  templateId: string;
  revision: number;
  details: string;
  createdAt: string;
  operator?: string;
}

