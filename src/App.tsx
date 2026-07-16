import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Users, 
  Calendar, 
  BookOpen, 
  Home, 
  Handshake, 
  Scale, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  ExternalLink,
  Play,
  Search,
  Check,
  Send,
  Share2,
  Download,
  Copy,
  MessageCircle,
  Clock,
  User,
  Tag,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GalerieView from './components/GalerieView';

// --- Constants & Data ---

const NAVIGATION_LINKS = [
  { name: 'À propos', hash: '#a-propos' },
  { name: 'Missions', hash: '#missions' },
  { name: 'Associations', hash: '#associations' },
  { name: 'Galerie', hash: '#galerie' },
  { name: 'Actualités', hash: '#actualites' },
  { name: 'Contact', hash: '#contact' },
];

const HERO_SLIDES = [
  {
    id: 5,
    pill: "Évènement exceptionnel · 6 Juin 2026 · Saint-Denis",
    title: { main: "17ᵉ Journée", sub: "Portes Ouvertes" },
    subtitle: "Diaspora Haïtienne : Investir pour Transformer Haïti.",
    description: "La PAFHA a le plaisir de vous inviter à la 17ᵉ Journée Portes Ouvertes. Un événement majeur de partage, d’échanges et d'engagement.",
    image: "/images/hero/regenerated_image_1783892647759.png",
    articleId: 'journee-portes-ouvertes-2026'
  },
  {
    id: 4,
    pill: "Événement à venir · 25 Avril 2026 · Pantin",
    title: { main: "Leadership Féminin", sub: "& Projets Durables" },
    subtitle: "Entrepreneuriat diasporique au féminin : de l'idée à l'impact.",
    description: "Une journée stratégique pour structurer vos projets et bâtir une trajectoire crédible de financement.",
    image: "/images/hero/regenerated_image_1784216879674.png",
    articleId: 'leadership-feminin-diaspora-2026'
  },
  {
    id: 1,
    pill: "Fondée en 2002 · Réseau franco-haïtien · Paris",
    title: { main: "Ensemble pour Haïti", sub: "depuis la France" },
    subtitle: "Leadership féminin, projets durables & solidarité active",
    description: "La PAFHA fédère les associations franco-haïtiennes pour renforcer les liens entre la diaspora et Haïti.",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1920"
  },
  {
    id: 2,
    pill: "23 ans d'engagement solidaire",
    title: { main: "Structurer, accompagner", sub: "et faire émerger" },
    subtitle: "Plus de 50 associations membres. Un réseau vivant.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1920"
  },
  {
    id: 3,
    pill: "Rejoindre la communauté",
    title: { main: "Vous êtes de la diaspora", sub: "franco-haïtienne ?" },
    subtitle: "Associations, porteurs de projets, bénévoles : la PAFHA vous accompagne.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1920"
  }
];

const STATS = [
  { value: 2002, label: "Année de création", prefix: "" },
  { value: 23, label: "Ans d'actions solidaires", suffix: "" },
  { value: 15, label: "Ans à la Fête de l'Humanité", suffix: "" },
  { value: 50, label: "Associations membres", suffix: "+" }
];

const MISSIONS = [
  {
    id: "01",
    title: "Mise en réseau",
    icon: <Users className="w-10 h-10" />,
    description: "Fédérer et connecter les associations franco-haïtiennes pour créer des synergies et amplifier l'impact collectif."
  },
  {
    id: "02",
    title: "Formation",
    icon: <BookOpen className="w-10 h-10" />,
    description: "Ateliers numériques, formations aux appels d'offres, renforcement des compétences des membres."
  },
  {
    id: "03",
    title: "Développement local",
    icon: <Home className="w-10 h-10" />,
    description: "Soutien aux projets de développement portés par la diaspora en Haïti : agriculture, éducation, santé."
  },
  {
    id: "04",
    title: "Intégration",
    icon: <Handshake className="w-10 h-10" />,
    description: "Accompagnement des Haïtiennes et Haïtiens dans leur parcours d'intégration en France."
  },
  {
    id: "05",
    title: "Appui projets OPAP",
    icon: <CheckCircle2 className="w-10 h-10" />,
    description: "Accompagnement des associations dans les appels à projets OPAP en tant qu'opérateur d'appui."
  },
  {
    id: "06",
    title: "Accompagnement juridique",
    icon: <Scale className="w-10 h-10" />,
    description: "Conseil et orientation juridique pour les associations membres et la communauté."
  }
];

const ASSOCIATIONS = [
  { id: 'ahdel', nom: 'Agence Haïtienne pour le Développement Local', sigle: 'AHDEL', secteurs: ['Développement local', 'Agriculture'], description: "L'AHDEL soutient les initiatives de développement local en Haïti.", region: 'Haïti / France', couleur: '#002868', logo: 'https://images.unsplash.com/photo-1599305096909-e8b5bc18962f?auto=format&fit=crop&q=80&w=200' },
  { id: 'afhad', nom: 'France Haïti Artibonite Desdunes', sigle: 'AFHAD', secteurs: ['Développement local', 'Culture'], description: "L'AFHAD renforce les liens entre la France et la région de l'Artibonite.", region: 'Artibonite, Haïti', couleur: '#CE1126', logo: 'https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80&w=200' },
  { id: 'alpha-haiti', nom: 'Alpha Haïti', sigle: 'ALPHA', secteurs: ['Éducation', 'Formation'], description: "Alpha Haïti œuvre pour l'alphabétisation.", region: 'France / Haïti', couleur: '#D4AF37', logo: 'https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&q=80&w=200' },
  { id: 'aaeh', nom: "Association d'Aide aux Enfants d'Haïti", sigle: 'AAEH', secteurs: ['Enfance', 'Éducation', 'Santé'], description: "L'AAEH soutient les enfants haïtiens les plus démunis.", region: 'Haïti / France', couleur: '#002868', logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  { id: 'aehf', nom: "Association des Étudiants Haïtiens de France", sigle: 'AEHF', secteurs: ['Jeunesse', 'Intégration'], description: "L'AEHF accompagne les étudiants haïtiens.", region: 'France', couleur: '#CE1126', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200' },
  { id: 'afhaf', nom: "Association des Femmes Haïtiennes de France", sigle: 'AFHAF', secteurs: ['Femmes', 'Leadership'], description: "L'AFHAF valorise et soutient les femmes haïtiennes.", region: 'France', couleur: '#D4AF37', logo: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&q=80&w=200' },
  { id: 'kisqueya', nom: "Maison Kisqueya", sigle: 'MK', secteurs: ['Social', 'Culture', 'Numérique'], description: "Espace d'innovation sociale et de culture franco-haïtienne.", region: 'Pantin, France', couleur: '#002868', logo: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=200' },
  { id: 'haiti-futur', nom: "Haïti Futur", sigle: 'HF', secteurs: ['Education', 'Numérique'], description: "L'association promeut l'éducation par le numérique.", region: 'France / Haïti', couleur: '#CE1126', logo: 'https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=200' },
  { id: 'apadh', nom: "Action pour le Développement d'Haïti", sigle: 'APADH', secteurs: ['Agriculture', 'Eau'], description: "Projets de développement rural durable.", region: 'Haïti', couleur: '#D4AF37', logo: 'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&q=80&w=200' },
  { id: 'grahn', nom: "GRAHN France", sigle: 'GRAHN', secteurs: ['Recherche', 'Éducation'], description: "Groupe de Réflexion pour une Haïti Nouvelle.", region: 'France', couleur: '#002868', logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200' },
  { id: 'solidarite', nom: "Solidarité Franco-Haïtienne", sigle: 'SFH', secteurs: ['Social', 'Urgence'], description: "Action humanitaire et sociale.", region: 'Ile-de-France', couleur: '#CE1126', logo: 'https://images.unsplash.com/photo-1469571486079-619983944733?auto=format&fit=crop&q=80&w=200' },
  { id: 'artisans', nom: "Artisans d'Haïti", sigle: 'ADH', secteurs: ['Artisanat', 'Commerce'], description: "Promotion du savoir-faire artisanal haïtien.", region: 'Sud, Haïti', couleur: '#D4AF37', logo: 'https://images.unsplash.com/photo-1517646287270-a5a07c92b2d2?auto=format&fit=crop&q=80&w=200' },
];

const ARTICLES = [
  {
    id: 'journee-portes-ouvertes-2026',
    titre: '17ᵉ Journée Portes Ouvertes des Associations Franco-Haïtiennes',
    badge: 'Événement',
    badgeColor: 'secondary',
    date: '6 juin 2026',
    lieu: 'Saint-Denis',
    auteur: 'PAFHA',
    image: '/images/actualites/regenerated_image_1783892647759.png',
    extrait: 'La PAFHA a le plaisir de vous inviter à la 17ᵉ Journée Portes Ouvertes des Associations Franco-Haïtiennes, un événement majeur de rencontre, de partage et d’échanges autour du rôle de la diaspora dans le développement d’Haïti.',
    contenu: `
      <div class="space-y-8">
        <div class="p-6 bg-surface-2 rounded-2xl border border-border">
          <h3 class="text-xl font-display font-bold text-primary mb-2">Diaspora Haïtienne : Investir pour Transformer Haïti</h3>
          <p class="text-text/70">La PAFHA a le plaisir de vous inviter à la 17ᵉ Journée Portes Ouvertes des Associations Franco-Haïtiennes, un événement majeur de rencontre, de partage et d’échanges autour du rôle de la diaspora dans le développement d’Haïti.</p>
        </div>

        <p class="text-base leading-relaxed">Organisée par la PAFHA et son réseau associatif, cette 17ᵉ édition de la Journée Portes Ouvertes se déroulera :</p>
        
        <div class="grid md:grid-cols-2 gap-8 py-8 border-y border-border">
          <div class="space-y-4">
            <h3 class="text-lg font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              Informations pratiques
            </h3>
            <ul class="space-y-3 text-text/80 text-sm">
              <li><strong>📅 Date :</strong> Samedi 6 juin 2026</li>
              <li><strong>🕚 Horaires :</strong> de 11h00 à 20h00</li>
              <li><strong>📍 Lieu :</strong> Bourse du Travail de Saint-Denis</li>
              <li><strong>🏠 Adresse :</strong> 9-11 rue de Génin, 93200 Saint-Denis</li>
              <li><strong>🚇 Accès :</strong> Métro Ligne 13, Tram Porte de Paris et RER Saint-Denis</li>
            </ul>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              Informations importantes
            </h3>
            <ul class="space-y-3 text-text/80 text-sm">
              <li><strong>✅ Entrée :</strong> Libre et gratuite</li>
              <li><strong>👥 Public :</strong> Ouverte à toutes et à tous</li>
              <li><strong>👪 Ambiance :</strong> Familiale et conviviale</li>
              <li><strong>🍽️ Restauration :</strong> Disponible sur place</li>
            </ul>
          </div>
        </div>

        <div class="space-y-4">
          <p class="font-bold text-primary text-lg font-display">Thème de l'édition : « Diaspora Haïtienne : Investir pour Transformer Haïti »</p>
          <p class="text-text/70 leading-relaxed">L'objectif est de favoriser les échanges entre les associations, les entrepreneurs, les porteurs de projets, les membres de la diaspora et toutes les personnes souhaitant contribuer au développement économique, social et culturel d’Haïti.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 bg-surface-2 p-8 rounded-2xl">
          <div>
            <h4 class="text-base font-bold text-primary mb-4 uppercase tracking-wider">Activités prévues</h4>
            <ul class="space-y-2 text-sm text-text/80">
              <li>• Village des associations</li>
              <li>• Conférence-débat : de l’aide à l’investissement</li>
              <li>• Espace littéraire</li>
              <li>• Jardin d’enfants</li>
              <li>• Découverte de la culture haïtienne</li>
              <li>• Rencontres et réseautage</li>
              <li>• Restauration sur place</li>
            </ul>
          </div>

          <div>
            <h4 class="text-base font-bold text-primary mb-4 uppercase tracking-wider">Conférence principale (15h - 17h)</h4>
            <p class="text-sm font-semibold text-secondary mb-2">Conférence-débat :</p>
            <p class="text-sm italic font-medium">« De l’aide à l’investissement : les défis, les réalités et les solutions »</p>
          </div>
        </div>

        <div class="p-6 bg-accent/20 rounded-2xl border border-accent/30 text-center">
          <p class="font-medium text-primary leading-relaxed text-sm md:text-base">Venez nombreux en famille, entre amis ou entre collègues pour partager un moment de réflexion, d’échanges et d’engagement autour de l’avenir d’Haïti.</p>
          <p class="font-display font-bold text-lg text-secondary mt-2">Ensemble, bâtissons l’avenir d’Haïti !</p>
        </div>

        <div class="flex flex-wrap gap-4 pt-10">
          <button class="btn-primary" onclick="window.navigateTo('join')">S'inscrire à l'association</button>
          <button class="btn-outline-blue" onclick="window.navigateTo('home')">Découvrir la PAFHA</button>
        </div>
      </div>
    `,
    tags: ['Portes Ouvertes', 'Diaspora', 'Saint-Denis']
  },
  {
    id: 'leadership-feminin-diaspora-2026',
    titre: 'Leadership Féminin & Projets Durables – Entrepreneuriat diasporique au féminin',
    badge: 'Formation',
    badgeColor: 'accent',
    date: '25 avril 2026',
    lieu: 'Pantin',
    auteur: 'PAFHA',
    image: '/images/actualites/regenerated_image_1784216879674.png',
    extrait: 'Une journée stratégique dédiée aux femmes de la diaspora pour structurer un projet, clarifier un modèle et bâtir une trajectoire crédible de financement.',
    contenu: `
      <div class="space-y-8">
        <p class="text-xl font-medium text-primary">Ensemble pour Haïti depuis la France, la PAFHA organise une journée de formation et de réflexion autour du leadership féminin et des projets durables.</p>
        
        <div class="grid md:grid-cols-2 gap-8 py-8 border-y border-border">
          <div class="space-y-4">
            <h3 class="text-lg font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              Informations clés
            </h3>
            <ul class="space-y-3 text-text/80 text-sm">
              <li><strong>Date :</strong> 25 avril 2026</li>
              <li><strong>Horaires :</strong> 10h00 – 17h00</li>
              <li><strong>Lieu :</strong> La Salle de Pantin, 14 rue Victor Hugo, 93500 Pantin</li>
              <li><strong>Places disponibles :</strong> 30 participantes</li>
              <li><strong>Tarif :</strong> 100 % gratuit</li>
            </ul>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              Programme
            </h3>
            <ul class="space-y-3 text-text/80 text-sm">
              <li>• Conférences & ateliers</li>
              <li>• Structuration de projet</li>
              <li>• Financement & ingénierie de projet</li>
              <li>• Réseau & impact</li>
            </ul>
          </div>
        </div>

        <div class="space-y-4">
          <p>Créée en 2002, membre fondateur du FORIM et membre de Coordination SUD, la PAFHA fédère les associations franco-haïtiennes afin de renforcer les liens entre la diaspora et Haïti, soutenir l’intégration en France et contribuer au développement local.</p>
          <p>Cette formation s’adresse aux femmes de la diaspora porteuses d’idées, d’ambitions ou de projets à impact souhaitant passer d’une intuition à un projet structuré, crédible et finançable.</p>
        </div>

        <div class="flex flex-wrap gap-4 pt-10">
          <button class="btn-primary">Réserver ma place</button>
          <button class="btn-outline-blue">Découvrir la PAFHA</button>
        </div>
      </div>
    `,
    tags: ['Leadership', 'Formation', 'Diaspora']
  },
  {
    id: 'leadership-feminin-2026',
    titre: 'Leadership Féminin & Projets Durables — 2026',
    badge: 'Événement',
    badgeColor: 'secondary',
    date: '25 avril 2026',
    lieu: 'Pantin',
    auteur: 'Esther Saint-Ville',
    image: '/images/actualites/regenerated_image_1784216881162.png',
    extrait: 'Une journée de formation intensive pour les femmes de la diaspora.',
    contenu: '<h2>Leadership Féminin</h2><p>Le 25 avril 2026...</p>',
    tags: ['Formation', 'Leadership']
  },
];

const PARTNERS = [
  { name: "FORIM", pill: "Membre fondateur", url: "#", badgeColor: "bg-primary", description: "Le FORIM fédère les organisations issues des migrations." },
  { name: "Coordination SUD", pill: "Réseau national", url: "#", badgeColor: "bg-secondary", description: "Coordination nationale des ONG françaises." },
  { name: "Maison Kisqueya", pill: "Ancrage local", url: "#", badgeColor: "bg-accent", description: "Espace d'innovation sociale et de culture franco-haïtienne." },
];

const NEWS = [
  {
    id: 1,
    badge: "Prochain événement",
    badgeColor: "bg-secondary",
    title: "Leadership Féminin & Projets Durables",
    date: "25 avril 2026 · Pantin",
    excerpt: "Une journée de formation intensive pour les femmes de la diaspora porteuses de projets à impact.",
    link: "#"
  },
  {
    id: 2,
    badge: "Formation",
    badgeColor: "bg-primary",
    title: "Atelier numérique pour les associations membres",
    date: "Mars 2026",
    excerpt: "La PAFHA a organisé un atelier de formation aux outils numériques pour renforcer les capacités des associations.",
    link: "#"
  },
  {
    id: 3,
    badge: "Réseau",
    badgeColor: "bg-accent",
    title: "La PAFHA à la Fête de l'Humanité 2025",
    date: "Septembre 2025",
    excerpt: "Pour la 15e année consécutive, la PAFHA était présente pour valoriser la culture et les projets de la diaspora.",
    link: "#"
  }
];

// --- Components ---

const AssociationModal = ({ association, onClose }) => {
  if (!association) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-primary-dark/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-surface max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-2 md:h-3 w-full sticky top-0 z-20" style={{ backgroundColor: association.couleur }} />
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/80 backdrop-blur shadow-sm hover:bg-surface-2 rounded-full transition-colors z-20">
          <X size={20} />
        </button>
        <div className="p-6 md:p-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-border shadow-sm flex-shrink-0 bg-white">
               <img src={association.logo} alt={association.nom} className="w-full h-full object-contain p-2" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary mb-2 block">{association.sigle}</span>
              <h3 className="text-xl md:text-3xl font-display font-bold text-primary leading-tight">{association.nom}</h3>
            </div>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-8">
            {association.secteurs.map(s => (
              <span key={s} className="px-3 py-1 bg-surface-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-text-muted">{s}</span>
            ))}
          </div>
          <p className="text-text/70 leading-relaxed mb-8 text-base md:text-lg">{association.description}</p>
          <div className="grid gap-4 mb-8 p-6 bg-surface-2 rounded-2xl">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-light mb-1">Région d'intervention</p>
              <p className="font-semibold flex items-center justify-center sm:justify-start gap-2 text-sm md:text-base"><MapPin size={14} className="text-secondary" /> {association.region}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-primary w-full py-4">Fermer</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AssociationsListView = ({ onBack, onOpenDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 6;

  const filtered = ASSOCIATIONS.filter(as => 
    as.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    as.sigle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    as.secteurs.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice((currentPageNum - 1) * itemsPerPage, currentPageNum * itemsPerPage);

  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen haitian-pattern">
      <div className="container-custom">
        <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-12 hover:text-secondary transition-colors">
          <ArrowRight size={16} className="rotate-180" /> Retour à l'accueil
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <SectionHeading 
              overtitle="Annuaire" 
              title="Le réseau de la PAFHA" 
              subtitle="Explorez l'excellence associative franco-haïtienne. Plus de 50 organisations œuvrant pour le futur." 
            />
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPageNum(1); }}
              placeholder="Rechercher une association..." 
              className="w-full bg-white border border-border pl-12 pr-4 py-4 rounded-xl focus:ring-2 ring-primary outline-none shadow-sm transition-all text-sm"
            />
          </div>
        </div>

        {displayed.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {displayed.map(as => (
                <button 
                  key={as.id} 
                  onClick={() => onOpenDetails(as)}
                  className="group p-8 bg-white border border-border rounded-2xl text-left hover:border-secondary hover:shadow-2xl transition-all duration-500 reveal visible"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-bg rounded-xl overflow-hidden border border-border/50 group-hover:scale-110 transition-transform duration-500 bg-white">
                      <img src={as.logo} alt={as.nom} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all">
                      <Plus size={18} />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary mb-2 block">{as.sigle}</span>
                  <h4 className="text-xl font-display font-bold text-primary mb-6 leading-tight group-hover:text-secondary transition-colors h-14 line-clamp-2">{as.nom}</h4>
                  <div className="flex flex-wrap gap-2">
                    {as.secteurs.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-surface-2 rounded text-[9px] font-bold uppercase tracking-wider text-text-light">{s}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button 
                  disabled={currentPageNum === 1}
                  onClick={() => setCurrentPageNum(p => p - 1)}
                  className="p-4 rounded-xl border border-border hover:bg-primary hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPageNum(i + 1)}
                      className={`w-12 h-12 rounded-xl font-mono text-sm border transition-all ${currentPageNum === i + 1 ? 'bg-secondary border-secondary text-white font-bold shadow-lg' : 'border-border text-text hover:border-secondary'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPageNum === totalPages}
                  onClick={() => setCurrentPageNum(p => p + 1)}
                  className="p-4 rounded-xl border border-border hover:bg-primary hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
            <Search size={48} className="mx-auto text-text-light mb-6 opacity-20" />
            <h3 className="text-2xl font-display font-bold text-primary mb-2">Aucun résultat</h3>
            <p className="text-text-muted">Nous n'avons trouvé aucune association correspondant à votre recherche.</p>
            <button onClick={() => setSearchTerm('')} className="mt-8 text-secondary font-bold uppercase tracking-widest text-xs">Effacer la recherche</button>
          </div>
        )}
      </div>
    </div>
  );
};


const ArticleView = ({ article, onBack }) => {
  if (!article) return null;
  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen">
      <div className="container-custom">
        <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-12 hover:text-secondary transition-colors">
          <ArrowRight size={16} className="rotate-180" /> Retour aux actualités
        </button>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mb-8 md:mb-12 aspect-[4/3] md:aspect-video relative">
            <img src={article.image} alt={article.titre} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
              <span className={`inline-block px-4 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white mb-4 md:mb-6 bg-${article.badgeColor}`}>{article.badge}</span>
              <h1 className="text-3xl md:text-6xl text-white font-display font-bold leading-tight">{article.titre}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-8 md:mb-12 py-6 border-y border-border text-[10px] md:text-xs font-mono uppercase tracking-widest text-text-light">
            <div className="flex items-center gap-2"><Calendar size={14} /> {article.date}</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> {article.lieu}</div>
            <div className="flex items-center gap-2"><User size={14} /> {article.auteur}</div>
          </div>
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-primary prose-p:text-text/70 prose-blockquote-border-secondary" dangerouslySetInnerHTML={{ __html: article.contenu }} />
          <div className="mt-16 pt-12 border-t border-border">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Partager cet article</h4>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Copy].map((I, i) => (
                <button key={i} className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all"><I size={18}/></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DonView = ({ onBack }) => {
  const [amount, setAmount] = useState('50');
  const [freq, setFreq] = useState('once');
  
  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen">
      <div className="container-custom">
        <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-12 hover:text-secondary transition-colors">
          <ArrowRight size={16} className="rotate-180" /> Retour à l'accueil
        </button>
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <SectionHeading overtitle="Solidarité" title="Votre don change des vies" subtitle="En soutenant la PAFHA, vous investissez dans le renforcement des capacités de la diaspora et le développement local durable en Haïti." />
            <div className="grid gap-8">
              {[
                { title: "Indépendance", desc: "Nous garantissons une action neutre et des projets choisis pour leur pertinence locale.", icon: Scale },
                { title: "Transparence", desc: "Chaque euro collecté est tracé et fait l'objet d'un rapport annuel d'activité.", icon: CheckCircle2 },
                { title: "Impact", desc: "Nous privilégions les projets à long terme : formation, agriculture, éducation.", icon: Play }
              ].map(i => (
                <div key={i.title} className="flex gap-6 p-6 bg-surface border border-border rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0"><i.icon size={24}/></div>
                  <div><h4 className="font-bold mb-2">{i.title}</h4><p className="text-sm text-text-muted">{i.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-12 rounded-3xl shadow-2xl border border-border sticky top-32 h-fit">
            <h3 className="text-2xl font-display font-bold text-primary mb-8">Détails de mon don</h3>
            <div className="mb-8 flex bg-surface-2 p-1 rounded-full">
              <button onClick={() => setFreq('once')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${freq === 'once' ? 'bg-primary text-white shadow-lg' : 'text-text/60'}`}>Don ponctuel</button>
              <button onClick={() => setFreq('monthly')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${freq === 'monthly' ? 'bg-primary text-white shadow-lg' : 'text-text/60'}`}>Don mensuel</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {['10', '25', '50', '100'].map(a => (
                <button key={a} onClick={() => setAmount(a)} className={`py-5 rounded-2xl font-mono text-xl border-2 transition-all ${amount === a ? 'bg-secondary/5 border-secondary text-secondary font-bold shadow-sm' : 'border-border text-text-muted hover:border-secondary/40'}`}>{a}€</button>
              ))}
            </div>
            <div className="space-y-4 mb-8">
               <input className="w-full bg-surface-2 p-4 rounded-xl border border-border focus:ring-2 ring-secondary outline-none text-sm" placeholder="Autre montant (€)" type="number" />
               <p className="text-[10px] text-text-muted italic px-2">Un don de {amount}€ vous revient à {Math.round(Number(amount) * 0.34)}€ après déduction fiscale (66%).</p>
            </div>
            <button className="btn-primary w-full py-5 text-xl font-bold bg-secondary shadow-lg shadow-secondary/20">Faire mon don de {amount}€</button>
            <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JoinView = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nomComplet: '',
    sigle: '',
    anneeCreation: '',
    email: '',
    telephone: '',
    president: '',
    secteurs: [] as string[],
    projets: ''
  });

  const handleContinue1 = () => {
    if (!formData.nomComplet.trim()) {
      alert("Veuillez remplir le nom complet de l'association.");
      return;
    }
    setStep(2);
  };

  const handleContinue2 = () => {
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert("Veuillez saisir une adresse email officielle valide.");
      return;
    }
    setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    const msg = `Nouvelle demande d’adhésion PAFHA :
- Nom complet : ${formData.nomComplet}
- Sigle : ${formData.sigle || 'N/A'}
- Année de création : ${formData.anneeCreation || 'N/A'}
- Email officiel : ${formData.email}
- Téléphone : ${formData.telephone || 'N/A'}
- Président(e) : ${formData.president || 'N/A'}
- Secteurs d'activité : ${formData.secteurs.join(', ') || 'N/A'}
- Projets en cours : ${formData.projets || 'N/A'}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=33662375402&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      onBack();
    }, 4000);
  };

  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen haitian-pattern">
      <div className="container-custom">
        <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-12 hover:text-secondary transition-colors">
          <ArrowRight size={16} className="rotate-180" /> Retour à l'accueil
        </button>

        <div className="max-w-4xl mx-auto">
          {!isSubmitted ? (
            <div className="bg-white p-8 md:p-16 rounded-3xl shadow-2xl border border-border reveal visible">
              <SectionHeading 
                overtitle="Devenir membre" 
                title="Rejoindre le réseau PAFHA" 
                subtitle="Vous portez un projet pour Haïti ou vous souhaitez structurer votre association ? Intégrez la plateforme dès aujourd'hui." 
              />

              <div className="space-y-6 mb-12 text-text/80 leading-relaxed text-sm md:text-base border-l-4 border-accent pl-6 py-2">
                <p>Rejoindre la PAFHA, c’est intégrer un réseau engagé d’associations et d’acteurs de la diaspora œuvrant pour la solidarité, l’égalité et le développement durable entre la France et Haïti.</p>
                <p>L’adhésion permet de soutenir les actions de la PAFHA et de participer à ses activités, formations et espaces de concertation.</p>
                <div>
                  <p className="font-bold text-primary mb-1">Montant de l’adhésion :</p>
                  <p>La cotisation d’adhésion est fixée à 50 euros (€) et correspond à un paiement unique.</p>
                </div>
                <div className="space-y-2 bg-surface-2 p-4 rounded-xl text-[10px] md:text-xs font-medium italic text-text-light">
                  <p className="flex items-center gap-2"><Check size={14} className="text-secondary" /> Le formulaire permet de demander l’adhésion à l’association</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-secondary" /> La cotisation est unique (une seule fois)</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-secondary" /> Aucun paiement annuel ou récurrent n’est demandé</p>
                </div>
              </div>

              <div className="flex gap-4 mb-12">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-secondary' : 'bg-surface-2'}`} />
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h3 className="text-2xl font-display font-bold text-primary">Informations de l'association</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Nom complet*</label>
                        <input 
                          required 
                          value={formData.nomComplet}
                          onChange={(e) => setFormData(prev => ({ ...prev, nomComplet: e.target.value }))}
                          className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm" 
                          placeholder="Ex: Agence pour le Développement..." 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Sigle / Acronyme</label>
                        <input 
                          value={formData.sigle}
                          onChange={(e) => setFormData(prev => ({ ...prev, sigle: e.target.value }))}
                          className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm" 
                          placeholder="Ex: AHDEL" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Année de création</label>
                      <input 
                        type="number" 
                        value={formData.anneeCreation}
                        onChange={(e) => setFormData(prev => ({ ...prev, anneeCreation: e.target.value }))}
                        className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm" 
                        placeholder="2024" 
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <button type="button" onClick={handleContinue1} className="btn-primary">Continuer <ArrowRight size={18} /></button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h3 className="text-2xl font-display font-bold text-primary">Contact & Référent</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Email officiel*</label>
                        <input 
                          required 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm" 
                          placeholder="contact@association.org" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Téléphone</label>
                        <input 
                          value={formData.telephone}
                          onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                          className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm" 
                          placeholder="01 23 45 67 89" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Nom de la présidente / du président</label>
                      <input 
                        value={formData.president}
                        onChange={(e) => setFormData(prev => ({ ...prev, president: e.target.value }))}
                        className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm" 
                        placeholder="Jean Dupont" 
                      />
                    </div>
                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setStep(1)} className="text-text-light font-bold uppercase tracking-widest text-xs">Retour</button>
                      <button type="button" onClick={handleContinue2} className="btn-primary">Continuer <ArrowRight size={18} /></button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h3 className="text-2xl font-display font-bold text-primary">Votre Engagement</h3>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Secteurs d'activité</label>
                      <div className="flex flex-wrap gap-3">
                        {['Agriculture', 'Éducation', 'Santé', 'Économie', 'Culture', 'Numérique'].map(tag => (
                          <label key={tag} className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer hover:bg-accent/10 transition-all border ${formData.secteurs.includes(tag) ? 'border-secondary bg-secondary/5' : 'bg-surface-2 border-transparent'}`}>
                            <input 
                              type="checkbox" 
                              checked={formData.secteurs.includes(tag)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData(prev => ({
                                  ...prev,
                                  secteurs: checked 
                                    ? [...prev.secteurs, tag] 
                                    : prev.secteurs.filter(s => s !== tag)
                                }));
                              }}
                              className="hidden" 
                            />
                            <span className="text-xs font-bold text-text-muted">{tag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Présentez brièvement vos projets en cours</label>
                      <textarea 
                        rows={4} 
                        value={formData.projets}
                        onChange={(e) => setFormData(prev => ({ ...prev, projets: e.target.value }))}
                        className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm resize-none" 
                        placeholder="Décrivez vos actions ici..."
                      />
                    </div>
                    <div className="flex flex-col items-end gap-4 pt-4">
                      <div className="flex w-full justify-between items-center">
                        <button type="button" onClick={() => setStep(2)} className="text-text-light font-bold uppercase tracking-widest text-xs">Retour</button>
                        <button type="submit" className="btn-primary bg-secondary shadow-lg shadow-secondary/20">Finaliser ma demande <Send size={18} /></button>
                      </div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest italic animate-pulse">Cotisation unique : 50 € — aucun renouvellement annuel requis.</p>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-16 rounded-3xl shadow-2xl border border-border text-center overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
              <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-display font-bold text-primary mb-4">Demande envoyée !</h2>
              <p className="text-text-muted text-lg max-w-sm mx-auto mb-10 leading-relaxed">Merci pour votre intérêt. L'équipe de la PAFHA étudiera votre demande et reviendra vers vous par email sous 7 jours.</p>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-text-light animate-pulse">
                <Clock size={14} /> Redirection automatique...
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const NewsletterView = ({ onBack, onSubscribe }) => {
  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen">
      <div className="container-custom">
        <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-12 hover:text-secondary transition-colors">
          <ArrowRight size={16} className="rotate-180" /> Retour à l'accueil
        </button>
        <div className="max-w-4xl mx-auto">
          <SectionHeading overtitle="Archives" title="Newsletter de la PAFHA" subtitle="Suivez l'historique de nos communications et restez informé des projets passés et futurs." />
          
          <form onSubmit={onSubscribe} className="bg-white p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-xl border border-border mb-16">
            <h3 className="text-xl md:text-2xl font-display font-bold text-primary mb-6">S'abonner à la liste</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input required type="email" name="newsletter_email" className="flex-1 bg-surface-2 p-4 md:p-5 rounded-xl border border-border outline-none focus:ring-2 ring-accent transition-all text-sm" placeholder="Votre adresse email professionnelle ou personnelle" />
              <button type="submit" className="btn-primary py-4 md:py-5 px-10">Rejoindre <Send size={18} /></button>
            </div>
            <p className="mt-4 text-[9px] md:text-[10px] text-text-light italic">En vous inscrivant, vous acceptez de recevoir nos actualités mensuelles. Vous pouvez vous désinscrire à tout moment.</p>
          </form>

          <div className="space-y-6">
            {[
              { m: "Mars 2026", t: "Bilan du premier trimestre : Focus sur l'éducation.", l: "PDF 1.2 MB" },
              { m: "Février 2026", t: "Appel à projets 2026 : Proposez vos initiatives !", l: "Lien externe" },
              { m: "Janvier 2026", t: "Vœux de la présidente et perspectives annuelles.", l: "Version Web" },
              { m: "Décembre 2025", t: "Retour sur le gala de solidarité Kisqueya.", l: "PDF 2.4 MB" }
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white border border-border rounded-2xl hover:border-accent transition-all group cursor-pointer reveal">
                <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 bg-bg rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><BookOpen size={20}/></div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary">{n.m}</span>
                    <h4 className="font-bold text-lg text-primary-dark group-hover:text-secondary transition-colors">{n.t}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-light group-hover:text-primary transition-colors">
                   {n.l} <Download size={14}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, isVisible]);

  return <span ref={elementRef} className="font-mono">{count}</span>;
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

interface SectionHeadingProps {
  overtitle: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionHeading = ({ overtitle, title, subtitle, light = false }: SectionHeadingProps) => (
  <div className="mb-12 md:mb-16 reveal">
    <span className={`text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest mb-3 md:mb-4 block ${light ? 'text-accent-light' : 'text-secondary'}`}>{overtitle}</span>
    <h2 className={`text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight ${light ? 'text-white' : 'text-primary'}`}>{title}</h2>
    {subtitle && <p className={`mt-4 md:mt-6 text-base md:text-lg max-w-2xl ${light ? 'text-white/70' : 'text-text-muted'}`}>{subtitle}</p>}
  </div>
);

// --- Main App ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleryTab, setGalleryTab] = useState('photos');
  
  // Custom Router State
  const [currentPage, setCurrentPage] = useState('home'); // home, don, actualites, article, newsletter, join
  const [selectedItem, setSelectedItem] = useState(null); // for association or article

  const navigateTo = (page, item = null) => {
    setCurrentPage(page);
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
    // Note: In a real app we'd use history.pushState here
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('newsletter_email') as string;
    if (!email) return;

    const text = `Nouvelle inscription à la newsletter PAFHA :
- Email : ${email}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=33662375402&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    alert("Merci pour votre inscription à la newsletter ! Redirection vers WhatsApp...");
    e.currentTarget.reset();
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nom = formData.get('contact_nom') || '';
    const email = formData.get('contact_email') || '';
    const sujet = formData.get('contact_sujet') || '';
    const message = formData.get('contact_message') || '';

    const text = `Nouveau message de contact - PAFHA :
- Nom : ${nom}
- Email : ${email}
- Sujet : ${sujet}
- Message : ${message}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=33662375402&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    alert("Message envoyé ! Redirection vers WhatsApp...");
    e.currentTarget.reset();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for reveal elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, [currentPage]); // Re-observe when page changes

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#galerie/')) {
        const albumId = hash.replace('#galerie/', '');
        setCurrentPage('galerie');
        setSelectedItem({ albumId });
      } else if (hash === '#galerie') {
        setCurrentPage('galerie');
        setSelectedItem(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    // run on mount
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'don':
        return <DonView onBack={() => navigateTo('home')} />;
      case 'article':
        return <ArticleView article={selectedItem} onBack={() => navigateTo('home')} />;
      case 'newsletter':
        return <NewsletterView onBack={() => navigateTo('home')} onSubscribe={handleNewsletterSubmit} />;
      case 'join':
        return <JoinView onBack={() => navigateTo('home')} />;
      case 'galerie':
        return <GalerieView onBack={() => navigateTo('home')} initialSelectedAlbumId={selectedItem?.albumId} />;
      case 'associations_list':
        return <AssociationsListView onBack={() => navigateTo('home')} onOpenDetails={(as) => setSelectedItem(as)} />;
      case 'actualites':
        // Show news archive/grid
        return (
          <div className="pt-32 pb-20 bg-bg min-h-screen">
            <div className="container-custom">
              <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-12 hover:text-secondary transition-colors">
                <ArrowRight size={16} className="rotate-180" /> Retour à l'accueil
              </button>
              <SectionHeading overtitle="Média" title="Toute l'actualité de la plateforme" subtitle="Retrouvez ici l'ensemble de nos publications, annonces et reportages." />
              <div className="grid lg:grid-cols-2 gap-10">
                {ARTICLES.map(art => (
                  <article key={art.id} onClick={() => navigateTo('article', art)} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer reveal flex flex-col md:flex-row">
                    <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden relative">
                      <img src={art.image} alt={art.titre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="p-8 md:w-2/3 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-[10px] font-mono text-text-light mb-4 uppercase tracking-widest">
                        <span>{art.date}</span>
                        <span>{art.badge}</span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-primary mb-4 group-hover:text-secondary transition-colors leading-tight">{art.titre}</h3>
                      <p className="text-text-muted text-sm mb-6 line-clamp-2">{art.extrait}</p>
                      <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">Lire la suite <ArrowRight size={14}/></span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ); 
      default:
        return (
          <>
            {/* Hero */}
            <section className="relative h-screen bg-primary-dark overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] scale-105 animate-kenburns" style={{ backgroundImage: `url(${HERO_SLIDES[currentSlide].image})` }} />
                </motion.div>
              </AnimatePresence>
              <div className="container-custom relative h-full flex flex-col justify-center z-20 pt-20">
                <motion.div key={`c-${currentSlide}`} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <span className="inline-block px-4 py-1.5 rounded-full border border-accent/40 bg-accent/10 text-accent-light text-[10px] font-mono uppercase tracking-[0.2em] mb-8">{HERO_SLIDES[currentSlide].pill}</span>
                  <h1 className="text-5xl md:text-8xl text-white font-display font-bold leading-[0.9] mb-8 max-w-4xl tracking-tighter">
                    {HERO_SLIDES[currentSlide].title.main} <br/>
                    <span className="text-accent italic font-light">{HERO_SLIDES[currentSlide].title.sub}</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-white/80 font-medium mb-12 max-w-2xl leading-relaxed">{HERO_SLIDES[currentSlide].subtitle}</p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => {
                        const slide = HERO_SLIDES[currentSlide];
                        if (slide.articleId) {
                          const article = ARTICLES.find(a => a.id === slide.articleId);
                          if (article) {
                            navigateTo('article', article);
                            return;
                          }
                        }
                        if (currentSlide === 3) navigateTo('join');
                        else navigateTo('home');
                      }} 
                      className="btn-primary group"
                    >
                      {HERO_SLIDES[currentSlide].id === 4 ? 'En savoir plus' : (HERO_SLIDES[currentSlide].id === 3 ? 'Nous rejoindre' : 'Découvrir la plateforme')}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
                    <button onClick={() => navigateTo('don')} className="btn-outline-white">Soutenir notre action</button>
                  </div>
                </motion.div>
              </div>
              <div className="absolute bottom-12 right-6 md:right-12 z-20 flex items-center gap-6">
                <div className="flex gap-3">
                  {HERO_SLIDES.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-12 bg-accent' : 'w-4 bg-white/20'}`} />
                  ))}
                </div>
                <div className="text-white/40 font-mono text-xs tabular-nums tracking-widest">
                  0{currentSlide + 1} / 0{HERO_SLIDES.length}
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="bg-primary-dark py-12 md:py-24 border-y border-white/5 haitian-pattern">
              <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                {STATS.map(s => (
                  <div key={s.label} className="text-center group">
                    <h3 className="text-4xl md:text-7xl font-display font-bold text-accent mb-2 md:mb-4 transition-transform group-hover:scale-110 duration-500">
                      <CountUp end={s.value} />{s.suffix}
                    </h3>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/40 font-bold">{s.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* About */}
            <section id="a-propos" className="section-padding bg-bg overflow-hidden">
              <div className="container-custom grid lg:grid-cols-2 gap-24 items-center">
                <div className="reveal">
                  <SectionHeading overtitle="Origines & Vision" title="Plus qu'un réseau, une force collective." />
                  <p className="text-2xl font-display text-primary-dark mb-8 leading-relaxed">Depuis 2002, la PAFHA fédère les énergies de la diaspora haïtienne pour bâtir des ponts durables entre la France et Haïti.</p>
                  <p className="text-text-muted leading-relaxed mb-12 text-lg">Membre fondateur du FORIM et engagée au sein de Coordination SUD, notre plateforme accompagne la structuration des associations et porte la voix de la solidarité franco-haïtienne auprès des institutions.</p>
                  <div className="grid grid-cols-2 gap-8">
                    {[
                      { l: "Fédération", i: Users, d: "50+ associations" },
                      { l: "Expertise", i: CheckCircle2, d: "Opérateur OPAP" },
                      { l: "Solidarité", i: Heart, d: "Action directe" },
                      { l: "Formation", i: BookOpen, d: "Capacités accrues" }
                    ].map(item => (
                      <div key={item.l} className="group">
                        <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center text-secondary mb-4 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                          <item.i size={24} />
                        </div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-1">{item.l}</h4>
                        <p className="text-xs text-text-light">{item.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative reveal mt-12 lg:mt-0">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10 border-4 md:border-8 border-white">
                    <img src="/images/galerie/regenerated_image_1784216878760.jpg" alt="Action Solidaire" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-10 w-4/5 md:w-2/3 aspect-video bg-accent rounded-2xl z-20 shadow-xl p-6 md:p-8 flex flex-col justify-center">
                    <p className="italic font-display text-lg md:text-2xl text-primary-dark mb-2 md:mb-4">« Un chèque vaut de l'argent, un coup de main vaut de l'or. »</p>
                    <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary-dark/60 opacity-60 italic">— Esther Saint-Ville, Présidente</p>
                  </div>
                  <div className="absolute -top-12 -left-12 w-48 h-48 bg-secondary/10 rounded-full blur-3xl z-0" />
                </div>
              </div>
            </section>

            {/* Missions */}
            <section id="missions" className="section-padding bg-surface-2 haitian-pattern">
              <div className="container-custom">
                <SectionHeading 
                  overtitle="Engagements" 
                  title="Nos piliers d'action" 
                  subtitle="Nous structurons notre intervention autour de quatre axes stratégiques pour garantir un impact maximal et pérenne." 
                />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {MISSIONS.map(m => (
                    <div key={m.id} className="p-12 bg-surface rounded-2xl card-hover reveal group">
                      <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center text-primary mb-8 border border-border group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        {m.icon}
                      </div>
                      <h3 className="text-2xl font-display font-bold mb-4">{m.title}</h3>
                      <p className="text-text-muted leading-relaxed text-sm">{m.description}</p>
                      <div className="mt-8 pt-8 border-t border-border/50 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-accent">{m.id}</span>
                        <ArrowRight size={16} className="text-text-light group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Associations Grid */}
            <section id="associations" className="section-padding bg-bg">
              <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                  <div className="max-w-2xl">
                    <SectionHeading overtitle="Réseau" title="Les associations membres" subtitle="Découvrez les organisations qui composent la force vive de notre plateforme." />
                  </div>
                  <button onClick={() => navigateTo('associations_list')} className="btn-outline-blue text-xs shrink-0">Voir tout l'annuaire</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {ASSOCIATIONS.slice(0, 6).map(as => (
                    <button 
                      key={as.id} 
                      onClick={() => setSelectedItem(as)}
                      className="group p-8 bg-white border border-border rounded-2xl text-left hover:border-secondary hover:shadow-2xl transition-all duration-500 reveal"
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-14 h-14 bg-bg rounded-xl overflow-hidden border border-border/50 group-hover:scale-110 transition-transform duration-500 bg-white">
                          <img src={as.logo} alt={as.nom} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all">
                          <Plus size={14} />
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary mb-2 block">{as.sigle}</span>
                      <h4 className="text-xl font-display font-bold text-primary mb-6 leading-tight group-hover:text-secondary transition-colors h-14 line-clamp-2">{as.nom}</h4>
                      <div className="flex flex-wrap gap-2">
                        {as.secteurs.slice(0, 2).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-surface-2 rounded text-[9px] font-bold uppercase tracking-wider text-text-light">{s}</span>
                        ))}
                        {as.secteurs.length > 2 && <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-text-muted">+{as.secteurs.length - 2}</span>}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-16 text-center">
                   <button onClick={() => navigateTo('join')} className="btn-outline-blue inline-flex">Rejoindre la plateforme</button>
                </div>
              </div>
            </section>
            
            {/* News Section */}
            <section id="actualites" className="section-padding bg-surface-2">
              <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-secondary mb-4 block">Média & Vie du réseau</span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-primary">Actualités récentes</h2>
                  </div>
                  <button onClick={() => navigateTo('newsletter')} className="btn-outline-blue text-xs">Voir tout l'historique</button>
                </div>
                <div className="grid lg:grid-cols-3 gap-10">
                  {ARTICLES.map(art => (
                    <article key={art.id} onClick={() => navigateTo('article', art)} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer reveal">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img src={art.image} alt={art.titre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-6 left-6">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white bg-${art.badgeColor}`}>{art.badge}</span>
                        </div>
                      </div>
                      <div className="p-10">
                        <div className="flex items-center gap-4 text-[10px] font-mono text-text-light mb-6 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Calendar size={12}/> {art.date}</span>
                          <span className="flex items-center gap-1"><MapPin size={12}/> {art.lieu}</span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-primary mb-6 group-hover:text-secondary transition-colors leading-tight">{art.titre}</h3>
                        <p className="text-text-muted text-sm leading-relaxed mb-8 line-clamp-2">{art.extrait}</p>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 group-hover:gap-4 transition-all">Lire la suite <ArrowRight size={14}/></span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 md:py-20 bg-accent overflow-hidden relative">
               <div className="absolute inset-0 haitian-pattern opacity-10" />
               <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12 text-center lg:text-left">
                 <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-dark mb-4">Restez connectés à l'actualité franco-haïtienne.</h2>
                    <p className="text-primary-dark/70 font-medium text-sm md:text-base">Inscrivez-vous à notre newsletter pour recevoir les dernières nouvelles du réseau.</p>
                 </div>
                 <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                    <input required type="email" name="newsletter_email" placeholder="votre@email.com" className="px-6 py-4 rounded-xl bg-white/80 border-none outline-none focus:bg-white transition-all w-full lg:w-72 text-sm" />
                    <button type="submit" className="bg-primary-dark text-white p-4 rounded-xl hover:bg-primary transition-all flex items-center justify-center shrink-0">
                      <span className="sm:hidden mr-2 font-bold uppercase tracking-widest text-xs">S'inscrire</span>
                      <Send size={20}/>
                    </button>
                 </form>
               </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <CustomCursor />
      {/* Navigation */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'header-scroll' : 'bg-transparent py-6'}`}>
        <nav className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateTo('home')}>
            <img src="/images/logos/regenerated_image_1783892647063.png" alt="Logo PAFHA" className="h-12 md:h-16" />
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {NAVIGATION_LINKS.map(l => (
                <a 
                  key={l.name} 
                  href={l.hash} 
                  onClick={(e) => {
                    if (l.name === 'Associations') {
                      e.preventDefault();
                      navigateTo('associations_list');
                      return;
                    }
                    if (l.name === 'Galerie') {
                      e.preventDefault();
                      navigateTo('galerie');
                      return;
                    }
                    if (currentPage !== 'home') {
                      e.preventDefault();
                      navigateTo('home');
                      setTimeout(() => {
                        const el = document.querySelector(l.hash);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-accent relative group ${isScrolled ? 'text-text' : 'text-white/80'}`}
                >
                  {l.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigateTo('don')} className="btn-primary px-6 py-3 text-[11px]">Faire un don ♥</button>
            </div>
          </div>

          <button className={`lg:hidden p-2 rounded-lg bg-white/10 backdrop-blur-md ${isScrolled ? 'text-primary-dark' : 'text-white'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary-dark overflow-hidden flex flex-col pt-32 lg:hidden"
          >
            {/* Background Pattern and Orbs */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none haitian-pattern scale-150 rotate-12" />
            <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-secondary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <div className="container-custom relative z-10 flex flex-col h-full pb-12">
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="absolute top-0 right-6 md:right-12 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-95"
              >
                <X size={28} />
              </button>

              <nav className="flex flex-col gap-6 mb-auto mt-12">
                {NAVIGATION_LINKS.map((l, i) => (
                  <motion.a 
                    key={l.name} 
                    href={l.hash} 
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                    onClick={() => { 
                      setIsMenuOpen(false); 
                      if (l.name === 'Associations') navigateTo('associations_list');
                      else if (l.name === 'Galerie') navigateTo('galerie');
                      else navigateTo('home'); 
                    }} 
                    className="group flex items-center justify-between py-2 border-b border-white/5"
                  >
                    <span className="text-4xl md:text-5xl font-display font-bold text-white group-hover:text-accent transition-colors">{l.name}</span>
                    <ArrowRight className="text-accent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" size={24} />
                  </motion.a>
                ))}
              </nav>

              <div className="mt-12 space-y-4">
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => navigateTo('join')} 
                  className="btn-accent w-full py-5 text-lg font-bold flex items-center justify-center gap-3 active:scale-95"
                >
                  <Users size={20} /> Rejoindre le réseau
                </motion.button>
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => navigateTo('don')} 
                  className="btn-primary w-full py-5 text-lg font-bold flex items-center justify-center gap-3 active:scale-95"
                >
                  <Heart size={20} fill="currentColor" /> Faire un don ♥
                </motion.button>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 flex flex-col gap-8">
                <div className="flex justify-center gap-8">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                    <motion.a 
                      key={i} 
                      href="#" 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all"
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
                <div className="text-center text-white/30 text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                  PAFHA © 2026 · SOLIDARITÉ FRANCO-HAÏTIENNE
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {renderContent()}
      </main>

      {/* Association Modal */}
      <AnimatePresence>
        {selectedItem && (currentPage === 'home' || currentPage === 'associations_list') && (
          <AssociationModal association={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>

      {/* Contact Section (Always visible on Home, or maybe as a standalone page? Let's keep it in Home) */}
      {currentPage === 'home' && (
        <section id="contact" className="section-padding bg-bg border-t border-border">
          <div className="container-custom grid lg:grid-cols-2 gap-24">
            <div className="reveal">
              <SectionHeading overtitle="Contact" title="Restons à votre écoute." subtitle="Une question, une envie de rejoindre le réseau ou un projet à nous soumettre ? Nos équipes vous répondent sous 48h." />
              <div className="space-y-8 mt-12">
                {[
                  { i: Mail, t: "Email", v: "contactpafha@gmail.com" },
                  { i: Phone, t: "Téléphone", v: "06 62 37 54 02" },
                  { i: MapPin, t: "Siège social", v: "20 rue Edouard Pailleron, 75019 Paris" }
                ].map(item => (
                  <div key={item.t} className="flex gap-6 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all duration-300"><item.i size={20}/></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-text-light font-bold mb-1">{item.t}</p>
                      <p className="text-lg font-bold text-primary-dark group-hover:text-secondary transition-colors">{item.v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-12 rounded-3xl shadow-2xl border border-border reveal">
               <form onSubmit={handleContactSubmit} className="space-y-6">
                 <div className="grid sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Prénom & Nom</label>
                     <input required name="contact_nom" className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm" placeholder="Jean Dupont" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Email</label>
                     <input required type="email" name="contact_email" className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm" placeholder="jean@email.com" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Sujet</label>
                   <input required name="contact_sujet" className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm" placeholder="Comment pouvons-nous vous aider ?" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-light ml-2">Message</label>
                   <textarea required name="contact_message" rows={4} className="w-full bg-surface-2 p-4 rounded-xl outline-none focus:ring-2 ring-accent transition-all text-sm resize-none" placeholder="Votre message ici..."></textarea>
                 </div>
                 <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center gap-3">
                   Envoyer mon message <Send size={18} />
                 </button>
               </form>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-primary-dark text-white pt-24 pb-12 overflow-hidden relative">
        <div className="absolute inset-0 haitian-pattern opacity-[0.03] pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="reveal">
              <img src="/images/logos/regenerated_image_1783892647063.png" alt="Logo PAFHA" className="h-16 mb-8 grayscale invert opacity-80" />
              <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">Plateforme d’Associations Franco-Haïtiennes. Un réseau de solidarité et d'expertise au service du développement durable.</p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((I, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-accent"><I size={18}/></a>
                ))}
              </div>
            </div>
            
            <div className="reveal">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Navigation</h4>
              <ul className="space-y-4 text-sm text-white/50">
                {NAVIGATION_LINKS.map(l => (
                  <li key={l.name}>
                    <a 
                      href={l.hash} 
                      onClick={(e) => {
                        if (l.name === 'Associations') {
                          e.preventDefault();
                          navigateTo('associations_list');
                          return;
                        }
                        if (l.name === 'Galerie') {
                          e.preventDefault();
                          navigateTo('galerie');
                          return;
                        }
                        if (currentPage !== 'home') {
                          e.preventDefault();
                          navigateTo('home');
                          setTimeout(() => {
                            const el = document.querySelector(l.hash);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      }}
                      className="hover:text-white transition-colors"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
                <li><button onClick={() => navigateTo('join')} className="text-accent font-bold hover:brightness-125 transition-all">Rejoindre la plateforme</button></li>
                <li><button onClick={() => navigateTo('don')} className="text-secondary font-bold hover:brightness-125 transition-all">Faire un don ♥</button></li>
              </ul>
            </div>

            <div className="reveal">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Vie du réseau</h4>
              <p className="text-sm font-bold text-white mb-2">Leadership Féminin 2026</p>
              <p className="text-xs text-secondary/80 mb-4 font-mono">25 AVRIL @ PANTIN</p>
              <p className="text-xs text-white/40 leading-relaxed">Rejoignez-nous pour une journée exceptionnelle dédiée à l'entrepreneuriat et au leadership.</p>
            </div>

            <div className="reveal">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Newsletter</h4>
              <p className="text-xs text-white/50 mb-6">Recevez les points forts de l'actualité franco-haïtienne chaque mois.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-4">
                <input required type="email" name="newsletter_email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs w-full focus:ring-1 ring-accent outline-none" placeholder="votre@email.com" />
                <button type="submit" className="p-3 bg-secondary rounded-lg hover:brightness-110 transition-all"><Send size={16}/></button>
              </form>
              <button 
                onClick={() => navigateTo('newsletter')}
                className="text-[10px] uppercase tracking-widest text-accent/60 hover:text-accent flex items-center gap-2"
              >
                Consulter les archives <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-white/20">
            <p>© 2026 PAFHA · Plateforme d'Associations Franco-Haïtiennes · Tous droits réservés</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <p>Réalisation : <span className="text-accent opacity-60">Johnny Frantz</span></p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll Progress Bar */}
      <div id="scroll-progress" style={{ width: `${Math.min(100, Math.max(0, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100))}%` }} />
    </div>
  );
}
