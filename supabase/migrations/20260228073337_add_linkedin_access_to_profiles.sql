-- Add linkedin_access boolean to profiles table with default false
ALTER TABLE "public"."profiles" 
ADD COLUMN "linkedin_access" boolean DEFAULT false;

-- Update existing profiles to have no access initially (relies on 14-day rule)
UPDATE "public"."profiles" 
SET "linkedin_access" = false 
WHERE "linkedin_access" IS NULL;
