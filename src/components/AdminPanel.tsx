import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  ArrowLeft,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Tag,
  FileText,
  Link as LinkIcon,
  Briefcase,
  Layers,
  Image as ImageIcon,
  Save,
  Loader2,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  isSupabaseConfigured,
  getActualites,
  saveActualite,
  deleteActualite,
  getEvenements,
  saveEvenement,
  deleteEvenement,
  getGalerie,
  saveGalerie,
  deleteGalerie,
  getPartenaires,
  savePartenaire,
  deletePartenaire,
  getEquipe,
  saveEquipe,
  deleteEquipe,
  getDocuments,
  saveDocument,
  deleteDocument,
  uploadFile,
  SupabaseActualite,
  SupabaseEvenement,
  SupabaseGalerie,
  SupabasePartenaire,
  SupabaseEquipe,
  SupabaseDocument
} from '../lib/supabase';

interface AdminPanelProps {
  onBack: () => void;
}

type AdminTab = 'actualites' | 'evenements' | 'galerie' | 'partenaires' | 'equipe' | 'documents';

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('actualites');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null); // holds field key being uploaded
  const [uploadPercent, setUploadPercent] = useState(0);

  // Lists of data
  const [actualites, setActualites] = useState<SupabaseActualite[]>([]);
  const [evenements, setEvenements] = useState<SupabaseEvenement[]>([]);
  const [galerie, setGalerie] = useState<SupabaseGalerie[]>([]);
  const [partenaires, setPartenaires] = useState<SupabasePartenaire[]>([]);
  const [equipe, setEquipe] = useState<SupabaseEquipe[]>([]);
  const [documents, setDocuments] = useState<SupabaseDocument[]>([]);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Fetch all collections on mount & tab change
  const fetchData = async () => {
    setLoading(true);
    try {
      const [actData, evtData, galData, partData, eqData, docData] = await Promise.all([
        getActualites(),
        getEvenements(),
        getGalerie(),
        getPartenaires(),
        getEquipe(),
        getDocuments(),
      ]);
      setActualites(actData);
      setEvenements(evtData);
      setGalerie(galData);
      setPartenaires(partData);
      setEquipe(eqData);
      setDocuments(docData);
    } catch (err) {
      console.error("Error fetching admin panel data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Form handling
  const handleOpenAdd = () => {
    setEditingItem({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, bucket: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldName);
    setUploadPercent(10);
    try {
      const url = await uploadFile(file, bucket, (p) => {
        setUploadPercent(p);
      });
      setEditingItem((prev: any) => ({
        ...prev,
        [fieldName]: url
      }));
    } catch (err) {
      console.error("Upload failed", err);
      alert("Erreur lors de l'envoi du fichier.");
    } finally {
      setUploading(null);
      setUploadPercent(0);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'actualites') {
        await saveActualite({
          titre: editingItem.titre || 'Sans titre',
          resume: editingItem.resume || '',
          contenu: editingItem.contenu || '',
          image_url: editingItem.image_url || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600',
          categorie: editingItem.categorie || 'Actualité',
          auteur: editingItem.auteur || 'PAFHA',
          date_publication: editingItem.date_publication || new Date().toISOString().split('T')[0],
          id: editingItem.id
        });
      } else if (activeTab === 'evenements') {
        await saveEvenement({
          titre: editingItem.titre || 'Sans titre',
          description: editingItem.description || '',
          image_url: editingItem.image_url || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600',
          lieu: editingItem.lieu || 'En ligne',
          date_evenement: editingItem.date_evenement || 'Prochainement',
          id: editingItem.id
        });
      } else if (activeTab === 'galerie') {
        await saveGalerie({
          titre: editingItem.titre || 'Photo',
          description: editingItem.description || '',
          image_url: editingItem.image_url || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600',
          album: editingItem.album || 'autres',
          id: editingItem.id
        });
      } else if (activeTab === 'partenaires') {
        await savePartenaire({
          nom: editingItem.nom || 'Nouveau partenaire',
          logo_url: editingItem.logo_url || 'https://images.unsplash.com/photo-1599305096909-e8b5bc18962f?auto=format&fit=crop&q=80&w=200',
          site_web: editingItem.site_web || '#',
          description: editingItem.description || '',
          id: editingItem.id
        });
      } else if (activeTab === 'equipe') {
        await saveEquipe({
          nom: editingItem.nom || 'Membre',
          fonction: editingItem.fonction || 'Bénévole',
          photo_url: editingItem.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
          bio: editingItem.bio || '',
          id: editingItem.id
        });
      } else if (activeTab === 'documents') {
        await saveDocument({
          titre: editingItem.titre || 'Document',
          fichier_url: editingItem.fichier_url || '',
          categorie: editingItem.categorie || 'Autre',
          id: editingItem.id
        });
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    setLoading(true);
    try {
      if (activeTab === 'actualites') await deleteActualite(id);
      else if (activeTab === 'evenements') await deleteEvenement(id);
      else if (activeTab === 'galerie') await deleteGalerie(id);
      else if (activeTab === 'partenaires') await deletePartenaire(id);
      else if (activeTab === 'equipe') await deleteEquipe(id);
      else if (activeTab === 'documents') await deleteDocument(id);
      await fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'actualites':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-display text-primary uppercase tracking-wider">Gestion des Actualités</h3>
              <button onClick={handleOpenAdd} className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2">
                <Plus size={16} /> Ajouter une actualité
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actualites.map(act => (
                <div key={act.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all">
                  <div>
                    <img src={act.image_url} alt={act.titre} className="w-full h-36 object-cover rounded-xl mb-4" />
                    <span className="text-[10px] font-mono font-bold bg-secondary/10 text-secondary px-2 py-1 rounded-full uppercase tracking-wider">{act.categorie}</span>
                    <h4 className="font-display font-bold text-primary mt-2 text-base line-clamp-2">{act.titre}</h4>
                    <p className="text-xs text-text-muted mt-2 line-clamp-3">{act.resume}</p>
                  </div>
                  <div className="flex gap-2 mt-6 pt-4 border-t border-border/50 justify-end">
                    <button onClick={() => handleOpenEdit(act)} className="p-2 text-primary hover:bg-surface-2 rounded-lg transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(act.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'evenements':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-display text-primary uppercase tracking-wider">Gestion des Événements</h3>
              <button onClick={handleOpenAdd} className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2">
                <Plus size={16} /> Ajouter un événement
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evenements.map(evt => (
                <div key={evt.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all">
                  <div>
                    <img src={evt.image_url} alt={evt.titre} className="w-full h-36 object-cover rounded-xl mb-4" />
                    <span className="text-[10px] font-mono font-bold bg-accent/20 text-primary px-2 py-1 rounded-full uppercase tracking-wider">{evt.date_evenement}</span>
                    <h4 className="font-display font-bold text-primary mt-2 text-base line-clamp-2">{evt.titre}</h4>
                    <p className="text-xs text-text-muted mt-2 line-clamp-3">{evt.description}</p>
                  </div>
                  <div className="flex gap-2 mt-6 pt-4 border-t border-border/50 justify-end">
                    <button onClick={() => handleOpenEdit(evt)} className="p-2 text-primary hover:bg-surface-2 rounded-lg transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(evt.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'galerie':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-display text-primary uppercase tracking-wider">Gestion de la Galerie</h3>
              <button onClick={handleOpenAdd} className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2">
                <Plus size={16} /> Ajouter une photo
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galerie.map(gal => (
                <div key={gal.id} className="bg-white border border-border rounded-2xl p-3 flex flex-col justify-between hover:shadow-lg transition-all">
                  <div>
                    <img src={gal.image_url} alt={gal.titre} className="w-full h-28 object-cover rounded-lg mb-3" />
                    <span className="text-[9px] font-mono bg-surface-2 text-text-light px-2 py-0.5 rounded-full uppercase tracking-wider">{gal.album}</span>
                    <h4 className="font-display font-bold text-primary mt-1 text-xs line-clamp-1">{gal.titre}</h4>
                  </div>
                  <div className="flex gap-2 mt-4 pt-2 border-t border-border/50 justify-end">
                    <button onClick={() => handleOpenEdit(gal)} className="p-1.5 text-primary hover:bg-surface-2 rounded-lg transition-colors"><Edit size={14}/></button>
                    <button onClick={() => handleDelete(gal.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'partenaires':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-display text-primary uppercase tracking-wider">Gestion des Partenaires</h3>
              <button onClick={handleOpenAdd} className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2">
                <Plus size={16} /> Ajouter un partenaire
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partenaires.map(part => (
                <div key={part.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="flex gap-4 items-center">
                    <img src={part.logo_url} alt={part.nom} className="w-16 h-16 object-contain rounded-xl border border-border bg-white p-1 shrink-0" />
                    <div>
                      <h4 className="font-display font-bold text-primary text-base">{part.nom}</h4>
                      <p className="text-[10px] text-text-light truncate font-mono">{part.site_web}</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-3 line-clamp-2">{part.description}</p>
                  <div className="flex gap-2 mt-6 pt-4 border-t border-border/50 justify-end">
                    <button onClick={() => handleOpenEdit(part)} className="p-2 text-primary hover:bg-surface-2 rounded-lg transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(part.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'equipe':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-display text-primary uppercase tracking-wider">Gestion de l'Équipe</h3>
              <button onClick={handleOpenAdd} className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2">
                <Plus size={16} /> Ajouter un membre
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipe.map(mem => (
                <div key={mem.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="flex gap-4 items-center">
                    <img src={mem.photo_url} alt={mem.nom} className="w-14 h-14 object-cover rounded-full border-2 border-border bg-white shrink-0" />
                    <div>
                      <h4 className="font-display font-bold text-primary text-base">{mem.nom}</h4>
                      <p className="text-xs text-secondary font-semibold font-mono">{mem.fonction}</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-3 line-clamp-3">{mem.bio}</p>
                  <div className="flex gap-2 mt-6 pt-4 border-t border-border/50 justify-end">
                    <button onClick={() => handleOpenEdit(mem)} className="p-2 text-primary hover:bg-surface-2 rounded-lg transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(mem.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-display text-primary uppercase tracking-wider">Gestion des Documents / PDF</h3>
              <button onClick={handleOpenAdd} className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2">
                <Plus size={16} /> Ajouter un document
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map(doc => (
                <div key={doc.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0"><FileDown size={24}/></div>
                    <div className="overflow-hidden">
                      <h4 className="font-display font-bold text-primary text-sm truncate">{doc.titre}</h4>
                      <p className="text-[10px] text-secondary font-bold font-mono uppercase mt-1">{doc.categorie}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6 pt-4 border-t border-border/50 justify-between items-center">
                    <a href={doc.fichier_url} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary font-bold flex items-center gap-1 hover:underline"><FileText size={14}/> Ouvrir</a>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(doc)} className="p-2 text-primary hover:bg-surface-2 rounded-lg transition-colors"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(doc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  const renderModalForm = () => {
    if (!editingItem) return null;
    switch (activeTab) {
      case 'actualites':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Titre</label>
                <input required value={editingItem.titre || ''} onChange={e => setEditingItem((p: any) => ({ ...p, titre: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-light">Catégorie</label>
                  <input required value={editingItem.categorie || ''} onChange={e => setEditingItem((p: any) => ({ ...p, categorie: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" placeholder="ex: Événement, Formation" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-light">Auteur</label>
                  <input required value={editingItem.auteur || ''} onChange={e => setEditingItem((p: any) => ({ ...p, auteur: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Résumé de l'article</label>
                <textarea required value={editingItem.resume || ''} onChange={e => setEditingItem((p: any) => ({ ...p, resume: e.target.value }))} rows={2} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light font-sans flex items-center gap-1">Contenu HTML <span className="text-[10px] text-text-light italic">(Prend en charge le formatage ou texte brut)</span></label>
                <textarea required value={editingItem.contenu || ''} onChange={e => setEditingItem((p: any) => ({ ...p, contenu: e.target.value }))} rows={6} className="w-full font-mono bg-surface-2 p-3 rounded-lg border border-border mt-1 text-xs outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light flex items-center justify-between">Image principale <span>(Envoi vers bucket 'actualites')</span></label>
                <div className="flex gap-4 mt-1 items-center">
                  <input type="text" value={editingItem.image_url || ''} onChange={e => setEditingItem((p: any) => ({ ...p, image_url: e.target.value }))} className="flex-1 bg-surface-2 p-3 rounded-lg border border-border text-sm outline-none" placeholder="https://..." />
                  <label className="p-3 bg-secondary text-white rounded-lg cursor-pointer flex items-center gap-2 font-mono uppercase text-[10px] font-bold tracking-wider hover:brightness-110 shrink-0">
                    {uploading === 'image_url' ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14}/>} Upload
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image_url', 'actualites')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </>
        );
      case 'evenements':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Titre de l'événement</label>
                <input required value={editingItem.titre || ''} onChange={e => setEditingItem((p: any) => ({ ...p, titre: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-light">Date / Horaire</label>
                  <input required value={editingItem.date_evenement || ''} onChange={e => setEditingItem((p: any) => ({ ...p, date_evenement: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" placeholder="ex: 25 Avril 2026" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-text-light">Lieu</label>
                  <input required value={editingItem.lieu || ''} onChange={e => setEditingItem((p: any) => ({ ...p, lieu: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" placeholder="ex: Saint-Denis" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Description de l'événement</label>
                <textarea required value={editingItem.description || ''} onChange={e => setEditingItem((p: any) => ({ ...p, description: e.target.value }))} rows={4} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light flex items-center justify-between">Image de couverture <span>(Envoi vers bucket 'evenements')</span></label>
                <div className="flex gap-4 mt-1 items-center">
                  <input type="text" value={editingItem.image_url || ''} onChange={e => setEditingItem((p: any) => ({ ...p, image_url: e.target.value }))} className="flex-1 bg-surface-2 p-3 rounded-lg border border-border text-sm outline-none" placeholder="https://..." />
                  <label className="p-3 bg-secondary text-white rounded-lg cursor-pointer flex items-center gap-2 font-mono uppercase text-[10px] font-bold tracking-wider hover:brightness-110 shrink-0">
                    {uploading === 'image_url' ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14}/>} Upload
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image_url', 'hero')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </>
        );
      case 'galerie':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Titre de la photo / Alt</label>
                <input required value={editingItem.titre || ''} onChange={e => setEditingItem((p: any) => ({ ...p, titre: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Album / Thème</label>
                <input required value={editingItem.album || ''} onChange={e => setEditingItem((p: any) => ({ ...p, album: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" placeholder="ex: 17-jpo-2026, leadership-feminin-2026, etc." />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Description courte</label>
                <input value={editingItem.description || ''} onChange={e => setEditingItem((p: any) => ({ ...p, description: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light flex items-center justify-between">Fichier Photo <span>(Envoi vers bucket 'galerie')</span></label>
                <div className="flex gap-4 mt-1 items-center">
                  <input type="text" value={editingItem.image_url || ''} onChange={e => setEditingItem((p: any) => ({ ...p, image_url: e.target.value }))} className="flex-1 bg-surface-2 p-3 rounded-lg border border-border text-sm outline-none" placeholder="https://..." />
                  <label className="p-3 bg-secondary text-white rounded-lg cursor-pointer flex items-center gap-2 font-mono uppercase text-[10px] font-bold tracking-wider hover:brightness-110 shrink-0">
                    {uploading === 'image_url' ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14}/>} Upload
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image_url', 'galerie')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </>
        );
      case 'partenaires':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Nom du partenaire</label>
                <input required value={editingItem.nom || ''} onChange={e => setEditingItem((p: any) => ({ ...p, nom: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Lien du site Web</label>
                <input value={editingItem.site_web || ''} onChange={e => setEditingItem((p: any) => ({ ...p, site_web: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Description</label>
                <textarea value={editingItem.description || ''} onChange={e => setEditingItem((p: any) => ({ ...p, description: e.target.value }))} rows={3} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light flex items-center justify-between">Logo <span>(Envoi vers bucket 'logos' ou 'partenaires')</span></label>
                <div className="flex gap-4 mt-1 items-center">
                  <input type="text" value={editingItem.logo_url || ''} onChange={e => setEditingItem((p: any) => ({ ...p, logo_url: e.target.value }))} className="flex-1 bg-surface-2 p-3 rounded-lg border border-border text-sm outline-none" placeholder="https://..." />
                  <label className="p-3 bg-secondary text-white rounded-lg cursor-pointer flex items-center gap-2 font-mono uppercase text-[10px] font-bold tracking-wider hover:brightness-110 shrink-0">
                    {uploading === 'logo_url' ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14}/>} Upload
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'logo_url', 'logos')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </>
        );
      case 'equipe':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Nom Complet</label>
                <input required value={editingItem.nom || ''} onChange={e => setEditingItem((p: any) => ({ ...p, nom: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Fonction / Rôle</label>
                <input required value={editingItem.fonction || ''} onChange={e => setEditingItem((p: any) => ({ ...p, fonction: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" placeholder="ex: Présidente, Trésorier..." />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Bio / Parcours</label>
                <textarea value={editingItem.bio || ''} onChange={e => setEditingItem((p: any) => ({ ...p, bio: e.target.value }))} rows={4} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light flex items-center justify-between">Photo de profil <span>(Envoi vers bucket 'equipe')</span></label>
                <div className="flex gap-4 mt-1 items-center">
                  <input type="text" value={editingItem.photo_url || ''} onChange={e => setEditingItem((p: any) => ({ ...p, photo_url: e.target.value }))} className="flex-1 bg-surface-2 p-3 rounded-lg border border-border text-sm outline-none" placeholder="https://..." />
                  <label className="p-3 bg-secondary text-white rounded-lg cursor-pointer flex items-center gap-2 font-mono uppercase text-[10px] font-bold tracking-wider hover:brightness-110 shrink-0">
                    {uploading === 'photo_url' ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14}/>} Upload
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'photo_url', 'equipe')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </>
        );
      case 'documents':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Titre du document</label>
                <input required value={editingItem.titre || ''} onChange={e => setEditingItem((p: any) => ({ ...p, titre: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light">Catégorie</label>
                <input required value={editingItem.categorie || ''} onChange={e => setEditingItem((p: any) => ({ ...p, categorie: e.target.value }))} className="w-full bg-surface-2 p-3 rounded-lg border border-border mt-1 text-sm outline-none" placeholder="ex: Rapport, Newsletter, Statuts..." />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light flex items-center justify-between">Fichier (PDF ou image) <span>(Envoi vers bucket 'documents')</span></label>
                <div className="flex gap-4 mt-1 items-center">
                  <input required type="text" value={editingItem.fichier_url || ''} onChange={e => setEditingItem((p: any) => ({ ...p, fichier_url: e.target.value }))} className="flex-1 bg-surface-2 p-3 rounded-lg border border-border text-sm outline-none" placeholder="https://..." />
                  <label className="p-3 bg-secondary text-white rounded-lg cursor-pointer flex items-center gap-2 font-mono uppercase text-[10px] font-bold tracking-wider hover:brightness-110 shrink-0">
                    {uploading === 'fichier_url' ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14}/>} Upload
                    <input type="file" accept="application/pdf,image/*" onChange={e => handleFileChange(e, 'fichier_url', 'documents')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen">
      <div className="container-custom">
        {/* Top bar with back button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:text-secondary transition-colors">
            <ArrowLeft size={16} /> Retour au portail
          </button>
          
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-border shadow-sm">
            {isSupabaseConfigured ? (
              <div className="flex items-center gap-2 text-green-600 text-xs font-mono font-bold uppercase tracking-wider">
                <CheckCircle size={16} /> Cloud Synced
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-600 text-xs font-mono font-bold uppercase tracking-wider">
                <AlertTriangle size={16} /> Offline Cache
              </div>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">Espace Administration</h1>
          <p className="text-text-muted text-sm md:text-base">Gérez l'ensemble des données dynamiques et médias de votre plateforme d'associations franco-haïtiennes.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-10">
          {[
            { id: 'actualites', name: 'Actualités', icon: FileText },
            { id: 'evenements', name: 'Événements', icon: CalendarIcon },
            { id: 'galerie', name: 'Galerie', icon: ImageIcon },
            { id: 'partenaires', name: 'Partenaires', icon: Layers },
            { id: 'equipe', name: 'L\'Équipe', icon: User },
            { id: 'documents', name: 'Documents / PDF', icon: FileDown },
          ].map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as AdminTab)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
                  active 
                    ? 'bg-primary text-white border-primary shadow-lg' 
                    : 'bg-white text-text border-border hover:border-secondary'
                }`}
              >
                <Icon size={14} /> {t.name}
              </button>
            );
          })}
        </div>

        {/* Dynamic List Render */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
            <Loader2 className="animate-spin text-secondary mb-4" size={40} />
            <p className="text-sm font-bold text-text-muted uppercase tracking-widest font-mono">Chargement des données...</p>
          </div>
        )}

        {!loading && renderTabContent()}
      </div>

      {/* Elegant Form Modal */}
      <AnimatePresence>
        {isModalOpen && editingItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-primary-dark/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-xl w-full rounded-3xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-border flex justify-between items-center bg-surface-2">
                <h4 className="font-display font-bold text-primary text-lg">
                  {editingItem.id ? 'Modifier l\'élément' : 'Ajouter un nouvel élément'}
                </h4>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              {uploadPercent > 0 && (
                <div className="bg-secondary/10 px-6 py-2 border-b border-border flex items-center justify-between text-xs font-mono text-secondary">
                  <span>Téléchargement du média : {uploadPercent}%</span>
                  <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden shrink-0">
                    <div className="bg-secondary h-full transition-all duration-300" style={{ width: `${uploadPercent}%` }} />
                  </div>
                </div>
              )}

              <form onSubmit={handleSave} className="p-6 md:p-8 overflow-y-auto flex-1">
                {renderModalForm()}

                <div className="flex gap-4 mt-8 pt-6 border-t border-border/50 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-border rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-surface-2 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Save size={14} /> Enregistrer
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
