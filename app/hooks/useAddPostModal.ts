import { create } from "zustand";

interface AddPostModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const useAddPostModal = create<AddPostModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));


export default useAddPostModal;