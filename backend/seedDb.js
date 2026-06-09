const mysql = require('mysql2/promise');
require('dotenv').config();

const projects = [
  {
    title: "E-Commerce Frontend",
    description: "A modern e-commerce web application with a fully responsive design, product filtering, and shopping cart functionality.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop",
    technologies: JSON.stringify(["React", "Tailwind CSS", "Redux"]),
    github_url: "https://github.com",
    live_url: "https://example.com"
  },
  {
    title: "Task Management Dashboard",
    description: "An intuitive dashboard for managing daily tasks, featuring drag-and-drop kanban boards and progress tracking.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    technologies: JSON.stringify(["React", "Context API", "Framer Motion"]),
    github_url: "https://github.com",
    live_url: "https://example.com"
  },
  {
    title: "AI Image Generator UI",
    description: "A sleek and futuristic user interface designed for an AI image generation tool, emphasizing a dark theme and glowing accents.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    technologies: JSON.stringify(["Vite", "React", "Tailwind CSS"]),
    github_url: "https://github.com",
    live_url: "https://example.com"
  }
];

const experiences = [
  {
    role: "Ketua Umum",
    organization: "Himpunan Mahasiswa Program Studi Teknologi Informasi (ITSMI)",
    period: "2025 - Sekarang",
    description: "Memimpin dan mengoordinasikan pengurus organisasi dalam menjalankan program kerja selama satu periode kepengurusan serta mengawasi pelaksanaan kegiatan akademik dan pengembangan mahasiswa melalui kerja sama dengan mahasiswa, dosen, dan pihak kampus."
  },
  {
    role: "Ketua Divisi Minat dan Bakat",
    organization: "Himpunan Mahasiswa Program Studi Teknologi Informasi (ITSMI)",
    period: "2024 - 2025",
    description: "Mengelola dan mengembangkan program kegiatan yang mendukung minat dan bakat mahasiswa serta mengoordinasikan anggota divisi dalam pelaksanaan berbagai kegiatan dan kompetisi mahasiswa."
  },
  {
    role: "Anggota Divisi Minat dan Bakat",
    organization: "Himpunan Mahasiswa Program Studi Teknologi Informasi (ITSMI)",
    period: "2023 - 2024",
    description: "Berpartisipasi dalam pelaksanaan program kerja divisi serta mendukung penyelenggaraan berbagai kegiatan pengembangan minat dan bakat mahasiswa."
  },
  {
    role: "Wakil Ketua Publikasi dan Dokumentasi",
    organization: "Campus Expo Man 1 Medan",
    period: "2023 - 2024",
    description: "Membantu ketua dalam mengoordinasikan kegiatan publikasi dan dokumentasi acara serta memastikan penyampaian informasi kegiatan kepada peserta dan pihak terkait secara efektif.Berpartisipasi dalam pelaksanaan program kerja divisi serta mendukung penyelenggaraan berbagai kegiatan pengembangan minat dan bakat mahasiswa."
  },
  {
    role: "Ketua Divisi Digital Safety",
    organization: "Ekstrakurikuler Pandu Digital",
    period: "2022 - 2023",
    description: "Memimpin divisi dalam mengedukasi anggota mengenai keamanan digital serta mengoordinasikan kegiatan yang berkaitan dengan literasi dan keselamatan digital.Berpartisipasi dalam pelaksanaan program kerja divisi serta mendukung penyelenggaraan berbagai kegiatan pengembangan minat dan bakat mahasiswa."
  },
  {
    role: "Ketua Umum",
    organization: "Ekstrakurikuler Robotik",
    period: "2021 - 2022",
    description: "Mengkoordinasikan kegiatan ekstrakurikuler robotik serta membimbing anggota dalam pengembangan keterampilan teknologi dan persiapan kompetisi."
  },
  {
    role: "Wakil Ketua Koordinator Bidang Informasi dan Teknologi",
    organization: "Organisasi Siswa Intra Madrasah",
    period: "2021 - 2022",
    description: "Membantu ketua dalam mengoordinasikan kegiatan yang berkaitan dengan bidang informasi dan teknologi serta mendukung pengelolaan komunikasi dan dokumentasi kegiatan organisasi."
  }
];

const docs = [
  {
    title: 'Peluncuran Aplikasi Manajemen Kampus',
    type: 'youtube',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Liputan peluncuran aplikasi sistem informasi akademik yang dibuat bersama tim untuk membantu operasional mahasiswa secara terpadu.'
  },
  {
    title: 'Juara 1 Lomba Web Design Nasional 2024',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
    description: 'Berhasil meraih juara 1 pada ajang kompetisi desain web tingkat nasional yang diselenggarakan di Jakarta.'
  },
  {
    title: 'Menjadi Pemateri di Seminar Teknologi',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
    description: 'Diundang sebagai narasumber untuk membahas tren pengembangan web modern.'
  }
];

async function seedData() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'portfolio_db'
        });

        console.log('Seeding projects...');
        for (const p of projects) {
            await connection.query(
                'INSERT INTO projects (title, description, image, technologies, github_url, live_url) VALUES (?, ?, ?, ?, ?, ?)',
                [p.title, p.description, p.image, p.technologies, p.github_url, p.live_url]
            );
        }

        console.log('Seeding experiences...');
        for (const e of experiences) {
            await connection.query(
                'INSERT INTO experiences (role, organization, period, description) VALUES (?, ?, ?, ?)',
                [e.role, e.organization, e.period, e.description]
            );
        }

        console.log('Seeding docs...');
        for (const d of docs) {
            await connection.query(
                'INSERT INTO docs (title, type, url, description) VALUES (?, ?, ?, ?)',
                [d.title, d.type, d.url, d.description]
            );
        }

        console.log('Data seeded successfully!');
        await connection.end();
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

seedData();
