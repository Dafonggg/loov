/**
 * DATA KUSTOMISASI "OUR 4-YEAR WRAPPED"
 * -------------------------------------
 * Semua 13 foto sudah dikonversi ke JPEG siap-web di /assets/photos/:
 * - cover.jpg      <- cover.jpg
 * - tahun-1.jpg    <- IMG-20230122-WA0085.jpg
 * - tahun-2.jpg    <- temp_image_FDBED358-CDA7-45E8-881E-88E70E4766B6.JPEG
 * - tahun-3.jpg    <- IMG_7577.HEIC
 * - tahun-4.jpg    <- IMG_0079.JPG
 * - candid-1.jpg   <- IMG_4263.JPG
 * - candid-2.jpg   <- IMG_4268.JPG
 * - candid-3.jpg   <- FullSizeRender.JPG
 * - candid-4.jpg   <- IMG_0518.HEIC
 * - candid-5.jpg   <- IMG_0033.JPG
 * - candid-6.jpg   <- IMG_0028.JPG
 * - candid-7.jpg   <- IMG_0044.JPG
 * - candid-8.jpg   <- IMG_1508.JPG
 */

window.WRAPPED_DATA = {
  couple: {
    herName: "Mallaa",
    myName: "Dafong",
    startDate: "2022-11-25",
    anniversaryDate: "2026-11-25",
  },
  audio: {
    src: "./assets/Rex Orange County - Hannah Montana (Official Video).mp3",
    title: "Hannah Montana",
    artist: "Rex Orange County",
  },
  cover: {
    eyebrow: "25 Nov 2022 - 25 Nov 2026",
    title: "4 Tahun Kita.",
    subtitle:
      "Sebuah rangkuman kecil dari perjalanan kita berdua, disiapkan khusus untuk Malla.",
    photo: "./assets/photos/cover.jpg",
    photoAlt: "Foto sampul berdua untuk anniversary ke-4",
  },
  reflection: {
    eyebrow: "Angka Perjalanan Kita",
    headline: "Hari Bareng",
    note:
      "Dari obrolan pertama sampai hari ini, setiap minggu punya ceritanya sendiri. Terima kasih sudah terus berjalan di sisi yang sama.",
  },
  chapters: [
    {
      id: "tahun-1",
      number: "01",
      yearRange: "2022 - 2023",
      title: "Tahun Pertama: Awal Mengenal",
      photo: "./assets/photos/tahun-1.jpg",
      alt: "Momen tahun pertama bersama (2022 - 2023)",
      story: "",
      backNote:
        "Masih ingat banget hari ini di GOR Gotong Royong, waktu kamu nyamperin aku yang lagi nonton futsal. Dari momen sesederhana jalan bersebelahan di tengah keramaian itu, aku udah ngerasa ada sesuatu yang beda pas bareng kamu.",
      theme: "mahogany",
    },
    {
      id: "tahun-2",
      number: "02",
      yearRange: "2023 - 2024",
      title: "Tahun Kedua: Mulai Nyaman",
      location: "",
      photo: "./assets/photos/tahun5.jpg",
      photoPosition: "center 56%",
      alt: "Momen tahun kedua bersama (2023 - 2024)",
      story: "",
      backNote:
        "Salah satu foto favoritku sampai sekarang. Malam tenang, lampu jalan, dan kamu di punggungku. Di tahun kedua ini aku makin sadar, capek seharian selalu terasa lebih ringan kalau pulangnya masih sama kamu.",
      theme: "cream",
    },
    {
      id: "tahun-3",
      number: "03",
      yearRange: "2024 - 2025",
      title: "Tahun Ketiga: Tumbuh Bareng",
      location: "",
      photo: "./assets/photos/candid-4.jpg",
      photoPosition: "center 42%",
      alt: "Momen tahun ketiga bersama (2024 - 2025)",
      story: "",
      backNote:
        "Tahun ketiga banyak naik turunnya, tapi kita selalu punya cara buat ketawa lagi dari hal-hal random kayak gini, ditemani segelas kopi dan matcha. Terima kasih sudah selalu sabar, tetap bertahan, dan nggak pernah berhenti jadi alasan aku buat senyum.",
      theme: "crimson",
    },
    {
      id: "tahun-4",
      number: "04",
      yearRange: "2025 - 2026",
      title: "Tahun Keempat: Tetap Kamu",
      location: "",
      photo: "./assets/photos/tahun-4.jpg",
      alt: "Momen tahun keempat bersama (2025 - 2026)",
      story: "",
      backNote:
        "Sudah masuk tahun keempat dan rasanya masih tetap nyaman buat jadi diri sendiri di depan kamu, mau lagi sok serius atau pasang muka asal kayak gini. Semoga di tahun kelima nanti, bahuku tetap jadi tempat ternyaman buat kamu bersandar.",
      theme: "espresso",
    },
  ],
  vouchers: {
    eyebrow: "Khusus Tahun Ke-5",
    title: "4 Kupon Untukmu",
    subtitle: "Ketuk kupon mana saja untuk menandai yang mau kamu pakai dulu.",
    items: [
      {
        id: "voucher-makan",
        code: "NO. 01",
        title: "Baso Munjul ",
        desc: "Malem Ini Setelah Isya ",
      },
      {
        id: "voucher-makan-malem",
        code: "NO. 02",
        title: "Makan Nasgor / Kwetiaw Tengah Malam",
        desc: "Berlaku kapan saja saat tiba-tiba laper tengah malam dan pengen makan nasgor atau kwetiaw di luar.",
      },
      {
        id: "voucher-photobooth",
        code: "NO. 03",
        title: "Photobooth Tahun Ke-5",
        desc: "Wajib nambah koleksi foto berdua buat kenangan tahun depan.",
      },
      {
        id: "voucher-peluk",
        code: "NO. 04",
        title: "Peluk & Dengerin Cerita",
        desc: "Tanpa syarat dan tanpa batas waktu, kapan pun kamu lagi capek atau pengen cerita.",
      },
    ],
  },
  gallery: {
    eyebrow: "Contact Sheet",
    title: "Potongan Kecil yang Disimpan",
    subtitle: "Ketuk foto mana saja untuk melihat ukuran penuh.",
    items: [
      {
        id: "candid-1",
        photo: "./assets/photos/candid-5.jpg",
        alt: "Foto kenangan candid 1",
        caption: "",
        dateLabel: "ROLL 01",
      },
      {
        id: "candid-2",
        photo: "./assets/photos/candid-2.jpg",
        alt: "Foto kenangan candid 2",
        caption: "",
        dateLabel: "ROLL 02",
      },
      {
        id: "candid-3",
        photo: "./assets/photos/candid-8.jpg",
        alt: "Foto kenangan candid 3",
        caption: "",
        dateLabel: "ROLL 03",
      },
      {
        id: "candid-4",
        photo: "./assets/photos/tahun-3.jpg",
        photoPosition: "center 58%",
        alt: "Foto kenangan candid 4",
        caption: "",
        dateLabel: "ROLL 04",
      },
      {
        id: "candid-5",
        photo: "./assets/photos/candid-1.jpg",
        alt: "Foto kenangan candid 5",
        caption: "",
        dateLabel: "ROLL 05",
      },
      {
        id: "candid-6",
        photo: "./assets/photos/candid-6.jpg",
        alt: "Foto kenangan candid 6",
        caption: "",
        dateLabel: "ROLL 06",
      },
      {
        id: "candid-7",
        photo: "./assets/photos/candid-7.jpg",
        alt: "Foto kenangan candid 7",
        caption: "",
        dateLabel: "ROLL 07",
      },
      {
        id: "candid-8",
        photo: "./assets/photos/candid-3.jpg",
        alt: "Foto kenangan candid 8",
        caption: "",
        dateLabel: "ROLL 08",
      },
    ],
  },
  letter: {
    eyebrow: "Untuk Hari Ini",
    title: "Surat Tahun Ke-4",
    greeting: "Untuk Malla,",
    paragraphs: [
      "Nggak terasa ya, sudah empat tahun sejak November 2022 kita jalan bareng. Terima kasih sudah selalu ada di sampingku, dari masa-masa awal yang masih serba canggung sampai sekarang kita sudah saling hafal kebiasaan kecil satu sama lain.",
      "Hal yang paling aku syukuri dari kita bukan cuma momen besar atau jalan-jalan jauhnya, tapi hari-hari biasanya. Mulai dari duduk santai, ketawa karena hal sepele, sampai malam minggu yang cuma dihabisin di Teru, bareng kamu semuanya selalu terasa cukup.",
      "Terima kasih sudah sabar menghadapi aku, sudah mau terus belajar dan tumbuh bareng selama 1.461 hari ini. Semoga di tahun kelima dan tahun-tahun setelahnya, langkah kita tetap searah, sehat terus, dan tetap saling memilih di setiap harinya.",
    ],
    closing: "Happy Anniversary 4th, Dutttt.",
    signature: "Dafong",
  },
};
 