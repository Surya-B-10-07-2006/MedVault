const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['patient', 'doctor']).default('patient'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

const profileUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    // Add other profile fields as needed
});

module.exports = {
    registerSchema,
    loginSchema,
    profileUpdateSchema,
};
