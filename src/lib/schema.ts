import { z } from "zod";

export const FormDataSchema = z.object({
    company_name: z.string().min(1).max(50),
    company_domain: z.string().min(1).max(50),
    company_address: z.string().min(1).max(200),
    company_taxcode: z.string().max(50),
    name: z.string().min(1).max(50),
    email: z.string().email(),
    title: z.string().min(1).max(50),
    phone: z.string().min(10).max(13),
    password: z.string().min(8).max(50),
    password_confirmation: z.string().min(8).max(50),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});