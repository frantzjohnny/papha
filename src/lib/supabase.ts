import { createClient } from '@supabase/supabase-js';

// Define TS Interfaces for Supabase Tables
export interface SupabaseActualite {
  id: string;
  titre: string;
  resume: string;
  contenu: string;
  image_url: string;
  categorie: string;
  auteur: string;
  date_publication: string;
  created_at?: string;
}

export interface SupabaseEvenement {
  id: string;
  titre: string;
  description: string;
  image_url: string;
  lieu: string;
  date_evenement: string;
  created_at?: string;
}

export interface SupabaseGalerie {
  id: string;
  titre: string;
  description: string;
  image_url: string;
  album: string; // ID of the album, e.g., '17-jpo-2026'
  created_at?: string;
}

export interface SupabasePartenaire {
  id: string;
  nom: string;
  logo_url: string;
  site_web: string;
  description: string;
}

export interface SupabaseEquipe {
  id: string;
  nom: string;
  fonction: string;
  photo_url: string;
  bio: string;
}

export interface SupabaseDocument {
  id: string;
  titre: string;
  fichier_url: string;
  categorie: string;
  created_at?: string;
}

// Read env variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create real client only if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Deterministically maps any string ID (like static keys or slug-like values) 
 * into a valid, standard RFC4122 UUID v4 format.
 */
export function toValidUUID(str: string): string {
  if (!str) return '00000000-0000-4000-8000-000000000000';
  
  // Standard UUID v4/v5 regex check
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str;
  }
  
  // Calculate simple non-cryptographic hash for input string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Create deterministic hex sequence based on the hash
  const hex = Math.abs(hash).toString(16).padStart(8, '0') + 
              Math.abs(hash * 31).toString(16).padStart(8, '0') + 
              Math.abs(hash * 17).toString(16).padStart(8, '0') + 
              Math.abs(hash * 13).toString(16).padStart(8, '0');
  
  const cleanHex = hex.substring(0, 32).padEnd(32, '0');
  
  // Format as 8-4-4-4-12 with standard v4 version/variant bits
  return [
    cleanHex.substring(0, 8),
    cleanHex.substring(8, 12),
    '4' + cleanHex.substring(13, 16), // version 4
    '8' + cleanHex.substring(17, 20), // variant 8
    cleanHex.substring(20, 32)
  ].join('-');
}

// Initial Datasets for seamless mock fallbacks
const DEFAULT_ACTUALITES: SupabaseActualite[] = [
  {
    id: 'journee-portes-ouvertes-2026',
    titre: '17ᵉ Journée Portes Ouvertes des Associations Franco-Haïtiennes',
    resume: 'La PAFHA a le plaisir de vous inviter à la 17ᵉ Journée Portes Ouvertes, un événement majeur de rencontre, de partage et d’échanges.',
    contenu: `
      <div class="space-y-8">
        <div class="p-6 bg-surface-2 rounded-2xl border border-border">
          <h3 class="text-xl font-display font-bold text-primary mb-2">Diaspora Haïtienne : Investir pour Transformer Haïti</h3>
          <p class="text-text/70">La PAFHA a le plaisir de vous inviter à la 17ᵉ Journée Portes Ouvertes des Associations Franco-Haïtiennes, un événement majeur de rencontre, de partage et d’échanges autour du rôle de la diaspora dans le développement d’Haïti.</p>
        </div>
        <p class="text-base leading-relaxed">Organisée par la PAFHA et son réseau associatif, cette 17ᵉ édition de la Journée Portes Ouvertes se déroulera :</p>
        <div class="grid md:grid-cols-2 gap-8 py-8 border-y border-border">
          <div class="space-y-4">
            <h3 class="text-lg font-bold uppercase tracking-widest text-secondary flex items-center gap-2">Informations pratiques</h3>
            <ul class="space-y-3 text-text/80 text-sm">
              <li><strong>📅 Date :</strong> Samedi 6 juin 2026</li>
              <li><strong>🕚 Horaires :</strong> de 11h00 à 20h00</li>
              <li><strong>📍 Lieu :</strong> Bourse du Travail de Saint-Denis</li>
              <li><strong>🏠 Adresse :</strong> 9-11 rue de Génin, 93200 Saint-Denis</li>
              <li><strong>🚇 Accès :</strong> Métro Ligne 13, Tram Porte de Paris et RER Saint-Denis</li>
            </ul>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-bold uppercase tracking-widest text-secondary flex items-center gap-2">Informations importantes</h3>
            <ul class="space-y-3 text-text/80 text-sm">
              <li><strong>✅ Entrée :</strong> Libre et gratuite</li>
              <li><strong>👥 Public :</strong> Ouverte à toutes et à tous</li>
              <li><strong>👪 Ambiance :</strong> Familiale et conviviale</li>
              <li><strong>🍽️ Restauration :</strong> Disponible sur place</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    image_url: '/images/actualites/regenerated_image_1783892647759.png',
    categorie: 'Événement',
    auteur: 'PAFHA',
    date_publication: '2026-06-06'
  },
  {
    id: 'leadership-feminin-diaspora-2026',
    titre: 'Leadership Féminin & Projets Durables – Entrepreneuriat au féminin',
    resume: 'Une journée stratégique dédiée aux femmes de la diaspora pour structurer un projet, clarifier un modèle et bâtir un financement.',
    contenu: `
      <div class="space-y-8">
        <p class="text-xl font-medium text-primary">Ensemble pour Haïti depuis la France, la PAFHA organise une journée de formation et de réflexion autour du leadership féminin et des projets durables.</p>
        <div class="grid md:grid-cols-2 gap-8 py-8 border-y border-border">
          <div class="space-y-4">
            <h3 class="text-lg font-bold uppercase tracking-widest text-secondary">Informations clés</h3>
            <ul class="space-y-3 text-text/80 text-sm">
              <li><strong>Date :</strong> 25 avril 2026</li>
              <li><strong>Horaires :</strong> 10h00 – 17h00</li>
              <li><strong>Lieu :</strong> La Salle de Pantin, 14 rue Victor Hugo, 93500 Pantin</li>
              <li><strong>Places disponibles :</strong> 30 participantes</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    image_url: '/images/actualites/regenerated_image_1784216879674.png',
    categorie: 'Formation',
    auteur: 'PAFHA',
    date_publication: '2026-04-25'
  },
  {
    id: 'leadership-feminin-2026',
    titre: 'Leadership Féminin & Projets Durables — 2026',
    resume: 'Une journée de formation intensive pour les femmes de la diaspora.',
    contenu: '<h2>Leadership Féminin</h2><p>Le 25 avril 2026 s’est déroulée l’édition...</p>',
    image_url: '/images/actualites/regenerated_image_1784216881162.png',
    categorie: 'Événement',
    auteur: 'Esther Saint-Ville',
    date_publication: '2026-04-25'
  }
];

const DEFAULT_EVENEMENTS: SupabaseEvenement[] = [
  {
    id: 'evt-1',
    titre: '17ᵉ Journée Portes Ouvertes',
    description: 'Diaspora Haïtienne : Investir pour Transformer Haïti.',
    image_url: '/images/hero/regenerated_image_1783892647759.png',
    lieu: 'Saint-Denis',
    date_evenement: '6 Juin 2026'
  },
  {
    id: 'evt-2',
    titre: 'Leadership Féminin & Projets Durables',
    description: "Entrepreneuriat diasporique au féminin : de l'idée à l'impact.",
    image_url: '/images/hero/regenerated_image_1784216879674.png',
    lieu: 'Pantin',
    date_evenement: '25 Avril 2026'
  }
];

const DEFAULT_GALERIE: SupabaseGalerie[] = [
  {
    id: 'g-jpo-1',
    titre: '17ème JPO - Salle Conférence',
    description: 'Grande salle de conférence de la 17ème JPO à Saint-Denis',
    image_url: '/images/galerie/regenerated_image_1783892647759.png',
    album: '17-jpo-2026'
  },
  {
    id: 'g-jpo-2',
    titre: 'Stands JPO',
    description: 'Stands et animations des associations membres',
    image_url: '/images/galerie/regenerated_image_1783892644016.png',
    album: '17-jpo-2026'
  },
  {
    id: 'g-lf-1',
    titre: 'Atelier leadership',
    description: "Atelier de formation sur l'impact féminin",
    image_url: '/images/galerie/regenerated_image_1784216879674.png',
    album: 'leadership-feminin-2026'
  },
  {
    id: 'g-lf-2',
    titre: 'Session interactive',
    description: "Session interactive d'accompagnement de projets",
    image_url: '/images/galerie/regenerated_image_1784216881162.png',
    album: 'leadership-feminin-2026'
  }
];

const DEFAULT_PARTENAIRES: SupabasePartenaire[] = [
  {
    id: 'p-1',
    nom: 'FORIM',
    logo_url: 'https://images.unsplash.com/photo-1599305096909-e8b5bc18962f?auto=format&fit=crop&q=80&w=200',
    site_web: 'https://forim.net',
    description: 'Le FORIM fédère les organisations de solidarité internationale issues de l’immigration.'
  },
  {
    id: 'p-2',
    nom: 'Coordination SUD',
    logo_url: 'https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80&w=200',
    site_web: 'https://coordinationsud.org',
    description: 'Coordination nationale des ONG françaises de solidarité internationale.'
  },
  {
    id: 'p-3',
    nom: 'Maison Kisqueya',
    logo_url: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=200',
    site_web: '#',
    description: "Espace d'innovation sociale et de culture franco-haïtienne."
  }
];

const DEFAULT_EQUIPE: SupabaseEquipe[] = [
  {
    id: 'eq-1',
    nom: 'Esther Saint-Ville',
    fonction: 'Présidente',
    photo_url: '/images/galerie/regenerated_image_1784216878760.jpg',
    bio: 'Présidente passionnée et engagée de la PAFHA depuis sa structuration, Esther coordonne l’ensemble des actions du réseau et d’appui projets.'
  },
  {
    id: 'eq-2',
    nom: 'Jean-Baptiste Michel',
    fonction: 'Secrétaire Général',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    bio: 'Coordonne l’administration, les relations avec les associations membres et le secrétariat opérationnel.'
  }
];

const DEFAULT_DOCUMENTS: SupabaseDocument[] = [
  {
    id: 'doc-1',
    titre: 'Bilan d’activités PAFHA - Mars 2026',
    fichier_url: '/images/galerie/regenerated_image_1783892647759.png', // Fallback display image/file
    categorie: 'Newsletter'
  },
  {
    id: 'doc-2',
    titre: 'Gala de Solidarité Kisqueya - Décembre 2025',
    fichier_url: '/images/galerie/regenerated_image_1783892644016.png',
    categorie: 'Rapport'
  }
];

// LocalStorage Helper for seamless CRUD operations when Supabase is not fully configured yet
function getLocal<T>(key: string, defaults: T[]): T[] {
  const data = localStorage.getItem(`pafha_db_${key}`);
  if (!data) {
    localStorage.setItem(`pafha_db_${key}`, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaults;
  }
}

function setLocal<T>(key: string, value: T[]) {
  localStorage.setItem(`pafha_db_${key}`, JSON.stringify(value));
}

// Global caching for fast retrieval
const localDB = {
  actualites: () => getLocal('actualites', DEFAULT_ACTUALITES),
  evenements: () => getLocal('evenements', DEFAULT_EVENEMENTS),
  galerie: () => getLocal('galerie', DEFAULT_GALERIE),
  partenaires: () => getLocal('partenaires', DEFAULT_PARTENAIRES),
  equipe: () => getLocal('equipe', DEFAULT_EQUIPE),
  documents: () => getLocal('documents', DEFAULT_DOCUMENTS),
};

// 1. ACTUALITES API
export async function getActualites(): Promise<SupabaseActualite[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('actualites')
        .select('*')
        .order('date_publication', { ascending: false });
      if (!error && data) return data as SupabaseActualite[];
      console.warn('Real Supabase fetch actualites failed, using fallback:', error);
    } catch (err) {
      console.warn('Real Supabase query threw error:', err);
    }
  }
  return localDB.actualites();
}

export async function saveActualite(item: Omit<SupabaseActualite, 'id'> & { id?: string }): Promise<SupabaseActualite> {
  const originalId = item.id || `act-${Date.now()}`;
  const finalId = toValidUUID(originalId);

  const newItem: SupabaseActualite = {
    ...item,
    id: finalId,
    created_at: item.created_at || new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('actualites')
        .upsert(newItem)
        .select()
        .single();
      if (!error && data) return data as SupabaseActualite;
      console.warn('Real Supabase upsert actualite failed, saving locally:', error);
    } catch (err) {
      console.warn('Real Supabase upsert actualite threw:', err);
    }
  }

  // Local write
  const list = localDB.actualites();
  const index = list.findIndex(i => i.id === newItem.id);
  if (index >= 0) {
    list[index] = newItem;
  } else {
    list.unshift(newItem);
  }
  setLocal('actualites', list);
  return newItem;
}

export async function deleteActualite(id: string): Promise<boolean> {
  const finalId = toValidUUID(id);
  if (supabase) {
    try {
      const { error } = await supabase.from('actualites').delete().eq('id', finalId);
      if (!error) return true;
    } catch (err) {
      console.warn('Real Supabase delete actualite threw:', err);
    }
  }
  const list = localDB.actualites();
  const filtered = list.filter(i => toValidUUID(i.id) !== finalId && i.id !== id);
  setLocal('actualites', filtered);
  return true;
}

// 2. EVENEMENTS API
export async function getEvenements(): Promise<SupabaseEvenement[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('evenements')
        .select('*')
        .order('date_evenement', { ascending: false });
      if (!error && data) return data as SupabaseEvenement[];
    } catch (err) {
      console.warn('Real Supabase query evenements threw:', err);
    }
  }
  return localDB.evenements();
}

export async function saveEvenement(item: Omit<SupabaseEvenement, 'id'> & { id?: string }): Promise<SupabaseEvenement> {
  const newItem: SupabaseEvenement = {
    ...item,
    id: item.id || `evt-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('evenements')
        .upsert(newItem)
        .select()
        .single();
      if (!error && data) return data as SupabaseEvenement;
    } catch (err) {
      console.warn('Real Supabase upsert evenement threw:', err);
    }
  }

  const list = localDB.evenements();
  const index = list.findIndex(i => i.id === newItem.id);
  if (index >= 0) list[index] = newItem;
  else list.unshift(newItem);
  setLocal('evenements', list);
  return newItem;
}

export async function deleteEvenement(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('evenements').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Real Supabase delete evenement threw:', err);
    }
  }
  const list = localDB.evenements();
  setLocal('evenements', list.filter(i => i.id !== id));
  return true;
}

// 3. GALERIE API
export async function getGalerie(): Promise<SupabaseGalerie[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('galerie')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as SupabaseGalerie[];
    } catch (err) {
      console.warn('Real Supabase query galerie threw:', err);
    }
  }
  return localDB.galerie();
}

export async function saveGalerie(item: Omit<SupabaseGalerie, 'id'> & { id?: string }): Promise<SupabaseGalerie> {
  const newItem: SupabaseGalerie = {
    ...item,
    id: item.id || `g-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('galerie')
        .upsert(newItem)
        .select()
        .single();
      if (!error && data) return data as SupabaseGalerie;
    } catch (err) {
      console.warn('Real Supabase upsert galerie threw:', err);
    }
  }

  const list = localDB.galerie();
  const index = list.findIndex(i => i.id === newItem.id);
  if (index >= 0) list[index] = newItem;
  else list.unshift(newItem);
  setLocal('galerie', list);
  return newItem;
}

export async function deleteGalerie(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('galerie').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Real Supabase delete galerie threw:', err);
    }
  }
  const list = localDB.galerie();
  setLocal('galerie', list.filter(i => i.id !== id));
  return true;
}

// 4. PARTENAIRES API
export async function getPartenaires(): Promise<SupabasePartenaire[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('partenaires')
        .select('*');
      if (!error && data) return data as SupabasePartenaire[];
    } catch (err) {
      console.warn('Real Supabase query partenaires threw:', err);
    }
  }
  return localDB.partenaires();
}

export async function savePartenaire(item: Omit<SupabasePartenaire, 'id'> & { id?: string }): Promise<SupabasePartenaire> {
  const newItem: SupabasePartenaire = {
    ...item,
    id: item.id || `p-${Date.now()}`
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('partenaires')
        .upsert(newItem)
        .select()
        .single();
      if (!error && data) return data as SupabasePartenaire;
    } catch (err) {
      console.warn('Real Supabase upsert partenaire threw:', err);
    }
  }

  const list = localDB.partenaires();
  const index = list.findIndex(i => i.id === newItem.id);
  if (index >= 0) list[index] = newItem;
  else list.push(newItem);
  setLocal('partenaires', list);
  return newItem;
}

export async function deletePartenaire(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('partenaires').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Real Supabase delete partenaire threw:', err);
    }
  }
  const list = localDB.partenaires();
  setLocal('partenaires', list.filter(i => i.id !== id));
  return true;
}

// 5. EQUIPE API
export async function getEquipe(): Promise<SupabaseEquipe[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('equipe')
        .select('*');
      if (!error && data) return data as SupabaseEquipe[];
    } catch (err) {
      console.warn('Real Supabase query equipe threw:', err);
    }
  }
  return localDB.equipe();
}

export async function saveEquipe(item: Omit<SupabaseEquipe, 'id'> & { id?: string }): Promise<SupabaseEquipe> {
  const newItem: SupabaseEquipe = {
    ...item,
    id: item.id || `eq-${Date.now()}`
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('equipe')
        .upsert(newItem)
        .select()
        .single();
      if (!error && data) return data as SupabaseEquipe;
    } catch (err) {
      console.warn('Real Supabase upsert equipe threw:', err);
    }
  }

  const list = localDB.equipe();
  const index = list.findIndex(i => i.id === newItem.id);
  if (index >= 0) list[index] = newItem;
  else list.push(newItem);
  setLocal('equipe', list);
  return newItem;
}

export async function deleteEquipe(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('equipe').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Real Supabase delete equipe threw:', err);
    }
  }
  const list = localDB.equipe();
  setLocal('equipe', list.filter(i => i.id !== id));
  return true;
}

// 6. DOCUMENTS API
export async function getDocuments(): Promise<SupabaseDocument[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as SupabaseDocument[];
    } catch (err) {
      console.warn('Real Supabase query documents threw:', err);
    }
  }
  return localDB.documents();
}

export async function saveDocument(item: Omit<SupabaseDocument, 'id'> & { id?: string }): Promise<SupabaseDocument> {
  const newItem: SupabaseDocument = {
    ...item,
    id: item.id || `doc-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .upsert(newItem)
        .select()
        .single();
      if (!error && data) return data as SupabaseDocument;
    } catch (err) {
      console.warn('Real Supabase upsert document threw:', err);
    }
  }

  const list = localDB.documents();
  const index = list.findIndex(i => i.id === newItem.id);
  if (index >= 0) list[index] = newItem;
  else list.unshift(newItem);
  setLocal('documents', list);
  return newItem;
}

export async function deleteDocument(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Real Supabase delete document threw:', err);
    }
  }
  const list = localDB.documents();
  setLocal('documents', list.filter(i => i.id !== id));
  return true;
}

// 7. FILE STORAGE UPLOAD
export async function uploadFile(
  file: File,
  bucketName: 'hero' | 'galerie' | 'actualites' | 'partenaires' | 'logos' | 'documents' | 'equipe',
  onProgress?: (percent: number) => void
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${fileName}`;

  if (supabase) {
    try {
      // Small progress emulation or real progress if supported
      if (onProgress) onProgress(20);
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      if (onProgress) onProgress(80);

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (onProgress) onProgress(100);
      return data.publicUrl;
    } catch (err) {
      console.warn(`Supabase Storage upload to ${bucketName} failed, falling back to local object URL:`, err);
    }
  }

  // Fallback upload (local object URL or Base64 so it works perfectly in Dev iframe!)
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (onProgress) onProgress(100);
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}
