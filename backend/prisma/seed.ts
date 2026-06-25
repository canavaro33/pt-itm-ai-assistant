import { PrismaClient, KnowledgeCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.chatHistory.deleteMany();
  await prisma.companyKnowledge.deleteMany();
  await prisma.employee.deleteMany();

  console.log('🗑️  Cleaned existing data');

  // Seed Company Knowledge - Safety
  const safetyEntries = [
    {
      category: KnowledgeCategory.safety,
      topic: 'Alat Pelindung Diri (APD)',
      content:
        'Seluruh karyawan dan kontraktor wajib menggunakan Alat Pelindung Diri (APD) lengkap di area tambang, meliputi helm keselamatan (safety helmet), sepatu safety (steel-toe boots), rompi reflektif (high-visibility vest), kacamata pelindung (safety goggles), dan pelindung telinga (ear plugs/muffs). Pelanggaran akan dikenakan sanksi sesuai peraturan K3 perusahaan.',
    },
    {
      category: KnowledgeCategory.safety,
      topic: 'Permit to Work (PTW)',
      content:
        'Prosedur izin kerja atau Permit to Work (PTW) wajib diisi dan disetujui oleh supervisor sebelum memulai pekerjaan berisiko tinggi seperti bekerja di ketinggian, pengelasan, pekerjaan listrik, dan confined space entry. Formulir PTW harus mencakup analisis bahaya (Job Safety Analysis) dan rencana mitigasi risiko.',
    },
    {
      category: KnowledgeCategory.safety,
      topic: 'Pelaporan Insiden',
      content:
        'Setiap insiden kecelakaan kerja, near-miss, atau kondisi tidak aman wajib dilaporkan kepada departemen EHS (Environment, Health & Safety) dalam waktu 1×24 jam. Pelaporan dilakukan melalui sistem IRIS (Incident Reporting Information System) dan akan ditindaklanjuti dengan investigasi akar penyebab (root cause analysis).',
    },
    {
      category: KnowledgeCategory.safety,
      topic: 'Inspeksi Alat Berat',
      content:
        'Inspeksi harian alat berat (excavator, dump truck, dozer, grader) wajib dilakukan setiap pagi sebelum operasi dimulai. Checklist inspeksi mencakup pengecekan rem, steering, lampu, ban, oli hidrolik, dan sistem keselamatan. Unit yang tidak lolos inspeksi dilarang beroperasi sampai diperbaiki.',
    },
  ];

  // Seed Company Knowledge - Corporate
  const corporateEntries = [
    {
      category: KnowledgeCategory.corporate,
      topic: 'Profil Perusahaan',
      content:
        'PT Indo Tambangraya Megah Tbk (ITM) adalah perusahaan energi batubara terkemuka di Indonesia yang terdaftar di Bursa Efek Indonesia (BEI) dengan kode saham ITMG. Perusahaan berfokus pada operasi penambangan batubara berkualitas tinggi untuk pasar domestik dan internasional.',
    },
    {
      category: KnowledgeCategory.corporate,
      topic: 'Wilayah Operasi',
      content:
        'PT ITM beroperasi di tiga provinsi di Kalimantan: Kalimantan Timur, Kalimantan Selatan, dan Kalimantan Tengah. Kegiatan operasional mencakup eksplorasi, penambangan, pengolahan, dan pengangkutan batubara melalui jalur darat dan sungai menuju terminal muat di pelabuhan.',
    },
    {
      category: KnowledgeCategory.corporate,
      topic: 'Grup Perusahaan',
      content:
        'PT ITM merupakan anak perusahaan dari Banpu Public Company Limited, perusahaan energi terintegrasi asal Thailand. ITM berdiri sejak tahun 1987 dan telah berkembang menjadi salah satu produsen batubara terbesar di Indonesia dengan kapasitas produksi lebih dari 20 juta ton per tahun.',
    },
    {
      category: KnowledgeCategory.corporate,
      topic: 'Site Tambang',
      content:
        'PT ITM memiliki dan mengoperasikan beberapa site tambang melalui anak perusahaannya: Indominco Mandiri (Kalimantan Timur), Kitadin (Kalimantan Timur), Trubaindo Coal Mining (Kalimantan Timur), Bharinto Ekatama (Kalimantan Tengah), dan Jorong Barutama Greston (Kalimantan Selatan). Masing-masing site memiliki infrastruktur lengkap termasuk kantor, mess karyawan, dan fasilitas pendukung.',
    },
  ];

  // Seed Company Knowledge - Wellness
  const wellnessEntries = [
    {
      category: KnowledgeCategory.wellness,
      topic: 'Klinik Kesehatan',
      content:
        'Setiap site tambang PT ITM dilengkapi dengan klinik kesehatan perusahaan yang beroperasi 24 jam. Klinik menyediakan layanan konsultasi dokter umum, pertolongan pertama (P3K), penanganan darurat, dan rujukan ke rumah sakit rekanan. Karyawan dan keluarga inti (istri/suami dan anak) berhak mengakses layanan klinik secara gratis.',
    },
    {
      category: KnowledgeCategory.wellness,
      topic: 'Medical Check-Up Tahunan',
      content:
        'Program wellness tahunan PT ITM mencakup medical check-up (MCU) komprehensif gratis untuk seluruh karyawan. Pemeriksaan meliputi tes darah lengkap, rontgen dada, audiometri, spirometri, tes mata, EKG, serta konsultasi dengan dokter spesialis. Hasil MCU digunakan sebagai dasar evaluasi fitness to work karyawan.',
    },
    {
      category: KnowledgeCategory.wellness,
      topic: 'Layanan Konseling',
      content:
        'PT ITM menyediakan layanan konseling psikologis yang dapat diakses secara konfidensial oleh seluruh karyawan. Program Employee Assistance Program (EAP) mencakup konseling untuk stres kerja, masalah pribadi dan keluarga, manajemen emosi, serta dukungan kesehatan mental. Sesi konseling tersedia secara tatap muka di klinik site maupun secara daring.',
    },
    {
      category: KnowledgeCategory.wellness,
      topic: 'Jadwal Shift dan Istirahat',
      content:
        'Jadwal rotasi shift di PT ITM dirancang untuk memastikan minimum 8 jam istirahat antar shift kerja. Pola roster yang diterapkan adalah 2 minggu kerja dan 1 minggu libur (roster 14/7) untuk karyawan site. Selama periode kerja, shift terbagi menjadi shift pagi (06:00-18:00) dan shift malam (18:00-06:00) dengan waktu istirahat dan makan yang terjadwal.',
    },
  ];

  await prisma.companyKnowledge.createMany({
    data: [...safetyEntries, ...corporateEntries, ...wellnessEntries],
  });

  console.log('📚 Seeded 12 company knowledge entries');

  // Seed Employees
  await prisma.employee.createMany({
    data: [
      {
        name: 'Budi Santoso',
        employeeId: 'ITM-0012',
        department: 'Operations',
        role: 'Mine Supervisor',
        passwordHash: '$2b$10$dummyhash.budisantoso.placeholder',
      },
      {
        name: 'Siti Rahma',
        employeeId: 'ITM-0045',
        department: 'EHS',
        role: 'Safety Officer',
        passwordHash: '$2b$10$dummyhash.sitirahma.placeholder',
      },
      {
        name: 'Andi Pratama',
        employeeId: 'ITM-0078',
        department: 'HR',
        role: 'HR Specialist',
        passwordHash: '$2b$10$dummyhash.andipratama.placeholder',
      },
    ],
  });

  console.log('👥 Seeded 3 dummy employees');
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
