import { z } from 'zod';
import { UserRoleSchema } from '../auth';
import { UuidSchema, createPaginatedResponseSchema } from '../../core';

export const UserProfileResponseSchema = z.object({
  id: UuidSchema,
  name: z.string().nullable(),
  email: z.string().email(),
  role: UserRoleSchema,
  createdAt: z.string().datetime(),
});

export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;

export const UpdateProfileRequestSchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const AdminUserUpdateSchema = z.object({
  role: UserRoleSchema.optional(),
});

export type AdminUserUpdate = z.infer<typeof AdminUserUpdateSchema>;

export const UserListResponseSchema = createPaginatedResponseSchema(UserProfileResponseSchema);

export type UserListResponse = z.infer<typeof UserListResponseSchema>;
