import type { ReactNode } from "react";

export interface ModalAction {
  label: string;
  onPress?: () => void | Promise<void>;
  variant?: "primary" | "secondary" | "danger";
}

export interface ModalPayload {
  title?: string;
  description?: string;
  content?: ReactNode;
  actions?: ModalAction[];
  [key: string]: unknown;
}

export type ModalType = "confirm" | "success" | "error" | null;

export type ModalKind = Exclude<ModalType, null>;
