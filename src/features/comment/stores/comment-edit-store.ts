import { create } from "zustand";
import { devtools } from "zustand/middleware";

type CommentEditStore = {
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
};

export const useCommentEditStore = create<CommentEditStore>()(
  devtools((set) => ({
    editingCommentId: null,
    setEditingCommentId: (id) => set({ editingCommentId: id }),
  })),
);
