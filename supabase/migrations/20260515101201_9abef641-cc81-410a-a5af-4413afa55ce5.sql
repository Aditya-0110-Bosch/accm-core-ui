
-- Seed demo users for each role
DO $$
DECLARE
  demo RECORD;
  new_user_id uuid;
BEGIN
  FOR demo IN
    SELECT * FROM (VALUES
      ('admin@accm.demo',     'Admin Demo',           'admin'::public.app_role),
      ('pmo@accm.demo',       'PMO Demo',             'pmo'::public.app_role),
      ('manager@accm.demo',   'Project Manager Demo', 'manager'::public.app_role),
      ('rm@accm.demo',        'Resource Manager Demo','rm'::public.app_role),
      ('associate@accm.demo', 'Associate Demo',       'associate'::public.app_role)
    ) AS t(email, full_name, role)
  LOOP
    -- skip if user already exists
    SELECT id INTO new_user_id FROM auth.users WHERE email = demo.email;
    IF new_user_id IS NULL THEN
      new_user_id := gen_random_uuid();
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, created_at, updated_at,
        raw_app_meta_data, raw_user_meta_data,
        confirmation_token, email_change, email_change_token_new, recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id, 'authenticated', 'authenticated',
        demo.email, crypt('Demo@1234', gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('full_name', demo.full_name),
        '', '', '', ''
      );
      INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id,
        last_sign_in_at, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), new_user_id,
        jsonb_build_object('sub', new_user_id::text, 'email', demo.email),
        'email', new_user_id::text,
        now(), now(), now()
      );
    END IF;

    -- ensure profile exists
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new_user_id, demo.email, demo.full_name)
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, full_name = EXCLUDED.full_name;

    -- ensure role assignment (and remove default associate if a higher role)
    IF demo.role <> 'associate' THEN
      DELETE FROM public.user_roles WHERE user_id = new_user_id AND role = 'associate';
    END IF;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new_user_id, demo.role)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
