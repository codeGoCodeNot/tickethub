import { create } from "zustand";

type CommentEditStore = {
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
};

export const useCommentEditStore = create<CommentEditStore>((set) => ({
  editingCommentId: null,
  setEditingCommentId: (id) => set({ editingCommentId: id }),
}));
