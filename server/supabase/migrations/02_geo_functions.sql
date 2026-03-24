-- Find nearby resources with distance
CREATE OR REPLACE FUNCTION get_nearby_resources(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_meters FLOAT DEFAULT 50000
)
RETURNS TABLE (
  id UUID,
  provider_id UUID,
  title TEXT,
  category TEXT,
  quantity NUMERIC,
  unit TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  distance FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id, 
    r.provider_id, 
    r.title, 
    r.category, 
    r.quantity, 
    r.unit, 
    r.status, 
    r.created_at,
    ST_Distance(
      r.location::geography, 
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) AS distance
  FROM public.resources r
  WHERE 
    r.status = 'available' AND
    ST_DWithin(
      r.location::geography, 
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, 
      radius_meters
    )
  ORDER BY distance ASC;
END;
$$;
