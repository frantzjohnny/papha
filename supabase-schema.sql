-- ==============================================================================
-- SUPABASE IDEMPOTENT MIGRATION SCHEMA (PAFHA)
-- ==============================================================================
-- INSTRUCTIONS :
-- Copiez-collez l'intégralité de ce script et exécutez-le dans l'éditeur SQL de
-- votre console Supabase (https://supabase.com).
--
-- Ce script est 100% IDEMPOTENT :
--  - Il NE supprime AUCUNE table existante.
--  - Il NE perd AUCUNE donnée existante.
--  - Il vérifie la structure de chaque table et ajoute uniquement les colonnes manquantes.
--  - Il crée les tables absentes avec les bons types et structures.
--  - Il crée les buckets de stockage requis s'ils sont absents.
--  - Il configure ou met à jour les politiques RLS de façon sécurisée.
-- ==============================================================================

-- 0. EXTENSIONS REQUISES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ==========================================
-- 1. TABLE : actualites
-- ==========================================
DO $$
BEGIN
  -- Si la table n'existe pas, on la crée avec un ID UUID
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'actualites') THEN
    CREATE TABLE public.actualites (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      titre text NOT NULL,
      resume text,
      contenu text,
      image_url text,
      categorie text,
      auteur text,
      date_publication text,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  ELSE
    -- Si elle existe, on ajoute uniquement les colonnes manquantes
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'actualites' AND column_name = 'titre') THEN
      ALTER TABLE public.actualites ADD COLUMN titre text NOT NULL DEFAULT 'Sans titre';
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'actualites' AND column_name = 'resume') THEN
      ALTER TABLE public.actualites ADD COLUMN resume text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'actualites' AND column_name = 'contenu') THEN
      ALTER TABLE public.actualites ADD COLUMN contenu text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'actualites' AND column_name = 'image_url') THEN
      ALTER TABLE public.actualites ADD COLUMN image_url text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'actualites' AND column_name = 'categorie') THEN
      ALTER TABLE public.actualites ADD COLUMN categorie text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'actualites' AND column_name = 'auteur') THEN
      ALTER TABLE public.actualites ADD COLUMN auteur text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'actualites' AND column_name = 'date_publication') THEN
      ALTER TABLE public.actualites ADD COLUMN date_publication text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'actualites' AND column_name = 'created_at') THEN
      ALTER TABLE public.actualites ADD COLUMN created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'actualites' AND column_name = 'updated_at') THEN
      ALTER TABLE public.actualites ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
  END IF;
END $$;


-- ==========================================
-- 2. TABLE : evenements
-- ==========================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'evenements') THEN
    CREATE TABLE public.evenements (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      titre text NOT NULL,
      description text,
      image_url text,
      lieu text,
      date_evenement text,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  ELSE
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'evenements' AND column_name = 'titre') THEN
      ALTER TABLE public.evenements ADD COLUMN titre text NOT NULL DEFAULT 'Événement';
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'evenements' AND column_name = 'description') THEN
      ALTER TABLE public.evenements ADD COLUMN description text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'evenements' AND column_name = 'image_url') THEN
      ALTER TABLE public.evenements ADD COLUMN image_url text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'evenements' AND column_name = 'lieu') THEN
      ALTER TABLE public.evenements ADD COLUMN lieu text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'evenements' AND column_name = 'date_evenement') THEN
      ALTER TABLE public.evenements ADD COLUMN date_evenement text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'evenements' AND column_name = 'created_at') THEN
      ALTER TABLE public.evenements ADD COLUMN created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'evenements' AND column_name = 'updated_at') THEN
      ALTER TABLE public.evenements ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
  END IF;
END $$;


-- ==========================================
-- 3. TABLE : galerie
-- ==========================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'galerie') THEN
    CREATE TABLE public.galerie (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      titre text NOT NULL,
      description text,
      image_url text,
      album text NOT NULL,
      ordre integer DEFAULT 0,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  ELSE
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'galerie' AND column_name = 'titre') THEN
      ALTER TABLE public.galerie ADD COLUMN titre text NOT NULL DEFAULT 'Photo';
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'galerie' AND column_name = 'description') THEN
      ALTER TABLE public.galerie ADD COLUMN description text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'galerie' AND column_name = 'image_url') THEN
      ALTER TABLE public.galerie ADD COLUMN image_url text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'galerie' AND column_name = 'album') THEN
      ALTER TABLE public.galerie ADD COLUMN album text NOT NULL DEFAULT 'autres';
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'galerie' AND column_name = 'ordre') THEN
      ALTER TABLE public.galerie ADD COLUMN ordre integer DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'galerie' AND column_name = 'created_at') THEN
      ALTER TABLE public.galerie ADD COLUMN created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'galerie' AND column_name = 'updated_at') THEN
      ALTER TABLE public.galerie ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
  END IF;
END $$;


-- ==========================================
-- 4. TABLE : partenaires
-- ==========================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'partenaires') THEN
    CREATE TABLE public.partenaires (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      nom text NOT NULL,
      logo_url text,
      site_web text,
      description text,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  ELSE
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partenaires' AND column_name = 'nom') THEN
      ALTER TABLE public.partenaires ADD COLUMN nom text NOT NULL DEFAULT 'Partenaire';
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partenaires' AND column_name = 'logo_url') THEN
      ALTER TABLE public.partenaires ADD COLUMN logo_url text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partenaires' AND column_name = 'site_web') THEN
      ALTER TABLE public.partenaires ADD COLUMN site_web text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partenaires' AND column_name = 'description') THEN
      ALTER TABLE public.partenaires ADD COLUMN description text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partenaires' AND column_name = 'created_at') THEN
      ALTER TABLE public.partenaires ADD COLUMN created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
  END IF;
END $$;


-- ==========================================
-- 5. TABLE : equipe
-- ==========================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'equipe') THEN
    CREATE TABLE public.equipe (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      nom text NOT NULL,
      fonction text,
      photo_url text,
      bio text,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  ELSE
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'equipe' AND column_name = 'nom') THEN
      ALTER TABLE public.equipe ADD COLUMN nom text NOT NULL DEFAULT 'Membre';
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'equipe' AND column_name = 'fonction') THEN
      ALTER TABLE public.equipe ADD COLUMN fonction text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'equipe' AND column_name = 'photo_url') THEN
      ALTER TABLE public.equipe ADD COLUMN photo_url text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'equipe' AND column_name = 'bio') THEN
      ALTER TABLE public.equipe ADD COLUMN bio text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'equipe' AND column_name = 'created_at') THEN
      ALTER TABLE public.equipe ADD COLUMN created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
  END IF;
END $$;


-- ==========================================
-- 6. TABLE : documents
-- ==========================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documents') THEN
    CREATE TABLE public.documents (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      titre text NOT NULL,
      categorie text,
      fichier_url text,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  ELSE
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'titre') THEN
      ALTER TABLE public.documents ADD COLUMN titre text NOT NULL DEFAULT 'Document';
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'categorie') THEN
      ALTER TABLE public.documents ADD COLUMN categorie text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'fichier_url') THEN
      ALTER TABLE public.documents ADD COLUMN fichier_url text;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'created_at') THEN
      ALTER TABLE public.documents ADD COLUMN created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
  END IF;
END $$;


-- ==========================================
-- 7. ACTIVATION DE LA SÉCURITÉ RLS
-- ==========================================
ALTER TABLE public.actualites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galerie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partenaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 8. POLITIQUES DE LECTURE (PUBLIC)
-- ==========================================
DROP POLICY IF EXISTS "Allow public read actualites" ON public.actualites;
CREATE POLICY "Allow public read actualites" ON public.actualites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read evenements" ON public.evenements;
CREATE POLICY "Allow public read evenements" ON public.evenements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read galerie" ON public.galerie;
CREATE POLICY "Allow public read galerie" ON public.galerie FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read partenaires" ON public.partenaires;
CREATE POLICY "Allow public read partenaires" ON public.partenaires FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read equipe" ON public.equipe;
CREATE POLICY "Allow public read equipe" ON public.equipe FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read documents" ON public.documents;
CREATE POLICY "Allow public read documents" ON public.documents FOR SELECT USING (true);


-- ==========================================
-- 9. POLITIQUES D'ÉCRITURE / MODIFICATION (ADMINS AUTHENTIFIÉS)
-- ==========================================
DROP POLICY IF EXISTS "Allow admin write actualites" ON public.actualites;
CREATE POLICY "Allow admin write actualites" ON public.actualites FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin write evenements" ON public.evenements;
CREATE POLICY "Allow admin write evenements" ON public.evenements FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin write galerie" ON public.galerie;
CREATE POLICY "Allow admin write galerie" ON public.galerie FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin write partenaires" ON public.partenaires;
CREATE POLICY "Allow admin write partenaires" ON public.partenaires FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin write equipe" ON public.equipe;
CREATE POLICY "Allow admin write equipe" ON public.equipe FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin write documents" ON public.documents;
CREATE POLICY "Allow admin write documents" ON public.documents FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 10. CRÉATION DES STORAGE BUCKETS (SI ABSENTS)
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('hero', 'hero', true),
  ('galerie', 'galerie', true),
  ('actualites', 'actualites', true),
  ('partenaires', 'partenaires', true),
  ('logos', 'logos', true),
  ('documents', 'documents', true),
  ('equipe', 'equipe', true)
ON CONFLICT (id) DO NOTHING;


-- ==========================================
-- 11. POLITIQUES DE SÉCURITÉ SUR LES STORAGE OBJECTS
-- ==========================================
-- Autoriser tout le monde à lire les fichiers dans les buckets configurés
DROP POLICY IF EXISTS "Allow public read on storage objects" ON storage.objects;
CREATE POLICY "Allow public read on storage objects" ON storage.objects FOR SELECT 
  USING (bucket_id IN ('hero', 'galerie', 'actualites', 'partenaires', 'logos', 'documents', 'equipe'));

-- Réserver la création, modification et suppression des fichiers aux admins connectés
DROP POLICY IF EXISTS "Allow admin management on storage objects" ON storage.objects;
CREATE POLICY "Allow admin management on storage objects" ON storage.objects FOR ALL 
  USING (auth.role() = 'authenticated');
