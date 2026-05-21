import { z } from "zod";

// ─── Annexe 01 ────────────────────────────────────────────────────────────────

export const missionSchema = z.object({
  title: z.string().min(3, "Mission title must be at least 3 characters"),
  matricule: z.string().optional(),
  nom: z.string().optional(),
  prenom: z.string().optional(),
  department: z.string().optional(),
  purpose: z.string().optional(),
  departureLocation: z.string().optional(),
  departureDate: z.string().optional(),
  departureTime: z.string().optional(),
  returnLocation: z.string().optional(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  extensions: z.string().optional(),
  transportation: z
    .enum(["public_transport", "personal_vehicle", "service_vehicle"])
    .optional(),
  mealBreakfast: z.boolean().optional(),
  mealLunch: z.boolean().optional(),
  mealDinner: z.boolean().optional(),
  comments: z.string().optional(),
});

export type MissionFormValues = z.infer<typeof missionSchema>;

// ─── Annexe 03 ────────────────────────────────────────────────────────────────

const expenseRowSchema = z.object({
  ref: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  departureTime: z.string().optional(),
  returnTime: z.string().optional(),
  timeRange: z.string().optional(),
  costCenter: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
});

export const expenseReportSchema = z.object({
  missionRef: z.string().optional(),
  nom: z.string().optional(),
  department: z.string().optional(),
  matricule: z.string().optional(),
  periode: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  rows: z.array(expenseRowSchema).default([]),
  hrComments: z.string().optional(),
  totalCost: z.coerce.number().min(0).optional(),
  preparedBy: z.string().optional(),
  initials: z.string().optional(),
  phrManager: z.string().optional(),
  phrInitials: z.string().optional(),
  phrSignature: z
    .enum(["Pending", "Validated", "Returned for update"])
    .optional(),
});

export type ExpenseReportFormValues = z.infer<typeof expenseReportSchema>;
