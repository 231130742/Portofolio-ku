import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { usePortfolio } from '../context/PortfolioContext';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, FileText, Plus, Trash2, Edit2, X, ExternalLink, LogOut, UploadCloud, Calendar, ArrowRight, MessageSquare, CheckCircle, EyeOff, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Admin() {
  const { projects, experiences, docs, messages, refreshData } = usePortfolio();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metaImage, setMetaImage] = useState(null);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin/login');
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingId(item ? item.id : null);
    setSelectedFile(null);

    if (item) {
      setFormData(item);
    } else {
      if (type === 'projects') setFormData({ title: '', technologies: '', github_url: '', live_url: '', description: '', image: null });
      if (type === 'experiences') setFormData({ role: item?.role || '', organization: item?.organization || '', start_year: item?.start_year || '', end_year: item?.end_year || '', period: item?.period || '', description: item?.description || '' });
      if (type === 'docs') setFormData({ title: '', type: 'image', url: '', description: '', doc_date: item?.doc_date ? item.doc_date.split('T')[0] : '', external_link: item?.external_link || '' });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({});
    setSelectedFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  React.useEffect(() => {
    if (modalType === 'docs' && formData.external_link && !selectedFile) {
      const delay = setTimeout(async () => {
        setIsFetchingMeta(true);
        try {
          const res = await fetch('/api/docs/meta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: formData.external_link })
          });
          const data = await res.json();
          setMetaImage(data.image);
        } catch (error) {
          setMetaImage(null);
        } finally {
          setIsFetchingMeta(false);
        }
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setMetaImage(null);
    }
  }, [formData.external_link, modalType, selectedFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('admin_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    let url = `/api/${modalType}`;
    if (editingId) url += `/${editingId}`;

    const method = editingId ? 'PUT' : 'POST';

    try {
      let bodyData;
      let finalHeaders = { ...headers };

      // Use FormData if there is a file upload
      if (modalType === 'projects') {
        bodyData = new FormData();
        bodyData.append('title', formData.title);
        bodyData.append('description', formData.description);
        bodyData.append('technologies', Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies);
        bodyData.append('github_url', formData.github_url || '');
        bodyData.append('live_url', formData.live_url || '');
        if (selectedFile) {
          try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true, fileType: 'image/webp' };
            const compressedFile = await imageCompression(selectedFile, options);
            bodyData.append('image', compressedFile);
          } catch (e) {
            bodyData.append('image', selectedFile);
          }
        }
      }
      else if (modalType === 'docs') {
        const calculatedType = 'image'; // Selalu jadikan gambar sebagai output utama

        let finalUrl = formData.url; // Pertahankan URL gambar lama jika edit
        let finalExternalLink = formData.external_link;

        if (selectedFile) {
          finalUrl = ''; // Akan diisi multer
        } else if (metaImage) {
          finalUrl = metaImage;
        }

        bodyData = new FormData();
        bodyData.append('title', formData.title);
        bodyData.append('type', calculatedType);
        bodyData.append('description', formData.description);
        bodyData.append('url', finalUrl || '');
        bodyData.append('doc_date', formData.doc_date || '');
        bodyData.append('external_link', finalExternalLink || '');
        if (selectedFile) {
          try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true, fileType: 'image/webp' };
            const compressedFile = await imageCompression(selectedFile, options);
            bodyData.append('file', compressedFile);
          } catch (e) {
            bodyData.append('file', selectedFile);
          }
        }
      }
      else {
        // Experiences uses JSON
        bodyData = JSON.stringify(formData);
        finalHeaders['Content-Type'] = 'application/json';
      }

      const res = await fetch(url, { method, headers: finalHeaders, body: bodyData });
      if (res.ok) {
        refreshData();
        closeModal();
      } else {
        alert('Gagal menyimpan data');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveMessage = async (id) => {
    try {
      const res = await fetch(`/api/messages/${id}/approve`, { method: 'PUT' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuspendMessage = async (id) => {
    try {
      const res = await fetch(`/api/messages/${id}/suspend`, { method: 'PUT' });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- UI COMPONENTS ---------------- //

  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex items-center gap-6 shadow-xl hover:bg-zinc-900 transition-colors">
        <div className="p-4 bg-brand-blue/20 text-brand-blue rounded-xl"><Briefcase size={32} /></div>
        <div>
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Total Proyek</h3>
          <p className="text-4xl font-black text-white">{projects.length}</p>
        </div>
      </div>
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex items-center gap-6 shadow-xl hover:bg-zinc-900 transition-colors">
        <div className="p-4 bg-green-500/20 text-green-500 rounded-xl"><Users size={32} /></div>
        <div>
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Total Pengalaman</h3>
          <p className="text-4xl font-black text-white">{experiences.length}</p>
        </div>
      </div>
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex items-center gap-6 shadow-xl hover:bg-zinc-900 transition-colors">
        <div className="p-4 bg-purple-500/20 text-purple-500 rounded-xl"><FileText size={32} /></div>
        <div>
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Dokumentasi</h3>
          <p className="text-4xl font-black text-white">{docs.length}</p>
        </div>
      </div>
    </motion.div>
  );

  const renderProjects = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Manajemen Proyek</h2>
        <button onClick={() => openModal('projects')} className="flex items-center gap-2 bg-brand-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] font-bold w-full sm:w-auto justify-center">
          <Plus size={18} /> Tambah Proyek
        </button>
      </div>
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-x-auto shadow-2xl">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/80 border-b border-white/5 text-zinc-400 text-sm uppercase tracking-wider">
              <th className="p-5 font-semibold">Judul</th>
              <th className="p-5 font-semibold">Teknologi</th>
              <th className="p-5 font-semibold">Links</th>
              <th className="p-5 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(proj => (
              <tr key={proj.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-5 text-white font-medium flex items-center gap-4">
                  {proj.image && <img src={proj.image} className="w-10 h-10 rounded-md object-cover" alt="" />}
                  {proj.title}
                </td>
                <td className="p-5 text-zinc-400 text-sm">{Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</td>
                <td className="p-5">
                  <div className="flex gap-2">
                    {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-brand-blue"><ExternalLink size={16} /></a>}
                    {proj.live_url && <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-green-400"><ExternalLink size={16} /></a>}
                  </div>
                </td>
                <td className="p-5 text-right flex justify-end gap-3">
                  <button onClick={() => openModal('projects', proj)} className="p-2.5 text-zinc-400 hover:text-white bg-white/5 rounded-lg transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete('projects', proj.id)} className="p-2.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-zinc-500">Belum ada proyek.</td></tr>}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderExperiences = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Manajemen Pengalaman</h2>
        <button onClick={() => openModal('experiences')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(22,163,74,0.5)] font-bold w-full sm:w-auto justify-center">
          <Plus size={18} /> Tambah Pengalaman
        </button>
      </div>
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-x-auto shadow-2xl">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/80 border-b border-white/5 text-zinc-400 text-sm uppercase tracking-wider">
              <th className="p-5 font-semibold">Peran / Organisasi</th>
              <th className="p-5 font-semibold">Periode</th>
              <th className="p-5 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map(exp => (
              <tr key={exp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-5">
                  <div className="text-white font-bold text-lg">{exp.role}</div>
                  <div className="text-zinc-400 text-sm">{exp.organization}</div>
                </td>
                <td className="p-5"><span className="text-brand-blue text-sm font-mono bg-brand-blue/5 rounded-md inline-block px-2 py-1">{exp.start_year && exp.end_year ? `${exp.start_year} - ${exp.end_year}` : exp.period}</span></td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => openModal('experiences', exp)} className="p-2.5 text-zinc-400 hover:text-white bg-white/5 rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete('experiences', exp.id)} className="p-2.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {experiences.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-zinc-500">Belum ada pengalaman.</td></tr>}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderDocs = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Manajemen Dokumentasi</h2>
        <button onClick={() => openModal('docs')} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.5)] font-bold w-full sm:w-auto justify-center">
          <Plus size={18} /> Tambah Dokumentasi
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map(doc => (
          <div key={doc.id} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:-translate-y-1 transition-all">
            {doc.type === 'youtube' ? (
              <div className="aspect-video bg-black"><iframe width="100%" height="100%" src={doc.url} title={doc.title} frameBorder="0" allowFullScreen></iframe></div>
            ) : (
              <div className="w-full aspect-video relative bg-black shrink-0 overflow-hidden">
                <img src={doc.url} alt={doc.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            <div className="p-5 flex-grow">
              <span className="text-[10px] uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-md mb-2 inline-block">{doc.type}</span>
              <h3 className="font-bold text-lg text-white mb-2 leading-tight">{doc.title}</h3>
              <p className="text-sm text-zinc-400 line-clamp-2">{doc.description}</p>
            </div>
            <div className="p-4 border-t border-white/5 flex gap-3 bg-black/20">
              <button onClick={() => openModal('docs', doc)} className="flex-1 py-2.5 flex justify-center items-center gap-2 text-sm font-bold text-zinc-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"><Edit2 size={14} /> Edit</button>
              <button onClick={() => handleDelete('docs', doc.id)} className="flex-1 py-2.5 flex justify-center items-center gap-2 text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={14} /> Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderMessages = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Pesan & Komentar</h2>
      </div>
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-x-auto shadow-2xl">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/80 border-b border-white/5 text-zinc-400 text-sm uppercase tracking-wider">
              <th className="p-5 font-semibold">Pengirim</th>
              <th className="p-5 font-semibold">Pesan</th>
              <th className="p-5 font-semibold">Status</th>
              <th className="p-5 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(messages || []).map(msg => (
              <tr key={msg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-5">
                  <div className="text-white font-bold">{msg.name}</div>
                  <div className="text-zinc-400 text-sm">{msg.email}</div>
                  <div className="text-zinc-500 text-xs mt-1">{new Date(msg.created_at).toLocaleDateString('id-ID')}</div>
                </td>
                <td className="p-5 text-zinc-300 text-sm max-w-xs truncate" title={msg.message}>{msg.message}</td>
                <td className="p-5">
                  {msg.status === 'approved' ? (
                    <span className="text-green-500 text-xs font-bold uppercase tracking-wider bg-green-500/10 px-2 py-1 rounded-md">Disetujui</span>
                  ) : (
                    <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider bg-yellow-500/10 px-2 py-1 rounded-md">Pending</span>
                  )}
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-3">
                    {msg.status === 'pending' ? (
                      <button onClick={() => handleApproveMessage(msg.id)} className="p-2.5 text-green-400 hover:text-white bg-green-500/10 hover:bg-green-500 rounded-lg transition-colors" title="Setujui untuk ditampilkan"><CheckCircle size={16} /></button>
                    ) : (
                      <button onClick={() => handleSuspendMessage(msg.id)} className="p-2.5 text-orange-400 hover:text-white bg-orange-500/10 hover:bg-orange-500 rounded-lg transition-colors" title="Tangguhkan (Sembunyikan dari Publik)"><EyeOff size={16} /></button>
                    )}
                    <button onClick={() => handleDelete('messages', msg.id)} className="p-2.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors" title="Hapus Permanen"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!messages || messages.length === 0) && <tr><td colSpan="4" className="p-8 text-center text-zinc-500">Belum ada pesan.</td></tr>}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderModalContent = () => {
    if (modalType === 'projects') {
      const previewImage = selectedFile ? URL.createObjectURL(selectedFile) : formData.image;
      const techArray = typeof formData.technologies === 'string' ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) : (formData.technologies || []);

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-5">
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Judul Proyek <span className="text-red-500">*</span></label><input required name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-brand-blue focus:outline-none transition-colors" /></div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Gambar Proyek</label>
              <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-brand-blue/50 transition-colors bg-black/30">
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud className="mx-auto text-zinc-500 mb-2" size={32} />
                <p className="text-sm text-zinc-400">{selectedFile ? selectedFile.name : (formData.image ? 'Gambar sudah ada, klik untuk mengganti' : 'Klik atau drag gambar ke sini')}</p>
              </div>
            </div>

            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Teknologi <span className="text-red-500">*</span></label><input required name="technologies" value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-brand-blue focus:outline-none transition-colors" placeholder="React, Node.js, Tailwind" /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">GitHub URL <span className="text-xs text-zinc-600">(Opsional)</span></label><input name="github_url" value={formData.github_url || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-brand-blue focus:outline-none transition-colors" /></div>
              <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Live URL <span className="text-xs text-zinc-600">(Opsional)</span></label><input name="live_url" value={formData.live_url || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-brand-blue focus:outline-none transition-colors" /></div>
            </div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Deskripsi Singkat <span className="text-red-500">*</span></label><textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows="3" className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-brand-blue focus:outline-none resize-none transition-colors"></textarea></div>
          </div>

          <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 sticky top-0">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Live Preview (Card Proyek)</h3>

            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col pointer-events-none relative aspect-[4/3]">
              {/* Image Background */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="object-cover w-full h-full opacity-60" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                    <span className="text-sm font-medium">Preview Gambar</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-20 flex flex-col h-full justify-end p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {techArray.length > 0 ? techArray.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-widest font-bold text-white bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                      {tech}
                    </span>
                  )) : (
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                      Teknologi
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white mb-2 text-xl tracking-tight">
                  {formData.title || 'Judul Proyek'}
                </h3>

                <p className="text-zinc-400 font-light text-xs line-clamp-2">
                  {formData.description || 'Deskripsi proyek akan tampil di sini...'}
                </p>
              </div>
            </div>
            <p className="text-xs text-brand-blue mt-4 bg-brand-blue/10 p-3 rounded-lg leading-relaxed text-center font-medium">
              * Di website utama, rasio gambar otomatis diatur (tergantung besar grid) dengan <b>object-cover</b> agar tidak gepeng atau pecah.
            </p>
          </div>
        </div>
      );
    }
    if (modalType === 'experiences') {
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Peran / Jabatan <span className="text-red-500">*</span></label><input required name="role" value={formData.role || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-green-500 focus:outline-none transition-colors" /></div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Nama Organisasi <span className="text-red-500">*</span></label><input required name="organization" value={formData.organization || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-green-500 focus:outline-none transition-colors" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Mulai Tahun <span className="text-red-500">*</span></label><input required name="start_year" placeholder="Contoh: 2020" value={formData.start_year || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-green-500 focus:outline-none transition-colors" /></div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Sampai Tahun <span className="text-red-500">*</span></label><input required name="end_year" placeholder="Contoh: Sekarang atau 2024" value={formData.end_year || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-green-500 focus:outline-none transition-colors" /></div>
          </div>
          <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Deskripsi Tugas <span className="text-red-500">*</span></label><textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows="4" className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-green-500 focus:outline-none resize-none transition-colors"></textarea></div>
        </div>
      );
    }
    if (modalType === 'docs') {
      const previewImage = selectedFile ? URL.createObjectURL(selectedFile) : (metaImage || formData.url);
      const hasAnyLink = formData.external_link;

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-5">
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Judul Dokumentasi <span className="text-red-500">*</span></label><input required name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-purple-500 focus:outline-none transition-colors" /></div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Tanggal <span className="text-xs text-zinc-500">(Kosongkan untuk hari ini)</span></label>
              <input type="date" name="doc_date" value={formData.doc_date ? formData.doc_date.split('T')[0] : ''} onChange={handleInputChange} style={{ colorScheme: 'dark' }} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-purple-500 focus:outline-none transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Media Utama (Upload File) <span className="text-xs text-zinc-500">(Prioritas JPG/PNG)</span></label>
              <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors bg-black/30">
                <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud className="mx-auto text-zinc-500 mb-2" size={32} />
                <p className="text-sm text-zinc-400">{selectedFile ? selectedFile.name : (formData.url && formData.url.startsWith('/uploads') ? 'File sudah ada, klik untuk mengganti' : 'Klik atau drag file gambar ke sini')}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Link Eksternal / Media (YouTube, Website, dll) <span className="text-xs text-zinc-500">(Opsional)</span></label>
              <input type="url" name="external_link" value={formData.external_link || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="https://..." />
              <p className="text-xs text-zinc-500 mt-2">* Link ini jadi tujuan tombol "Baca Selengkapnya". Jika kamu tidak mengupload gambar di atas, sistem akan otomatis menarik gambar dari link ini.</p>
            </div>

            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Deskripsi / Isi <span className="text-red-500">*</span></label><textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows="4" className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-purple-500 focus:outline-none resize-none transition-colors"></textarea></div>
          </div>

          <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 sticky top-0">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Live Preview</h3>

            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col pointer-events-none">
              <div className="w-full aspect-video relative bg-black shrink-0 overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600 bg-zinc-900">
                    <span className="text-sm font-medium flex gap-2 items-center">
                      {isFetchingMeta ? 'Mencari Gambar di Web...' : 'Preview Media (16:9)'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-grow">
                <div className="flex items-center gap-2 text-brand-blue mb-3 text-[10px] font-bold tracking-widest uppercase">
                  <Calendar size={12} />
                  <span>{formData.doc_date ? new Date(formData.doc_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Tanggal Hari Ini'}</span>
                </div>
                <h3 className="font-bold text-base text-white mb-2 leading-tight">{formData.title || 'Judul Dokumentasi'}</h3>
                <p className="text-xs text-zinc-400">
                  {formData.description ? (formData.description.length > 430 ? formData.description.substring(0, 430) + '...' : formData.description) : 'Deskripsi dokumentasi akan tampil di sini...'}
                </p>
                {hasAnyLink && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 text-white font-bold uppercase tracking-widest text-[10px] text-brand-blue">
                      Kunjungi Situs
                      <ExternalLink size={12} />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-yellow-500 mt-4 bg-yellow-500/10 p-3 rounded-lg leading-relaxed text-center font-medium">
              * Gambar akan otomatis dipotong secara proporsional dengan rasio 16:9 agar seragam. Pastikan objek penting berada di tengah gambar.
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/40 backdrop-blur-md relative z-20">
        <h1 className="text-xl font-black tracking-tighter">Admin<span className="text-brand-blue">.</span></h1>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-72 md:w-72 bg-[#050505]/95 md:bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col pt-6 md:pt-10 z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-white/5 rounded-lg"
        >
          <X size={20} />
        </button>

        <div className="px-8 mb-8 md:mb-12">
          <h1 className="text-3xl font-black tracking-tighter hidden md:block">Admin<span className="text-brand-blue">.</span></h1>
          <p className="text-zinc-500 text-sm mt-1">Portfolio Manager</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <Briefcase size={18} /> Proyek
          </button>
          <button onClick={() => { setActiveTab('experiences'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'experiences' ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <Users size={18} /> Pengalaman
          </button>
          <button onClick={() => { setActiveTab('docs'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'docs' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <FileText size={18} /> Dokumentasi
          </button>
          <button onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <MessageSquare size={18} /> Pesan & Komentar
          </button>
        </nav>
        <div className="p-6 border-t border-white/5 space-y-3 mt-auto">
          <Link to="/" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10 transition-all border border-white/5">
            <ExternalLink size={18} /> Buka Website Publik
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 hover:text-white hover:bg-red-500 transition-all">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto h-[calc(100vh-73px)] md:h-screen relative z-10 w-full">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'experiences' && renderExperiences()}
        {activeTab === 'docs' && renderDocs()}
        {activeTab === 'messages' && renderMessages()}
      </main>

      {/* Modal / Form Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className={`bg-zinc-900/90 border border-white/10 rounded-3xl w-full ${['docs', 'projects'].includes(modalType) ? 'max-w-4xl' : 'max-w-xl'} overflow-hidden shadow-2xl shadow-black`}
            >
              <div className="flex justify-between items-center p-6 md:px-8 border-b border-white/5 bg-white/5">
                <h2 className="text-xl font-bold">{editingId ? 'Edit Data' : 'Tambah Data Baru'}</h2>
                <button onClick={closeModal} className="text-zinc-400 hover:text-white bg-black/50 p-2 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {renderModalContent()}
                <div className="mt-10 flex justify-end gap-4 pt-6 border-t border-white/5">
                  <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">Batal</button>
                  <button type="submit" disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${modalType === 'projects' ? 'bg-brand-blue hover:bg-blue-600 shadow-brand-blue/30' : modalType === 'experiences' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
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
