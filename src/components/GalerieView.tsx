import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Upload, 
  X, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Check, 
  Settings, 
  Share2, 
  Grid, 
  Image as ImageIcon, 
  Tag,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGalerie } from '../lib/supabase';


// --- Types ---
export interface Photo {
  id: string;
  url: string;
  alt: string;
}

export const resolveImageUrl = (url: string): string => {
  if (url && url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/images/galerie/');
  }
  if (url && url.startsWith('/assets/images/')) {
    return url.replace('/assets/images/', '/images/galerie/');
  }
  return url;
};

export interface Album {
  id: string;
  titre: string;
  date: string;
  lieu: string;
  description: string;
  type: 'événement' | 'conférence' | 'formation' | 'mission' | 'culture' | 'autre';
  annee: string;
  coverUrl: string;
  seoTitle?: string;
  seoDescription?: string;
  photos: Photo[];
}

// --- Hardcoded Initial Seed Data (matching categories requested by the user) ---
const INITIAL_ALBUMS: Album[] = [
  {
    id: "jpo-2026",
    titre: "17ᵉ Journée Portes Ouvertes",
    date: "2026-06-06",
    lieu: "Saint-Denis, Bourse du Travail",
    description: "Retour en images sur la 17ème édition des Journées Portes Ouvertes des Associations Franco-Haïtiennes, sous le thème « Diaspora Haïtienne : Investir pour Transformer Haïti ».",
    type: "événement",
    annee: "2026",
    coverUrl: "/images/galerie/regenerated_image_1783892647759.png",
    seoTitle: "Galerie - 17ᵉ Journée Portes Ouvertes | PAFHA",
    seoDescription: "Photos de la 17ème Journée Portes Ouvertes de la PAFHA à Saint-Denis.",
    photos: [
      {
        id: "jpo-1",
        url: "/images/galerie/regenerated_image_1783892647759.png",
        alt: "Grande salle de conférence de la 17ème JPO à Saint-Denis"
      },
      {
        id: "jpo-2",
        url: "/images/galerie/regenerated_image_1783892644016.png",
        alt: "Stands et animations des associations membres"
      }
    ]
  },
  {
    id: "leadership-feminin-2026",
    titre: "Leadership Féminin & Projets Durables",
    date: "2026-04-25",
    lieu: "Pantin, La Salle de Pantin",
    description: "Journée stratégique pour structurer les projets et bâtir une trajectoire crédible de financement, dédiée aux femmes entrepreneures de la diaspora.",
    type: "formation",
    annee: "2026",
    coverUrl: "/images/galerie/regenerated_image_1784216879674.png",
    seoTitle: "Galerie - Leadership Féminin & Projets Durables | PAFHA",
    seoDescription: "Images de l'atelier d'accompagnement à l'entrepreneuriat féminin à Pantin.",
    photos: [
      {
        id: "lf-1",
        url: "/images/galerie/regenerated_image_1784216879674.png",
        alt: "Atelier de formation sur l'impact féminin"
      },
      {
        id: "lf-2",
        url: "/images/galerie/regenerated_image_1784216881162.png",
        alt: "Session interactive d'accompagnement de projets"
      }
    ]
  },
  {
    id: "conferences-climat-2025",
    titre: "Conférence d'Appui au Développement Durable",
    date: "2025-11-15",
    lieu: "Paris, Maison de l'Afrique",
    description: "Conférence-débat sur les défis environnementaux, la transition écologique et le rôle des associations membres de la PAFHA.",
    type: "conférence",
    annee: "2025",
    coverUrl: "/images/galerie/regenerated_image_1784123062977.jpg",
    seoTitle: "Galerie - Conférence Transition Ecologique | PAFHA",
    seoDescription: "Conférence climat et transition écologique en Haïti.",
    photos: [
      {
        id: "cc-1",
        url: "/images/galerie/regenerated_image_1784123062977.jpg",
        alt: "Table ronde sur le climat et l'éducation"
      }
    ]
  },
  {
    id: "ag-2025",
    titre: "Assemblée Générale Ordinaire 2025",
    date: "2025-06-21",
    lieu: "Paris, FORIM",
    description: "Rassemblement des associations membres de la PAFHA pour le bilan d'activité, la présentation des rapports financiers et l'élection du conseil.",
    type: "autre",
    annee: "2025",
    coverUrl: "/images/galerie/regenerated_image_1783892647063.png",
    seoTitle: "Galerie - Assemblée Générale 2025 | PAFHA",
    seoDescription: "Bilan d'activité et échanges démocratiques de l'assemblée générale 2025.",
    photos: [
      {
        id: "ag-1",
        url: "/images/galerie/regenerated_image_1783892647063.png",
        alt: "Membres du réseau PAFHA réunis lors de l'AG 2025"
      }
    ]
  },
  {
    id: "reunions-mensuelles-2026",
    titre: "Réunions de Concertation de la PAFHA",
    date: "2026-01-10",
    lieu: "Paris, Siège Social",
    description: "Sessions mensuelles de travail pour coordonner les actions des associations membres et préparer les prochains temps forts.",
    type: "autre",
    annee: "2026",
    coverUrl: "/images/galerie/regenerated_image_1783892647063.png",
    seoTitle: "Galerie - Réunions de Concertation | PAFHA",
    seoDescription: "Moments d'échange et d'organisation interne entre membres du bureau.",
    photos: [
      {
        id: "rm-1",
        url: "/images/galerie/regenerated_image_1783892647063.png",
        alt: "Réunion de coordination des associations de la diaspora"
      }
    ]
  },
  {
    id: "fete-huma-2025",
    titre: "La PAFHA à la Fête de l'Humanité 2025",
    date: "2025-09-12",
    lieu: "Plessis-Pâté, Essonne",
    description: "Célébration de la culture haïtienne, espace de gastronomie, d'artisanat et d'échanges solidaires pendant trois jours d'exposition.",
    type: "culture",
    annee: "2025",
    coverUrl: "/images/galerie/regenerated_image_1783892647759.png",
    seoTitle: "Galerie - PAFHA à la Fête de l'Huma | PAFHA",
    seoDescription: "Découverte de l'artisanat et des projets d'aide au développement d'Haïti.",
    photos: [
      {
        id: "fh-1",
        url: "/images/galerie/regenerated_image_1783892647759.png",
        alt: "Kiosque PAFHA à la Fête de l'Humanité"
      }
    ]
  },
  {
    id: "mission-haiti-nord-2024",
    titre: "Mission de Coopération dans le Nord d'Haïti",
    date: "2024-10-05",
    lieu: "Cap-Haïtien, Haïti",
    description: "Visites de terrain et réunions avec les coopératives de producteurs locaux soutenues par la plateforme.",
    type: "mission",
    annee: "2024",
    coverUrl: "/images/galerie/regenerated_image_1784216878760.jpg",
    seoTitle: "Galerie - Mission d'appui Nord d'Haïti | PAFHA",
    seoDescription: "Suivi et évaluation des projets agricoles de développement local de la PAFHA.",
    photos: [
      {
        id: "mn-1",
        url: "/images/galerie/regenerated_image_1784216878760.jpg",
        alt: "Visite de terrain dans les exploitations agricoles partenaires"
      }
    ]
  }
];

// ACTIVITY TYPES
const ACTIVITY_TYPES = [
  { value: 'all', label: 'Toutes les activités' },
  { value: 'événement', label: 'Événements' },
  { value: 'conférence', label: 'Conférences' },
  { value: 'formation', label: 'Formations' },
  { value: 'mission', label: 'Missions' },
  { value: 'culture', label: 'Culture' },
  { value: 'autre', label: 'Autres' }
];

interface GalerieViewProps {
  onBack: () => void;
  initialSelectedAlbumId?: string | null;
}

export default function GalerieView({ onBack, initialSelectedAlbumId }: GalerieViewProps) {
  // LocalState backed by localStorage
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Navigation states
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  
  // Admin Modals State
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [showConfigExporter, setShowConfigExporter] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  // Photo Bulk Import State
  const [bulkPhotoUrls, setBulkPhotoUrls] = useState('');
  const [bulkPhotoAlt, setBulkPhotoAlt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Initialize Albums from localStorage or seed
  useEffect(() => {
    const saved = localStorage.getItem('pafha_galerie_data');
    let baseAlbums = INITIAL_ALBUMS;
    if (saved) {
      try {
        const parsed: Album[] = JSON.parse(saved);
        baseAlbums = parsed.map(album => {
          const initial = INITIAL_ALBUMS.find(a => a.id === album.id);
          if (initial) {
            return {
              ...album,
              coverUrl: album.coverUrl || initial.coverUrl,
              photos: album.photos && album.photos.length > 0 ? album.photos : initial.photos
            };
          }
          return album;
        });
      } catch (e) {
        baseAlbums = INITIAL_ALBUMS;
      }
    } else {
      baseAlbums = INITIAL_ALBUMS;
    }

    // Now dynamically load from Supabase/Local Database and merge!
    const mergeSupabasePhotos = async () => {
      try {
        const dbPhotos = await getGalerie();
        const updatedAlbums = [...baseAlbums];

        dbPhotos.forEach(dbPhoto => {
          // Find album
          let album = updatedAlbums.find(a => a.id === dbPhoto.album);
          if (!album) {
            // Create dynamic virtual album
            album = {
              id: dbPhoto.album,
              titre: dbPhoto.album.charAt(0).toUpperCase() + dbPhoto.album.slice(1).replace(/-/g, ' '),
              date: new Date().toISOString().split('T')[0],
              lieu: 'PAFHA',
              description: 'Album d’images synchronisé depuis Supabase.',
              type: 'autre',
              annee: new Date().getFullYear().toString(),
              coverUrl: dbPhoto.image_url,
              photos: []
            };
            updatedAlbums.push(album);
          }

          // Check if photo already in album
          const photoExists = album.photos.some(p => p.id === dbPhoto.id || p.url === dbPhoto.image_url);
          if (!photoExists) {
            album.photos.push({
              id: dbPhoto.id,
              url: dbPhoto.image_url,
              alt: dbPhoto.titre || dbPhoto.description || 'Image'
            });
            // Update coverUrl if empty or placeholder
            if (!album.coverUrl) {
              album.coverUrl = dbPhoto.image_url;
            }
          }
        });

        setAlbums(updatedAlbums);
        localStorage.setItem('pafha_galerie_data', JSON.stringify(updatedAlbums));
      } catch (err) {
        console.warn("Could not merge Supabase gallery photos:", err);
        setAlbums(baseAlbums);
      }
    };

    mergeSupabasePhotos();
  }, []);

  // Sync to localStorage on change
  const saveAlbums = (updatedAlbums: Album[]) => {
    setAlbums(updatedAlbums);
    localStorage.setItem('pafha_galerie_data', JSON.stringify(updatedAlbums));
  };

  // Auto-open album if routed via prop
  useEffect(() => {
    if (initialSelectedAlbumId) {
      setSelectedAlbumId(initialSelectedAlbumId);
    }
  }, [initialSelectedAlbumId]);

  // Set selected album ID and sync URL hash
  const handleSelectAlbum = (id: string | null) => {
    setSelectedAlbumId(id);
    if (id) {
      window.location.hash = `galerie/${id}`;
      // Apply SEO Title and Description dynamically
      const album = albums.find(a => a.id === id);
      if (album) {
        document.title = album.seoTitle || `Galerie - ${album.titre} | PAFHA`;
        // Setup meta description dynamically
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', album.seoDescription || album.description);
        }
      }
    } else {
      window.location.hash = `galerie`;
      document.title = "Galerie Photos - Actions, Événements et Rencontres | PAFHA";
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get active selected album object
  const activeAlbum = albums.find(a => a.id === selectedAlbumId) || null;

  // Clean filters when switching albums
  useEffect(() => {
    setLightboxIndex(null);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, [selectedAlbumId]);

  // List of unique years from albums
  const years = ['all', ...Array.from(new Set(albums.map(a => a.annee))).sort((a: string, b: string) => b.localeCompare(a))];

  // Filtered albums
  const filteredAlbums = albums.filter(album => {
    const matchesSearch = 
      album.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.lieu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedType === 'all' || album.type === selectedType;
    const matchesYear = selectedYear === 'all' || album.annee === selectedYear;
    
    return matchesSearch && matchesType && matchesYear;
  });

  // Admin: Create or edit album
  const handleSaveAlbum = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    
    const titre = data.get('titre') as string;
    const lieu = data.get('lieu') as string;
    const description = data.get('description') as string;
    const dateStr = data.get('date') as string;
    const type = data.get('type') as Album['type'];
    const coverUrl = data.get('coverUrl') as string;
    const seoTitle = data.get('seoTitle') as string;
    const seoDescription = data.get('seoDescription') as string;
    
    const annee = dateStr ? dateStr.substring(0, 4) : new Date().getFullYear().toString();

    if (!titre) return;

    if (editingAlbum) {
      // Edit
      const updated = albums.map(a => {
        if (a.id === editingAlbum.id) {
          return {
            ...a,
            titre,
            lieu,
            description,
            date: dateStr,
            type,
            annee,
            coverUrl,
            seoTitle: seoTitle || `Galerie - ${titre} | PAFHA`,
            seoDescription: seoDescription || description,
          };
        }
        return a;
      });
      saveAlbums(updated);
    } else {
      // Create
      const newId = titre.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

      const newAlbum: Album = {
        id: newId,
        titre,
        lieu,
        description,
        date: dateStr,
        type,
        annee,
        coverUrl,
        seoTitle: seoTitle || `Galerie - ${titre} | PAFHA`,
        seoDescription: seoDescription || description,
        photos: []
      };
      saveAlbums([...albums, newAlbum]);
    }

    setIsAlbumModalOpen(false);
    setEditingAlbum(null);
  };

  // Admin: Delete album
  const handleDeleteAlbum = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ainsi que toutes ses photos ?")) {
      const updated = albums.filter(a => a.id !== id);
      saveAlbums(updated);
      if (selectedAlbumId === id) {
        handleSelectAlbum(null);
      }
    }
  };

  // Admin: Delete photo
  const handleDeletePhoto = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeAlbum) return;
    if (window.confirm("Supprimer cette photo de l'album ?")) {
      const updatedPhotos = activeAlbum.photos.filter(p => p.id !== photoId);
      
      // If cover photo was deleted, clear or update coverUrl
      let newCover = activeAlbum.coverUrl;
      if (activeAlbum.coverUrl.includes(photoId) || activeAlbum.photos.find(p => p.id === photoId)?.url === activeAlbum.coverUrl) {
        newCover = updatedPhotos.length > 0 ? updatedPhotos[0].url : '';
      }

      const updated = albums.map(a => {
        if (a.id === activeAlbum.id) {
          return { ...a, coverUrl: newCover, photos: updatedPhotos };
        }
        return a;
      });
      saveAlbums(updated);
    }
  };

  // Admin: Set photo as cover photo
  const handleSetCoverPhoto = (photoUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeAlbum) return;
    const updated = albums.map(a => {
      if (a.id === activeAlbum.id) {
        return { ...a, coverUrl: photoUrl };
      }
      return a;
    });
    saveAlbums(updated);
    alert("Cette photo a été définie comme couverture de l'album.");
  };

  // Admin: Bulk import photos by URLs
  const handleBulkAddPhotos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAlbum || !bulkPhotoUrls.trim()) return;

    // Split URLs by commas or newlines
    const urls = bulkPhotoUrls
      .split(/[\n,]+/)
      .map(u => u.trim())
      .filter(u => u.startsWith('http') || u.startsWith('/src') || u.startsWith('data:'));

    if (urls.length === 0) {
      alert("Aucune URL valide détectée (les liens doivent commencer par http, /src, ou data:)");
      return;
    }

    const newPhotos: Photo[] = urls.map((url, index) => ({
      id: `photo-${Date.now()}-${index}`,
      url,
      alt: bulkPhotoAlt.trim() || `${activeAlbum.titre} - Image ${activeAlbum.photos.length + index + 1}`
    }));

    const updatedPhotos = [...activeAlbum.photos, ...newPhotos];
    
    // Set first photo as cover if none exists
    const hasCover = !!activeAlbum.coverUrl;
    const newCover = hasCover ? activeAlbum.coverUrl : (newPhotos[0]?.url || '');

    const updated = albums.map(a => {
      if (a.id === activeAlbum.id) {
        return { ...a, coverUrl: newCover, photos: updatedPhotos };
      }
      return a;
    });

    saveAlbums(updated);
    setBulkPhotoUrls('');
    setBulkPhotoAlt('');
    alert(`${newPhotos.length} photo(s) ajoutée(s) avec succès !`);
  };

  // Convert File to Base64 (to support real offline uploads)
  const processFiles = (files: FileList) => {
    if (!activeAlbum) return;

    const filePromises = Array.from(files).map(file => {
      return new Promise<Photo>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: reader.result as string, // Base64 representation
            alt: file.name.split('.')[0] || activeAlbum.titre
          });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(newPhotos => {
      const updatedPhotos = [...activeAlbum.photos, ...newPhotos];
      const hasCover = !!activeAlbum.coverUrl;
      const newCover = hasCover ? activeAlbum.coverUrl : (newPhotos[0]?.url || '');

      const updated = albums.map(a => {
        if (a.id === activeAlbum.id) {
          return { ...a, coverUrl: newCover, photos: updatedPhotos };
        }
        return a;
      });

      saveAlbums(updated);
      alert(`${newPhotos.length} photo(s) importée(s) localement !`);
    }).catch(err => {
      console.error(err);
      alert("Erreur lors de la lecture des fichiers.");
    });
  };

  // Drag and Drop files handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  // Lightbox navigation
  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!activeAlbum || lightboxIndex === null) return;
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setLightboxIndex(prev => {
      if (prev === null) return null;
      return prev === 0 ? activeAlbum.photos.length - 1 : prev - 1;
    });
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!activeAlbum || lightboxIndex === null) return;
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setLightboxIndex(prev => {
      if (prev === null) return null;
      return prev === activeAlbum.photos.length - 1 ? 0 : prev + 1;
    });
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  // Zoom handlers
  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  // Lightbox Pan / Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale === 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale === 1) return;
    e.preventDefault();
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Export current config as JSON
  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(albums, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "pafha_galerie_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJSONToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(albums, null, 2));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Gradient Generator for Albums without custom cover photos
  const getGradientForType = (type: Album['type']) => {
    switch (type) {
      case 'événement':
        return 'from-secondary via-secondary-dark to-primary-dark';
      case 'conférence':
        return 'from-primary-light via-primary to-primary-dark';
      case 'formation':
        return 'from-accent via-accent-light to-primary-dark';
      case 'mission':
        return 'from-emerald-600 via-emerald-800 to-primary-dark';
      case 'culture':
        return 'from-purple-700 via-purple-900 to-secondary-dark';
      default:
        return 'from-gray-600 via-gray-700 to-primary-dark';
    }
  };

  const getBadgeColor = (type: Album['type']) => {
    switch (type) {
      case 'événement': return 'bg-secondary text-white';
      case 'conférence': return 'bg-primary text-white';
      case 'formation': return 'bg-accent text-primary-dark font-bold';
      case 'mission': return 'bg-emerald-600 text-white';
      case 'culture': return 'bg-purple-700 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none haitian-pattern scale-110" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        
        {/* Navigation / Header Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <button 
            onClick={() => {
              if (selectedAlbumId) {
                handleSelectAlbum(null);
              } else {
                onBack();
              }
            }} 
            className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:text-secondary transition-colors w-fit group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            {selectedAlbumId ? "Retour à la Galerie" : "Retour à l'accueil"}
          </button>

          {/* Admin Switcher */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button 
                onClick={() => setShowConfigExporter(true)}
                className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Share2 size={14} /> Exporter JSON
              </button>
            )}
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 border shadow-sm transition-all ${
                isAdmin 
                  ? 'bg-secondary border-secondary text-white shadow-red' 
                  : 'bg-white border-border text-text-muted hover:border-secondary hover:text-secondary'
              }`}
            >
              <Settings size={14} className={isAdmin ? 'animate-spin' : ''} />
              {isAdmin ? "Quitter le Mode Admin" : "Mode Administration"}
            </button>
          </div>
        </div>

        {/* --- EXPORT CONFIG MODAL --- */}
        <AnimatePresence>
          {showConfigExporter && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary-dark/80 backdrop-blur-md"
              onClick={() => setShowConfigExporter(false)}
            >
              <motion.div 
                initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden border border-border"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 md:p-8 border-b border-border flex justify-between items-center bg-surface-2">
                  <div>
                    <h3 className="text-xl font-bold font-display text-primary">Exporter la configuration de la Galerie</h3>
                    <p className="text-xs text-text-muted mt-1">Copiez ce code ou téléchargez le fichier JSON pour mettre à jour la galerie définitivement.</p>
                  </div>
                  <button onClick={() => setShowConfigExporter(false)} className="p-2 bg-white rounded-full border border-border hover:bg-surface-2 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div className="relative">
                    <textarea 
                      readOnly 
                      rows={10} 
                      className="w-full bg-surface-dark text-emerald-400 p-4 font-mono text-xs rounded-xl overflow-y-auto border border-border resize-none"
                      value={JSON.stringify(albums, null, 2)}
                    />
                    <button 
                      onClick={handleCopyJSONToClipboard}
                      className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs font-bold font-mono transition-all flex items-center gap-1.5"
                    >
                      {copiedNotification ? <Check size={14} className="text-emerald-400" /> : <Plus size={14} />}
                      {copiedNotification ? "Copié !" : "Copier"}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                    <div className="flex items-start gap-2.5 max-w-sm">
                      <Info size={16} className="text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-text-muted">
                        <strong>Astuce :</strong> Pour sauvegarder définitivement vos modifications sans toucher au code, vous pouvez copier ce JSON et le remplacer dans le fichier <code>src/components/GalerieView.tsx</code> dans la variable <code>INITIAL_ALBUMS</code>.
                      </p>
                    </div>
                    <button 
                      onClick={handleExportJSON}
                      className="btn-primary w-full sm:w-auto py-3 px-6 text-xs"
                    >
                      <Download size={14} /> Télécharger le fichier JSON
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* ========================================================================= */}
        {/* --- ALBUM GRID / MAIN PAGE VIEW --- */}
        {/* ========================================================================= */}
        {!selectedAlbumId ? (
          <>
            {/* Page Header */}
            <div className="max-w-4xl mb-16">
              <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-secondary mb-3 md:mb-4 block">Média & Archives</span>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-primary mb-6">Galerie PAFHA</h1>
              <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-3xl">
                Découvrez en images les actions, les événements, les formations et les rencontres organisés par la Plateforme d'Associations Franco-Haïtiennes depuis sa création.
              </p>
            </div>

            {/* Admin Actions Row */}
            {isAdmin && (
              <div className="mb-10 p-6 bg-secondary/5 border-2 border-dashed border-secondary/25 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                    <Settings className="animate-spin" size={18} /> Mode Administration Actif
                  </h3>
                  <p className="text-xs text-text-muted mt-1">Vous pouvez ajouter, éditer ou supprimer des albums et des photos. Les modifications sont sauvegardées dans votre navigateur.</p>
                </div>
                <button 
                  onClick={() => { setEditingAlbum(null); setIsAlbumModalOpen(true); }}
                  className="btn-primary py-3 px-6 bg-secondary hover:brightness-110 shrink-0 text-xs"
                >
                  <Plus size={16} /> Nouvel Album
                </button>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm mb-12 flex flex-col lg:flex-row gap-6 items-center">
              {/* Search input */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un événement, lieu..."
                  className="w-full bg-bg border border-border pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 ring-primary outline-none text-sm transition-all"
                />
              </div>

              {/* Type Filter */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto lg:ml-auto justify-start">
                {ACTIVITY_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                      selectedType === type.value
                        ? 'bg-primary border-primary text-white shadow-blue'
                        : 'bg-bg border-border text-text-muted hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Year Filter */}
              <div className="w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full lg:w-36 bg-bg border border-border p-3 rounded-xl focus:ring-2 ring-primary outline-none text-xs font-bold uppercase tracking-wider"
                >
                  <option value="all">Toutes les années</option>
                  {years.filter(y => y !== 'all').map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Album Grid */}
            {filteredAlbums.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAlbums.map(album => {
                  const hasCustomCover = !!album.coverUrl;
                  const photosCount = album.photos.length;

                  return (
                    <div 
                      key={album.id}
                      onClick={() => handleSelectAlbum(album.id)}
                      className="group bg-white rounded-3xl overflow-hidden border border-border/60 hover:border-accent/40 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
                    >
                      {/* Cover Photo / Gradient Container */}
                      <div className="relative aspect-video overflow-hidden bg-primary-dark">
                        {hasCustomCover ? (
                          <img 
                            src={resolveImageUrl(album.coverUrl)} 
                            alt={album.titre} 
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${getGradientForType(album.type)} p-6 flex flex-col justify-between relative`}>
                            {/* Decorative geometric patterns */}
                            <div className="absolute inset-0 opacity-10 haitian-pattern pointer-events-none" />
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 backdrop-blur-sm">
                              <ImageIcon size={20} />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Album Photo</span>
                              <h4 className="text-lg font-display font-bold text-white leading-tight line-clamp-2 mt-1">{album.titre}</h4>
                            </div>
                          </div>
                        )}

                        {/* Top indicators */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${getBadgeColor(album.type)}`}>
                            {album.type}
                          </span>
                        </div>

                        {/* Photos count */}
                        <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono tracking-widest uppercase">
                          {photosCount} {photosCount > 1 ? 'photos' : 'photo'}
                        </div>

                        {/* Admin Action Badges */}
                        {isAdmin && (
                          <div className="absolute top-4 right-4 flex gap-2 z-20">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAlbum(album);
                                setIsAlbumModalOpen(true);
                              }}
                              className="p-2 bg-white/90 hover:bg-white text-primary rounded-lg transition-colors border border-border shadow-sm"
                              title="Modifier l'album"
                            >
                              <Edit size={12} />
                            </button>
                            <button 
                              onClick={(e) => handleDeleteAlbum(album.id, e)}
                              className="p-2 bg-secondary text-white hover:bg-secondary-dark rounded-lg transition-colors shadow-sm"
                              title="Supprimer l'album"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Info Details */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-4 text-[9px] font-mono text-text-light uppercase tracking-widest mb-3">
                            <span className="flex items-center gap-1"><Calendar size={11} /> {album.date}</span>
                            <span className="flex items-center gap-1"><MapPin size={11} className="text-secondary" /> {album.lieu.split(',')[0]}</span>
                          </div>
                          <h3 className="text-xl font-display font-bold text-primary mb-3 leading-tight group-hover:text-secondary transition-colors line-clamp-1">{album.titre}</h3>
                          <p className="text-text-muted text-xs leading-relaxed mb-6 line-clamp-2">{album.description}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 group-hover:text-secondary transition-colors mt-auto">
                          Voir les photos <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-border/80 shadow-sm">
                <Search size={48} className="mx-auto text-text-light mb-6 opacity-25" />
                <h3 className="text-2xl font-display font-bold text-primary mb-2">Aucun album trouvé</h3>
                <p className="text-text-muted text-sm max-w-md mx-auto">Nous n'avons trouvé aucun événement correspondant à vos critères de recherche ou de filtrage.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedType('all'); setSelectedYear('all'); }} 
                  className="mt-6 text-secondary font-bold uppercase tracking-widest text-xs hover:underline"
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </>
        ) : (
          /* ========================================================================= */
          /* --- ALBUM DETAILS & IMAGE GRID VIEW --- */
          /* ========================================================================= */
          activeAlbum && (
            <div className="space-y-12">
              {/* Back to list block */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
                <div>
                  <span className={`inline-block px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest mb-3 ${getBadgeColor(activeAlbum.type)}`}>
                    {activeAlbum.type}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-display font-bold text-primary">{activeAlbum.titre}</h1>
                  <div className="flex flex-wrap items-center gap-6 mt-4 text-xs font-mono uppercase tracking-widest text-text-light">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {activeAlbum.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-secondary" /> {activeAlbum.lieu}</span>
                    <span className="flex items-center gap-1.5"><Grid size={14} /> {activeAlbum.photos.length} photos</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setEditingAlbum(activeAlbum); setIsAlbumModalOpen(true); }}
                      className="px-4 py-2 border border-border bg-white text-primary hover:bg-surface-2 transition-all rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                    >
                      <Edit size={14} /> Modifier Album
                    </button>
                  </div>
                )}
              </div>

              {/* Album Description */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm max-w-4xl">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-text-light mb-2">Description de l'événement</h4>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">{activeAlbum.description}</p>
              </div>

              {/* Admin Panel inside Opened Album to Upload Photos */}
              {isAdmin && (
                <div className="p-8 bg-secondary/5 border-2 border-dashed border-secondary/20 rounded-3xl space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                      <Upload size={18} /> Gestionnaire de médias de l'album
                    </h3>
                    <p className="text-xs text-text-muted mt-1">Téléversez des fichiers depuis votre ordinateur ou ajoutez des adresses d'images en ligne.</p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Drag and Drop Upload */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-secondary bg-secondary/10' 
                          : 'border-border bg-white hover:border-secondary/40 hover:bg-secondary/[0.02]'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileInputChange} 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4">
                        <Upload size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-primary mb-1">Faites glisser vos photos ici</h4>
                      <p className="text-xs text-text-muted max-w-xs leading-relaxed">ou cliquez pour parcourir vos fichiers. Vous pouvez sélectionner plusieurs photos à la fois (JPEG, PNG).</p>
                    </div>

                    {/* URL Bulk Add */}
                    <form onSubmit={handleBulkAddPhotos} className="space-y-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Ajouter des photos par URL</h4>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-text-light block">Adresses des images (une par ligne ou séparées par des virgules)</label>
                        <textarea 
                          rows={3} 
                          value={bulkPhotoUrls}
                          onChange={(e) => setBulkPhotoUrls(e.target.value)}
                          placeholder="https://ex.com/image1.jpg&#10;https://ex.com/image2.png"
                          className="w-full bg-bg border border-border p-3 rounded-xl outline-none text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-text-light block">Description globale (texte alternatif / ALT pour le SEO)</label>
                        <input 
                          type="text"
                          value={bulkPhotoAlt}
                          onChange={(e) => setBulkPhotoAlt(e.target.value)}
                          placeholder="Ex: Conférence sur l'investissement agricole..."
                          className="w-full bg-bg border border-border p-3 rounded-xl outline-none text-xs"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full btn-primary py-3 text-xs bg-secondary hover:brightness-110 shadow-sm"
                      >
                        <Plus size={14} /> Ajouter ces liens
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Photos Grid */}
              {activeAlbum.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {activeAlbum.photos.map((photo, index) => (
                    <div 
                      key={photo.id}
                      onClick={() => setLightboxIndex(index)}
                      className="group aspect-square bg-surface border border-border rounded-2xl overflow-hidden relative shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-zoom-in"
                    >
                      <img 
                        src={resolveImageUrl(photo.url)} 
                        alt={photo.alt} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Hover Overlay info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <p className="text-white text-[10px] font-mono truncate uppercase tracking-wider">{photo.alt || 'Visualiser'}</p>
                      </div>

                      {/* Admin action overlays */}
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={(e) => handleSetCoverPhoto(photo.url, e)}
                            className="p-1.5 bg-white text-amber-500 hover:bg-amber-50 rounded-md transition-colors border border-border shadow-sm text-[10px]"
                            title="Définir comme couverture"
                          >
                            Couverture
                          </button>
                          <button
                            onClick={(e) => handleDeletePhoto(photo.id, e)}
                            className="p-1.5 bg-secondary text-white hover:bg-secondary-dark rounded-md transition-colors shadow-sm"
                            title="Supprimer la photo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}

                      {/* Cover Badge indicator */}
                      {activeAlbum.coverUrl === photo.url && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-primary-dark rounded text-[8px] font-bold uppercase tracking-widest border border-accent-light shadow-sm">
                          Couverture
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
                  <ImageIcon size={48} className="mx-auto text-text-light mb-6 opacity-25" />
                  <h3 className="text-xl font-display font-bold text-primary mb-2">Aucune photo dans cet album</h3>
                  <p className="text-text-muted text-sm max-w-sm mx-auto mb-6">Cet album est créé, mais n'a pas encore de photos officielles rattachées.</p>
                  
                  {isAdmin ? (
                    <p className="text-xs text-secondary-dark italic">Utilisez le gestionnaire de médias ci-dessus pour importer les photos officielles de cet événement.</p>
                  ) : (
                    <p className="text-xs text-text-light italic">Les photos officielles fournies par les membres et organisateurs seront bientôt ajoutées par l'administrateur.</p>
                  )}
                </div>
              )}
            </div>
          )
        )}

      </div>

      {/* ========================================================================= */}
      {/* --- LIGHTBOX (ZOOMABLE FULLSCREEN CONTAINER) --- */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {lightboxIndex !== null && activeAlbum && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex flex-col select-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top controls header */}
            <div className="h-16 flex items-center justify-between px-6 bg-black/40 border-b border-white/5 z-50">
              <div className="text-white/70 text-xs font-mono uppercase tracking-widest">
                {activeAlbum.titre} — {lightboxIndex + 1} / {activeAlbum.photos.length}
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-4">
                {/* Zoom buttons */}
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                  <button 
                    onClick={handleZoomOut}
                    className="p-1.5 hover:bg-white/10 text-white rounded transition-colors"
                    title="Zoom arrière"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-[10px] font-mono text-white/60 px-1">{zoomScale}x</span>
                  <button 
                    onClick={handleZoomIn}
                    className="p-1.5 hover:bg-white/10 text-white rounded transition-colors"
                    title="Zoom avant"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  title="Fermer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Active photo slide container */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              
              {/* Previous slide button */}
              <button 
                onClick={handlePrevPhoto}
                className="absolute left-6 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white hover:scale-105 active:scale-95 transition-all z-50 border border-white/5"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Zoom and Pan interactive container */}
              <div 
                className="w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center p-4 relative"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img 
                  src={resolveImageUrl(activeAlbum.photos[lightboxIndex].url)} 
                  alt={activeAlbum.photos[lightboxIndex].alt} 
                  style={{
                    transform: `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`,
                    cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                    transition: isDragging ? 'none' : 'transform 0.20s ease-out'
                  }}
                  className="max-w-full max-h-full object-contain pointer-events-auto shadow-2xl rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (zoomScale === 1) {
                      setZoomScale(2);
                    } else {
                      setZoomScale(1);
                      setPanOffset({ x: 0, y: 0 });
                    }
                  }}
                />
              </div>

              {/* Next slide button */}
              <button 
                onClick={handleNextPhoto}
                className="absolute right-6 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white hover:scale-105 active:scale-95 transition-all z-50 border border-white/5"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom SEO info card */}
            <div className="p-6 text-center bg-black/40 border-t border-white/5">
              <p className="text-white/90 text-sm font-medium tracking-wide">
                {activeAlbum.photos[lightboxIndex].alt || activeAlbum.titre}
              </p>
              <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mt-1">
                Texte alternatif SEO : <span className="text-white/65 italic font-sans lowercase">{activeAlbum.photos[lightboxIndex].alt}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ========================================================================= */}
      {/* --- ALBUM CREATION / MODIFICATION MODAL --- */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAlbumModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary-dark/80 backdrop-blur-md"
            onClick={() => setIsAlbumModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 border-b border-border flex justify-between items-center bg-surface-2">
                <h3 className="text-xl font-bold font-display text-primary">
                  {editingAlbum ? "Modifier l'album photo" : "Créer un nouvel album"}
                </h3>
                <button onClick={() => setIsAlbumModalOpen(false)} className="p-2 bg-white rounded-full border border-border hover:bg-surface-2 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveAlbum} className="p-6 md:p-8 space-y-6">
                
                {/* General Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary border-b border-border pb-1">Informations Générales</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-light block">Titre de l'événement*</label>
                    <input 
                      required 
                      name="titre"
                      type="text" 
                      defaultValue={editingAlbum?.titre || ''}
                      placeholder="Ex: Conférence-débat Diaspora et Investissement"
                      className="w-full bg-surface-2 p-3.5 rounded-xl border border-border focus:ring-2 ring-primary outline-none text-sm transition-all"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-light block">Date de l'événement*</label>
                      <input 
                        required 
                        name="date"
                        type="date" 
                        defaultValue={editingAlbum?.date || ''}
                        className="w-full bg-surface-2 p-3.5 rounded-xl border border-border focus:ring-2 ring-primary outline-none text-sm transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-light block">Lieu*</label>
                      <input 
                        required 
                        name="lieu"
                        type="text" 
                        defaultValue={editingAlbum?.lieu || ''}
                        placeholder="Ex: Saint-Denis, Bourse du Travail"
                        className="w-full bg-surface-2 p-3.5 rounded-xl border border-border focus:ring-2 ring-primary outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-light block">Type d'activité*</label>
                      <select 
                        required 
                        name="type"
                        defaultValue={editingAlbum?.type || 'événement'}
                        className="w-full bg-surface-2 p-3.5 rounded-xl border border-border focus:ring-2 ring-primary outline-none text-sm transition-all font-bold uppercase text-xs"
                      >
                        <option value="événement">Événement</option>
                        <option value="conférence">Conférence</option>
                        <option value="formation">Formation</option>
                        <option value="mission">Mission</option>
                        <option value="culture">Culture</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-light block">Lien de la photo de couverture (Optionnel)</label>
                      <input 
                        name="coverUrl"
                        type="text" 
                        defaultValue={editingAlbum?.coverUrl || ''}
                        placeholder="/assets/images/... ou URL"
                        className="w-full bg-surface-2 p-3.5 rounded-xl border border-border focus:ring-2 ring-primary outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-light block">Description courte*</label>
                    <textarea 
                      required 
                      name="description"
                      rows={3} 
                      defaultValue={editingAlbum?.description || ''}
                      placeholder="Résumez brièvement le contexte, le programme et la portée de cet événement..."
                      className="w-full bg-surface-2 p-3.5 rounded-xl border border-border focus:ring-2 ring-primary outline-none text-sm transition-all resize-none"
                    />
                  </div>
                </div>

                {/* SEO Config */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary border-b border-border pb-1">Optimisation Référencement (SEO)</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-light block">Titre SEO de l'album</label>
                    <input 
                      name="seoTitle"
                      type="text" 
                      defaultValue={editingAlbum?.seoTitle || ''}
                      placeholder="Ex: Galerie - 17ᵉ Journée Portes Ouvertes | PAFHA"
                      className="w-full bg-surface-2 p-3.5 rounded-xl border border-border focus:ring-2 ring-primary outline-none text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-light block">Description SEO de l'album</label>
                    <input 
                      name="seoDescription"
                      type="text" 
                      defaultValue={editingAlbum?.seoDescription || ''}
                      placeholder="Ex: Retrouvez les photos officielles de la 17ème Journée Portes Ouvertes franco-haïtienne."
                      className="w-full bg-surface-2 p-3.5 rounded-xl border border-border focus:ring-2 ring-primary outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Form buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button 
                    type="button" 
                    onClick={() => setIsAlbumModalOpen(false)}
                    className="px-6 py-3 border border-border rounded-lg text-text-muted text-xs uppercase tracking-wider font-bold hover:bg-surface-2 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary py-3 px-6 text-xs bg-secondary hover:brightness-110 shadow-sm"
                  >
                    {editingAlbum ? "Sauvegarder les modifications" : "Créer l'album"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
