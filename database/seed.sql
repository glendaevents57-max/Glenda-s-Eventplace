-- Insert default admin account
-- Email: admin@glendas.events
-- Password: GlendaRoyale2026!
INSERT INTO public.admins (admin_name, admin_email, password_hash)
VALUES (
  'Kyle Adrianna Sayas',
  'admin@glendas.events',
  'e9f4c1a400805c2fd59a122cef438b8d:f62e2683002c2f2ca1522877e1434d1dad8c0315598d33291cfd1e17062baa0dda7508c3f95bbc316524c0e33a2dda233f25a3b7f4eca1e7bdbfdf211df8c6cb'
) ON CONFLICT (admin_email) DO NOTHING;
