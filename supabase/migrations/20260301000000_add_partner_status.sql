-- Add partner_status column to profiles table with default 'Awaiting Activation'
ALTER TABLE "public"."profiles" 
ADD COLUMN "partner_status" text DEFAULT 'Awaiting Activation';

-- Update existing profiles that might not have it
UPDATE "public"."profiles" 
SET "partner_status" = 'Awaiting Activation' 
WHERE "partner_status" IS NULL;
