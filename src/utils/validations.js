import { z } from "zod";

export const professionalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  title: z.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title is too long"),
  location: z.string()
    .min(2, "Location must be at least 2 characters")
    .max(200, "Location is too long"),
  experience: z.number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
  rating: z.number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating cannot exceed 5"),
  jobs: z.number()
    .min(0, "Jobs completed cannot be negative"),
  startingPrice: z.number()
    .min(0, "Starting price cannot be negative"),
  
});

// Optional: Create a partial schema for updates (where password might not be required)
export const professionalUpdateSchema = professionalSchema.partial();

// Optional: Create a login schema
export const professionalLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Optional: Create a schema for adding only services
export const serviceSchema = z.object({
  services: z.array(
    z.object({
      serviceTitle: z.string()
        .min(2, "Service title must be at least 2 characters")
        .max(100, "Service title is too long"),
      description: z.string()
        .min(5, "Description must be at least 5 characters")
        .max(500, "Description cannot exceed 500 characters"),
      price: z.number()
        .min(0, "Price cannot be negative")
        .max(10000, "Price cannot exceed $10,000"),
    })
  ).min(1, "Add at least one service"),
});

// Optional: Create a schema for expertise only
export const expertiseSchema = z.object({
  expertise: z.array(z.string())
    .min(1, "Add at least one area of expertise")
    .max(20, "Maximum 20 expertise areas allowed"),
});