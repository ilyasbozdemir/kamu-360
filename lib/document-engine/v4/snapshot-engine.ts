import { getAt, hasOwnPath, setAt } from './path';
import type { DataSource, FieldDefinition, ResolveContext, SnapshotEnvelope, TemplateDefinition } from './types';

export class SnapshotEngine {
  constructor(private readonly source: DataSource) {}

  build<T extends Record<string, unknown>>(
    definition: TemplateDefinition,
    context: ResolveContext,
    previous?: SnapshotEnvelope<T>,
    overrides: Record<string, unknown> = {},
    clearOverrides: readonly string[] = [],
    operator: string = 'Sistem Yöneticisi'
  ): SnapshotEnvelope<T> {
    if (previous) {
      if (previous.documentId !== context.documentId) {
        throw new Error('Önceki snapshot dosya kimliği (documentId) uyuşmuyor.');
      }
      if (previous.templateId !== definition.id) {
        throw new Error('Önceki snapshot şablon kimliği (templateId) uyuşmuyor.');
      }
    }

    const data: Record<string, unknown> = {};
    const effectiveOverrides = { ...(previous?.overrides ?? {}), ...overrides };

    for (const path of clearOverrides) {
      delete effectiveOverrides[path];
    }

    const byPath = new Map<string, FieldDefinition>();
    for (const field of definition.fields) {
      byPath.set(field.path, field);
    }

    const visiting = new Set<string>();
    const resolved = new Set<string>();

    const resolveField = (field: FieldDefinition): void => {
      if (resolved.has(field.path)) return;
      if (visiting.has(field.path)) {
        throw new Error(`Döngüsel hesaplama bağımlılığı tespit edildi: ${field.path}`);
      }
      visiting.add(field.path);

      const mapping = field.mapping;
      if (mapping.kind === 'computed') {
        const dependency = byPath.get(mapping.sourcePath);
        if (dependency) {
          resolveField(dependency);
        }
      }

      const oldExists = !!previous && hasOwnPath(previous.data, field.path);
      const hasOverride = Object.prototype.hasOwnProperty.call(effectiveOverrides, field.path);

      let value: unknown;

      if (field.refreshPolicy === 'preserve' && oldExists) {
        value = getAt(previous!.data, field.path);
      } else if (field.refreshPolicy === 'manual' && hasOverride) {
        value = effectiveOverrides[field.path];
      } else if (mapping.kind === 'computed') {
        const rows = getAt(data, mapping.sourcePath);
        if (!Array.isArray(rows)) {
          value = mapping.operation === 'count' ? 0 : 0;
        } else if (mapping.operation === 'count') {
          value = rows.length;
        } else {
          // sum
          value = rows.reduce<number>((total, row) => {
            if (!row || typeof row !== 'object') return total;
            const record = row as Record<string, unknown>;
            const val = mapping.valueField ? Number(record[mapping.valueField]) || 0 : 0;
            const mult = mapping.multiplyField ? Number(record[mapping.multiplyField]) || 1 : 1;
            return total + val * mult;
          }, 0);
        }
      } else {
        value = this.source.resolve(mapping, context);
      }

      // If user provided a specific manual override and policy is not manual
      if (field.refreshPolicy !== 'manual' && hasOverride) {
        value = effectiveOverrides[field.path];
      }

      setAt(data, field.path, value ?? null);
      visiting.delete(field.path);
      resolved.add(field.path);
    };

    for (const field of definition.fields) {
      resolveField(field);
    }

    const revision = (previous?.revision ?? 0) + 1;
    const createdAt = new Date().toISOString();
    const id = `SNAP-${definition.id}-${context.documentId}-R${revision}-${Date.now().toString(36).toUpperCase()}`;

    // Simple robust content hash
    const jsonStr = JSON.stringify(data);
    let contentHash = 'SHA256:';
    let h = 0x811c9dc5;
    for (let i = 0; i < jsonStr.length; i++) {
      h ^= jsonStr.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    contentHash += (h >>> 0).toString(16).padStart(8, '0').toUpperCase();

    return {
      id,
      templateId: definition.id,
      templateVersion: definition.version,
      schemaVersion: definition.schemaVersion,
      documentId: context.documentId,
      revision,
      createdAt,
      data: data as T,
      overrides: effectiveOverrides,
      contentHash,
      operator,
    };
  }
}

