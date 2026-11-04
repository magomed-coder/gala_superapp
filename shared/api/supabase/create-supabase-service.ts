import type { Database } from "@/shared/api/supabase/database.types";
import { supabase } from "@/shared/api/supabase/supabase";

export type TableName = keyof Database["public"]["Tables"];
export type TableRow<T extends TableName> =
  Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends TableName> =
  Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends TableName> =
  Database["public"]["Tables"][T]["Update"];

export interface SupabaseEntityService<T extends TableName> {
  list: () => Promise<TableRow<T>[]>;
  getById: (id: string) => Promise<TableRow<T> | null>;
  create: (payload: TableInsert<T>) => Promise<TableRow<T>>;
  update: (id: string, payload: TableUpdate<T>) => Promise<TableRow<T>>;
  remove: (id: string) => Promise<void>;
}

export function createSupabaseService<T extends TableName>(
  table: T,
  options: { idKey?: string } = {},
): SupabaseEntityService<T> {
  const idKey = options.idKey ?? "id";

  return {
    async list() {
      const { data, error } = await supabase.from(table).select("*");

      if (error) {
        throw error;
      }

      return data ?? [];
    },

    async getById(id) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq(idKey, id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data ?? null;
    },

    async create(payload) {
      const { data, error } = await supabase
        .from(table)
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return data;
    },

    async update(id, payload) {
      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq(idKey, id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return data;
    },

    async remove(id) {
      const { error } = await supabase.from(table).delete().eq(idKey, id);

      if (error) {
        throw error;
      }
    },
  };
}
