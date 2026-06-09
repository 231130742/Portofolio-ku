import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, FileText, Plus, Trash2, Edit2, X, ExternalLink, LogOut, UploadCloud, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Admin() {
  const { projects, experiences, docs, refreshData } = usePortfolio();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (type === 'projects') setFormData({ title: '', description: '', technologies: '', github_url: '', live_url: '' });
      if (type === 'experiences') setFormData({ role: '', organization: '', period: '', description: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem('admin_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    let url = `http://localhost:5000/api/${modalType}`;
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
        if (selectedFile) bodyData.append('image', selectedFile);
      } 
      else if (modalType === 'docs') {
        const calculatedType = selectedFile ? 'image' : (formData.url?.includes('youtube') || formData.url?.includes('youtu.be') ? 'youtube' : 'image');
        bodyData = new FormData();
        bodyData.append('title', formData.title);
        bodyData.append('type', calculatedType);
        bodyData.append('description', formData.description);
        bodyData.append('url', formData.url || '');
        bodyData.append('doc_date', formData.doc_date || '');
        bodyData.append('external_link', formData.external_link || '');
        if (selectedFile) bodyData.append('file', selectedFile);
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
      const res = await fetch(`http://localhost:5000/api/${type}/${id}`, { method: 'DELETE' });
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Manajemen Proyek</h2>
        <button onClick={() => openModal('projects')} className="flex items-center gap-2 bg-brand-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] font-bold">
          <Plus size={18} /> Tambah Proyek
        </button>
      </div>
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
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
                  {proj.image && <img src={`http://localhost:5000${proj.image}`} className="w-10 h-10 rounded-md object-cover" alt="" />}
                  {proj.title}
                </td>
                <td className="p-5 text-zinc-400 text-sm">{Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</td>
                <td className="p-5">
                  <div className="flex gap-2">
                    {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-brand-blue"><ExternalLink size={16}/></a>}
                    {proj.live_url && <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-green-400"><ExternalLink size={16}/></a>}
                  </div>
                </td>
                <td className="p-5 text-right flex justify-end gap-3">
                  <button onClick={() => openModal('projects', proj)} className="p-2.5 text-zinc-400 hover:text-white bg-white/5 rounded-lg transition-colors"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete('projects', proj.id)} className="p-2.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Manajemen Pengalaman</h2>
        <button onClick={() => openModal('experiences')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(22,163,74,0.5)] font-bold">
          <Plus size={18} /> Tambah Pengalaman
        </button>
      </div>
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
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
                <td className="p-5 text-brand-blue text-sm font-mono bg-brand-blue/5 rounded-md inline-block mt-4">{exp.period}</td>
                <td className="p-5 text-right">
                   <div className="flex justify-end gap-3">
                    <button onClick={() => openModal('experiences', exp)} className="p-2.5 text-zinc-400 hover:text-white bg-white/5 rounded-lg transition-colors"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete('experiences', exp.id)} className="p-2.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Manajemen Dokumentasi</h2>
        <button onClick={() => openModal('docs')} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.5)] font-bold">
          <Plus size={18} /> Tambah Dokumentasi
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map(doc => (
          <div key={doc.id} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:-translate-y-1 transition-all">
             {doc.type === 'youtube' ? (
                <div className="aspect-video bg-black"><iframe width="100%" height="100%" src={doc.url} title={doc.title} frameBorder="0" allowFullScreen></iframe></div>
              ) : (
                <div className="aspect-video bg-black">
                  <img src={doc.url && doc.url.startsWith('/uploads') ? `http://localhost:5000${doc.url}` : doc.url} alt={doc.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            <div className="p-5 flex-grow">
              <span className="text-[10px] uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-md mb-2 inline-block">{doc.type}</span>
              <h3 className="font-bold text-lg text-white mb-2 leading-tight">{doc.title}</h3>
              <p className="text-sm text-zinc-400 line-clamp-2">{doc.description}</p>
            </div>
            <div className="p-4 border-t border-white/5 flex gap-3 bg-black/20">
               <button onClick={() => openModal('docs', doc)} className="flex-1 py-2.5 flex justify-center items-center gap-2 text-sm font-bold text-zinc-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"><Edit2 size={14}/> Edit</button>
               <button onClick={() => handleDelete('docs', doc.id)} className="flex-1 py-2.5 flex justify-center items-center gap-2 text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={14}/> Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderModalContent = () => {
    if (modalType === 'projects') {
      return (
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
      );
    }
    if (modalType === 'experiences') {
      return (
        <div className="space-y-5">
          <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Peran / Jabatan <span className="text-red-500">*</span></label><input required name="role" value={formData.role || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-green-500 focus:outline-none transition-colors" /></div>
          <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Nama Organisasi / Perusahaan <span className="text-red-500">*</span></label><input required name="organization" value={formData.organization || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-green-500 focus:outline-none transition-colors" /></div>
          <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Periode <span className="text-red-500">*</span></label><input required name="period" value={formData.period || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-green-500 focus:outline-none transition-colors" placeholder="2024 - Sekarang" /></div>
          <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Deskripsi Tugas <span className="text-red-500">*</span></label><textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows="4" className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-green-500 focus:outline-none resize-none transition-colors"></textarea></div>
        </div>
      );
    }
    if (modalType === 'docs') {
      const previewImage = selectedFile ? URL.createObjectURL(selectedFile) : (formData.url && formData.url.startsWith('/uploads') ? `http://localhost:5000${formData.url}` : formData.url);
      const isYoutubePreview = !selectedFile && (formData.url?.includes('youtube.com') || formData.url?.includes('youtu.be'));

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-5">
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Judul Dokumentasi <span className="text-red-500">*</span></label><input required name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-purple-500 focus:outline-none transition-colors" /></div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Tanggal <span className="text-xs text-zinc-500">(Kosongkan untuk hari ini)</span></label>
              <input type="date" name="doc_date" value={formData.doc_date ? formData.doc_date.split('T')[0] : ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-purple-500 focus:outline-none transition-colors" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Media Utama (Upload File) <span className="text-xs text-zinc-500">(Prioritas)</span></label>
              <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors bg-black/30">
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud className="mx-auto text-zinc-500 mb-2" size={32} />
                <p className="text-sm text-zinc-400">{selectedFile ? selectedFile.name : (formData.url && formData.url.startsWith('/uploads') ? 'File sudah ada, klik untuk mengganti' : 'Klik atau drag file gambar ke sini')}</p>
              </div>
            </div>

            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Atau URL Media (Link YouTube / Gambar)</label><input name="url" value={formData.url || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="https://..." /></div>
            
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Link Eksternal (Opsional - Munculkan tombol 'Baca Selengkapnya')</label><input type="url" name="external_link" value={formData.external_link || ''} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="https://..." /></div>
            
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Deskripsi / Isi <span className="text-red-500">*</span></label><textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows="4" className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white focus:border-purple-500 focus:outline-none resize-none transition-colors"></textarea></div>
          </div>

          <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 sticky top-0">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Live Preview</h3>
            
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col pointer-events-none">
              <div className="w-full aspect-video relative bg-black shrink-0 overflow-hidden">
                {isYoutubePreview ? (
                  <iframe width="100%" height="100%" src={formData.url} title="Preview" frameBorder="0" className="absolute inset-0 w-full h-full object-cover"></iframe>
                ) : (
                  previewImage ? <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-zinc-600"><span className="text-sm font-medium">Preview Media</span></div>
                )}
              </div>
              <div className="p-5 flex-grow">
                <div className="flex items-center gap-2 text-brand-blue mb-3 text-[10px] font-bold tracking-widest uppercase">
                  <Calendar size={12} />
                  <span>{formData.doc_date ? new Date(formData.doc_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Tanggal Hari Ini'}</span>
                </div>
                <h3 className="font-bold text-base text-white mb-2 leading-tight">{formData.title || 'Judul Dokumentasi'}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">{formData.description || 'Deskripsi dokumentasi akan tampil di sini...'}</p>
                {formData.external_link && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 text-white font-bold uppercase tracking-widest text-[10px] text-brand-blue">
                      Baca Selengkapnya
                      <ArrowRight size={12} />
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

      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col pt-10 relative z-10">
        <div className="px-8 mb-12">
          <h1 className="text-3xl font-black tracking-tighter">Admin<span className="text-brand-blue">.</span></h1>
          <p className="text-zinc-500 text-sm mt-1">Portfolio Manager</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <Briefcase size={18} /> Proyek
          </button>
          <button onClick={() => setActiveTab('experiences')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'experiences' ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <Users size={18} /> Pengalaman
          </button>
          <button onClick={() => setActiveTab('docs')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'docs' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <FileText size={18} /> Dokumentasi
          </button>
        </nav>
        <div className="p-6 border-t border-white/5 space-y-3">
          <Link to="/" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10 transition-all border border-white/5">
            <ExternalLink size={18} /> Buka Website Publik
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 hover:text-white hover:bg-red-500 transition-all">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen relative z-10">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'experiences' && renderExperiences()}
        {activeTab === 'docs' && renderDocs()}
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
              className={`bg-zinc-900/90 border border-white/10 rounded-3xl w-full ${modalType === 'docs' ? 'max-w-4xl' : 'max-w-xl'} overflow-hidden shadow-2xl shadow-black`}
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
