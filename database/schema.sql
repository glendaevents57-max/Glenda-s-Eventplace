-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.blocked_slots;
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.admins;

-- 1. Admins Table
CREATE TABLE public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_name character varying NOT NULL,
  admin_email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);

-- 2. Bookings Table
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid,
  bookers_name character varying NOT NULL,
  bookers_email character varying NOT NULL,
  bookers_phone_number character varying,
  event_type character varying,
  event_date timestamp without time zone NOT NULL, -- Start date & time of the event
  duration_minutes integer DEFAULT 240,            -- Default 4 hours
  visitors_count integer,                          -- Good for 10-20 guests
  status character varying DEFAULT 'pending'::character varying,        -- pending, confirmed, completed, cancelled
  payment_status character varying DEFAULT 'unpaid'::character varying,  -- unpaid, downpayment_paid, fully_paid
  payment_date timestamp without time zone,
  
  -- Custom event & menu options
  theme_name character varying,
  theme_details text,
  custom_menu_selection jsonb,
  is_special_request boolean DEFAULT false,
  special_request_details text,
  total_price numeric(10, 2) NOT NULL,
  downpayment_amount numeric(10, 2) NOT NULL,
  remaining_balance numeric(10, 2) NOT NULL,

  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  expected_expiry_time timestamp with time zone,
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES public.admins(id)
);

-- Index event dates to optimize calendar fetches and booking availability checks
CREATE INDEX idx_bookings_event_date ON public.bookings(event_date);

-- 3. Blocked Slots Table
CREATE TABLE public.blocked_slots (
  id serial PRIMARY KEY,
  blocked_date date NOT NULL,
  time_slot character varying NOT NULL, -- 'morning' (9am-1pm), 'afternoon' (2pm-6pm), 'evening' (7pm-11pm), 'all_day'
  reason character varying,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index blocked dates
CREATE INDEX idx_blocked_slots_date ON public.blocked_slots(blocked_date);
