-- Clear all dynamic data for a fresh start
-- This helps avoid confusion with old test data
TRUNCATE TABLE public.need_messages CASCADE;
TRUNCATE TABLE public.matches CASCADE;
TRUNCATE TABLE public.needs CASCADE;

-- Optional: If you want to clear NGO inventory as well, uncomment the line below
-- TRUNCATE TABLE public.resources CASCADE;

-- Insert some fresh sample data for the NGO to work with if resources was not cleared
-- Or just leave it for the user to add via their dashboard
