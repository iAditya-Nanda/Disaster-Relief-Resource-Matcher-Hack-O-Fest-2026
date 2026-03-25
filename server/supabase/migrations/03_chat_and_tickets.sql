-- Update status check constraint for Needs
ALTER TABLE public.needs DROP CONSTRAINT IF EXISTS needs_status_check;
ALTER TABLE public.needs ADD CONSTRAINT needs_status_check CHECK (status IN ('created', 'opened', 'in_progress', 'completed', 'pending', 'matched', 'fulfilled'));

-- Create Chat Messages Table for Needs (Tickets)
CREATE TABLE IF NOT EXISTS public.need_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  need_id UUID REFERENCES public.needs(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  text TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.need_messages ENABLE ROW LEVEL SECURITY;

-- Policies for need_messages
CREATE POLICY "Users can view messages for their own needs." ON public.need_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT requester_id FROM public.needs WHERE id = need_id
    ) OR 
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('NGO', 'Admin')
    )
  );

CREATE POLICY "Users can insert messages for their own needs." ON public.need_messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT requester_id FROM public.needs WHERE id = need_id
    ) OR 
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('NGO', 'Admin')
    )
  );
