"use client";

import { useState, useCallback } from "react";
import type { Kudos } from "@/types/kudos";

export interface FormErrors {
  recipient?: string;
  title?: string;
  message?: string;
}

export interface RecipientOption {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface KudosFormState {
  recipient: RecipientOption | null;
  searchQuery: string;
  searchResults: RecipientOption[];
  isSearching: boolean;
  searchError: string | null;
  title: string;
  message: string;
  hashtags: string[];
  availableHashtags: string[];
  isLoadingHashtags: boolean;
  hashtagsError: string | null;
  image: File | null;
  imagePreviewUrl: string | null;
  uploadedImageUrl: string | null;
  isUploading: boolean;
  isAnonymous: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  errors: FormErrors;
  idempotencyKey: string;
}

function newIdempotencyKey() {
  return crypto.randomUUID();
}

function buildInitialState(): KudosFormState {
  return {
    recipient: null,
    searchQuery: "",
    searchResults: [],
    isSearching: false,
    searchError: null,
    title: "",
    message: "",
    hashtags: [],
    availableHashtags: [],
    isLoadingHashtags: false,
    hashtagsError: null,
    image: null,
    imagePreviewUrl: null,
    uploadedImageUrl: null,
    isUploading: false,
    isAnonymous: false,
    isSubmitting: false,
    isDirty: false,
    errors: {},
    idempotencyKey: newIdempotencyKey(),
  };
}

export function useKudosForm(
  currentUserId: string | null,
  onSuccess: (kudos: Kudos) => void,
  onClose: () => void
) {
  const [state, setState] = useState<KudosFormState>(buildInitialState);

  const patch = useCallback((updates: Partial<KudosFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setState({ ...buildInitialState(), idempotencyKey: newIdempotencyKey() });
  }, []);

  const setTitle = useCallback((title: string) => {
    patch({ title, isDirty: title.trim().length > 0 || state.message.trim().length > 0 });
  }, [patch, state.message]);

  const setMessage = useCallback((message: string) => {
    patch({ message, isDirty: state.title.trim().length > 0 || message.trim().length > 0 });
  }, [patch, state.title]);

  const handleSubmit = useCallback(async () => {
    patch({ errors: {} });

    const errors: FormErrors = {};
    if (!state.recipient) errors.recipient = "Please select a recipient";
    if (!state.title.trim()) errors.title = "Title is required";
    if (!state.message.trim()) errors.message = "Message is required";

    if (state.recipient?.id === currentUserId) {
      errors.recipient = "You cannot send a Kudos to yourself";
    }
    if (state.title.length > 100) errors.title = "Title is too long (max 100 characters)";
    if (state.message.length > 1000) errors.message = "Message is too long (max 1000 characters)";

    if (Object.keys(errors).length > 0) {
      patch({ errors });
      return;
    }

    patch({ isSubmitting: true });

    try {
      const res = await fetch("/api/kudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: state.recipient!.id,
          title: state.title,
          message: state.message,
          hashtags: state.hashtags,
          imageUrl: state.uploadedImageUrl ?? null,
          isAnonymous: state.isAnonymous,
          idempotencyKey: state.idempotencyKey,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        patch({ isSubmitting: false });
        return;
      }

      const newKudos: Kudos = json.data;
      resetForm();
      onClose();
      onSuccess(newKudos);
    } catch {
      patch({ isSubmitting: false });
    }
  }, [state, currentUserId, patch, resetForm, onClose, onSuccess]);

  return { state, patch, resetForm, setTitle, setMessage, handleSubmit };
}
