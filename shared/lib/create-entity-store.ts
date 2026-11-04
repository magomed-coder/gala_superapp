import { create } from "zustand";

export interface EntityApi<Row, Insert, Update> {
  list: () => Promise<Row[]>;
  getById: (id: string) => Promise<Row | null>;
  create: (payload: Insert) => Promise<Row>;
  update: (id: string, payload: Update) => Promise<Row>;
  remove: (id: string) => Promise<void>;
}

export interface EntityStoreState<Row, Insert, Update> {
  items: Row[];
  selectedItem: Row | null;
  loading: boolean;
  error: string | null;
  setItems: (items: Row[]) => void;
  setSelectedItem: (item: Row | null) => void;
  clearError: () => void;
  fetchItems: () => Promise<Row[]>;
  fetchItemById: (id: string) => Promise<Row | null>;
  createItem: (payload: Insert) => Promise<Row | null>;
  updateItem: (id: string, payload: Update) => Promise<Row | null>;
  deleteItem: (id: string) => Promise<boolean>;
}

export function createEntityStore<Row, Insert, Update>(
  api: EntityApi<Row, Insert, Update>,
  entityName: string,
) {
  return create<EntityStoreState<Row, Insert, Update>>((set) => ({
    items: [],
    selectedItem: null,
    loading: false,
    error: null,

    setItems: (items) => set({ items }),
    setSelectedItem: (selectedItem) => set({ selectedItem }),
    clearError: () => set({ error: null }),

    fetchItems: async () => {
      set({ loading: true, error: null });

      try {
        const items = await api.list();
        set({ items, loading: false });
        return items;
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : `Failed to load ${entityName}`,
          loading: false,
        });
        return [];
      }
    },

    fetchItemById: async (id) => {
      set({ loading: true, error: null });

      try {
        const item = await api.getById(id);
        set({ selectedItem: item, loading: false });
        return item;
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : `Failed to load ${entityName}`,
          loading: false,
        });
        return null;
      }
    },

    createItem: async (payload) => {
      set({ loading: true, error: null });

      try {
        const item = await api.create(payload);
        const items = await api.list();
        set({ items, selectedItem: item, loading: false });
        return item;
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : `Failed to create ${entityName}`,
          loading: false,
        });
        return null;
      }
    },

    updateItem: async (id, payload) => {
      set({ loading: true, error: null });

      try {
        const item = await api.update(id, payload);
        const items = await api.list();
        set({ items, selectedItem: item, loading: false });
        return item;
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : `Failed to update ${entityName}`,
          loading: false,
        });
        return null;
      }
    },

    deleteItem: async (id) => {
      set({ loading: true, error: null });

      try {
        await api.remove(id);
        const items = await api.list();
        set({ items, selectedItem: null, loading: false });
        return true;
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : `Failed to delete ${entityName}`,
          loading: false,
        });
        return false;
      }
    },
  }));
}
