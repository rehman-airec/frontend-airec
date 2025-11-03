import { create } from 'zustand';

interface ProfileState {
  isEditing: boolean;
  showResumeModal: boolean;
  resumeUploading: boolean;
  setIsEditing: (editing: boolean) => void;
  setShowResumeModal: (show: boolean) => void;
  setResumeUploading: (uploading: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  isEditing: false,
  showResumeModal: false,
  resumeUploading: false,
  setIsEditing: (editing) => set({ isEditing: editing }),
  setShowResumeModal: (show) => set({ showResumeModal: show }),
  setResumeUploading: (uploading) => set({ resumeUploading: uploading }),
}));

