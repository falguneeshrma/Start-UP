/**
 * @deprecated The custom project modal has been deprecated and replaced with an external Google Form workflow.
 * See `src/utils/customProject.ts` (`useCustomProjectForm` / `openCustomProjectForm`).
 */
import React from 'react';
import { NavTab } from './Header';

export interface ProjectDetailsFormData {
  title?: string;
  domain?: string;
  projectType?: string;
  techStack?: string;
  description?: string;
  deliverables?: string[];
  budgetRange?: string;
  deadline?: string;
  whatsapp?: string;
  college?: string;
}

export interface ProjectDetailsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (tab: NavTab) => void;
}

/**
 * Cleanly deprecated stub: No longer renders the custom in-app modal form.
 */
export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = () => {
  return null;
};
