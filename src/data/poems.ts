import { Poem } from '../types/poem';

export const INITIAL_POEMS: Poem[] = [
  {
    id: 'membaca-tanda-tanda',
    title: 'Membaca Tanda-Tanda',
    poet: 'Taufiq Ismail',
    year: '1982',
    theme: 'Kerusakan Lingkungan, Kesadaran Ekologis & Doa Perenungan',
    synopsis: 'Puisi ini melukiskan keprihatinan mendalam atas rusaknya alam semesta akibat keserakahan manusia, disusul bencana demi bencana, dan ditutup dengan kepasrahan doa memohon ampunan serta hikmah kepada Tuhan.',
    stanzas: [
      {
        stanzaNumber: 1,
        moodTheme: 'Gelisah, Reflektif & Meraba Kehilangan',
        voiceGuide: 'Tempo perlahan, nada rendah, vokal desah yang menahan rasa khawatir.',
        lines: [
          {
            id: 'mtt-1-1',
            rawText: 'Ada sesuatu yang rasanya mulai lepas dari tangan dan meluncur lewat sela-sela jari kita',
            prosodyMarkedText: 'Ada sesuatu / yang rasanya mulai lepas dari tangan // dan meluncur lewat sela-sela jari kita ///',
            expressionNote: 'Tatapan mata memandang ke depan dengan raut cemas, kedua tangan seolah merasakan pasir/air yang terlepas.',
            words: [
              { text: 'Ada' },
              { text: 'sesuatu', pauseAfter: 'short' },
              { text: 'yang' },
              { text: 'rasanya' },
              { text: 'mulai' },
              { text: 'lepas', isEmphasized: true },
              { text: 'dari' },
              { text: 'tangan', pauseAfter: 'medium' },
              { text: 'dan' },
              { text: 'meluncur', isEmphasized: true },
              { text: 'lewat' },
              { text: 'sela-sela' },
              { text: 'jari' },
              { text: 'kita', pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-1-2',
            rawText: 'Ada sesuatu yang mulanya tak begitu jelas tapi kini kita mulai merindukannya',
            prosodyMarkedText: 'Ada sesuatu / yang mulanya tak begitu jelas // tapi kini kita mulai merindukannya ///',
            expressionNote: 'Nada suara beralih ke kerinduan yang pedih, napas tertahan di akhir larik.',
            words: [
              { text: 'Ada' },
              { text: 'sesuatu', pauseAfter: 'short' },
              { text: 'yang' },
              { text: 'mulanya' },
              { text: 'tak' },
              { text: 'begitu' },
              { text: 'jelas', pauseAfter: 'medium' },
              { text: 'tapi' },
              { text: 'kini' },
              { text: 'kita' },
              { text: 'mulai' },
              { text: 'merindukannya', isEmphasized: true, pauseAfter: 'long' }
            ]
          }
        ]
      },
      {
        stanzaNumber: 2,
        moodTheme: 'Menggugat, Mengamati Bukti Nyata Bencana',
        voiceGuide: 'Volume mulai meninggi, artikulasi tegas, tempo bertambah ritmis.',
        lines: [
          {
            id: 'mtt-2-1',
            rawText: 'Kita saksikan udara makin hari makin kotor, gas racun terbang di atas kepala kita',
            prosodyMarkedText: 'Kita saksikan / udara makin hari makin kotor // gas racun terbang / di atas kepala kita ///',
            expressionNote: 'Mata menatap tegas ke audiens, intonasi menekan kata "kotor" dan "gas racun".',
            words: [
              { text: 'Kita' },
              { text: 'saksikan', pauseAfter: 'short' },
              { text: 'udara' },
              { text: 'makin' },
              { text: 'hari' },
              { text: 'makin' },
              { text: 'kotor', isEmphasized: true, pauseAfter: 'medium' },
              { text: 'gas' },
              { text: 'racun', isEmphasized: true },
              { text: 'terbang', pauseAfter: 'short' },
              { text: 'di' },
              { text: 'atas' },
              { text: 'kepala' },
              { text: 'kita', pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-2-2',
            rawText: 'Kita saksikan air danau yang dulu jernih membiru kini telah menjadi keruh berlumut',
            prosodyMarkedText: 'Kita saksikan / air danau yang dulu jernih membiru // kini telah menjadi keruh berlumut ///',
            expressionNote: 'Kontraskan nada nostalgia pada "jernih membiru" dengan nada jijik/sedih pada "keruh berlumut".',
            words: [
              { text: 'Kita' },
              { text: 'saksikan', pauseAfter: 'short' },
              { text: 'air' },
              { text: 'danau' },
              { text: 'yang' },
              { text: 'dulu' },
              { text: 'jernih' },
              { text: 'membiru', pauseAfter: 'medium' },
              { text: 'kini' },
              { text: 'telah' },
              { text: 'menjadi' },
              { text: 'keruh', isEmphasized: true },
              { text: 'berlumut', isEmphasized: true, pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-2-3',
            rawText: 'Ikan-ikan pada mati mengapung, sungai-sungai berbau busuk',
            prosodyMarkedText: 'Ikan-ikan pada mati mengapung // sungai-sungai berbau busuk ///',
            expressionNote: 'Mimik wajah menunjukkan rasa muak dan kepedihan, getaran suara berwibawa.',
            words: [
              { text: 'Ikan-ikan' },
              { text: 'pada' },
              { text: 'mati', isEmphasized: true },
              { text: 'mengapung', isEmphasized: true, pauseAfter: 'medium' },
              { text: 'sungai-sungai' },
              { text: 'berbau' },
              { text: 'busuk', isEmphasized: true, pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-2-4',
            rawText: 'Pohon-pohon di bukit dan gunung ditebangi tanpa henti',
            prosodyMarkedText: 'Pohon-pohon di bukit dan gunung // ditebangi tanpa henti ///',
            expressionNote: 'Tekanan keras pada "ditebangi tanpa henti", tangan dapat membuat gestur memotong/mengepal.',
            words: [
              { text: 'Pohon-pohon' },
              { text: 'di' },
              { text: 'bukit' },
              { text: 'dan' },
              { text: 'gunung', pauseAfter: 'medium' },
              { text: 'ditebangi', isEmphasized: true },
              { text: 'tanpa' },
              { text: 'henti', isEmphasized: true, pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-2-5',
            rawText: 'Kita saksikan burung-burung berkicau semakin jarang terdengar',
            prosodyMarkedText: 'Kita saksikan / burung-burung berkicau // semakin jarang terdengar ///',
            expressionNote: 'Suara melambat dan lirih pada "jarang terdengar", seolah mendengar keheningan yang mencekam.',
            words: [
              { text: 'Kita' },
              { text: 'saksikan', pauseAfter: 'short' },
              { text: 'burung-burung' },
              { text: 'berkicau', pauseAfter: 'medium' },
              { text: 'semakin' },
              { text: 'jarang', isEmphasized: true },
              { text: 'terdengar', pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-2-6',
            rawText: 'Bumi kita semakin panas dan gerah, tanah retak meratap dahaga',
            prosodyMarkedText: 'Bumi kita semakin panas dan gerah // tanah retak / meratap dahaga ///',
            expressionNote: 'Raut wajah menahan panas dan kepedihan alam, vokal berat berakar.',
            words: [
              { text: 'Bumi' },
              { text: 'kita' },
              { text: 'semakin' },
              { text: 'panas', isEmphasized: true },
              { text: 'dan' },
              { text: 'gerah', pauseAfter: 'medium' },
              { text: 'tanah' },
              { text: 'retak', isEmphasized: true, pauseAfter: 'short' },
              { text: 'meratap', isEmphasized: true },
              { text: 'dahaga', pauseAfter: 'long' }
            ]
          }
        ]
      },
      {
        stanzaNumber: 3,
        moodTheme: 'Puncak Kemarahan, Tragedi & Pengakuan Dosa',
        voiceGuide: 'Klimaks nada, lantang dan menggelegar, artikulasi sangat tajam.',
        lines: [
          {
            id: 'mtt-3-1',
            rawText: 'Kita saksikan tanah longsor menelan rumah dan ladang',
            prosodyMarkedText: 'Kita saksikan / tanah longsor // menelan rumah dan ladang ///',
            expressionNote: 'Pandangan mata menghunjam, ada getaran kepanikan atas bencana longsor.',
            words: [
              { text: 'Kita' },
              { text: 'saksikan', pauseAfter: 'short' },
              { text: 'tanah' },
              { text: 'longsor', isEmphasized: true, pauseAfter: 'medium' },
              { text: 'menelan', isEmphasized: true },
              { text: 'rumah' },
              { text: 'dan' },
              { text: 'ladang', pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-3-2',
            rawText: 'Banjir bandang menerjang kota, meluluhlantakkan harapan',
            prosodyMarkedText: 'Banjir bandang menerjang kota // meluluhlantakkan harapan ///',
            expressionNote: 'Kata "meluluhlantakkan harapan" diucapkan dengan intonasi berat dan tercekat.',
            words: [
              { text: 'Banjir' },
              { text: 'bandang', isEmphasized: true },
              { text: 'menerjang' },
              { text: 'kota', pauseAfter: 'medium' },
              { text: 'meluluhlantakkan', isEmphasized: true },
              { text: 'harapan', pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-3-3',
            rawText: 'Semua ini karena kita yang abai, kita yang rakus dan serakah',
            prosodyMarkedText: 'Semua ini / karena kita yang abai // kita yang rakus / dan serakah ///',
            expressionNote: 'Pukulan telak pada diri sendiri. Tangan mengarah ke dada. Nada mengutuk keserakahan diri.',
            words: [
              { text: 'Semua' },
              { text: 'ini', pauseAfter: 'short' },
              { text: 'karena' },
              { text: 'kita' },
              { text: 'yang' },
              { text: 'abai', isEmphasized: true, pauseAfter: 'medium' },
              { text: 'kita' },
              { text: 'yang' },
              { text: 'rakus', isEmphasized: true, pauseAfter: 'short' },
              { text: 'dan' },
              { text: 'serakah', isEmphasized: true, pauseAfter: 'long' }
            ]
          }
        ]
      },
      {
        stanzaNumber: 4,
        moodTheme: 'Khusyuk, Tawaduk & Doa Memohon Hikmah',
        voiceGuide: 'Tempo melambat, desah hening, nada doa bergetar dari relung hati yang tulus.',
        lines: [
          {
            id: 'mtt-4-1',
            rawText: 'Tuhan, ampunilah kealpaan kami',
            prosodyMarkedText: 'Tuhan // ampunilah kealpaan kami ///',
            expressionNote: 'Kepala sedikit menengadah lalu merendah khusyuk, kedua telapak tangan atau dada bersikap tawaduk.',
            words: [
              { text: 'Tuhan', isEmphasized: true, pauseAfter: 'medium' },
              { text: 'ampunilah', isEmphasized: true },
              { text: 'kealpaan' },
              { text: 'kami', pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-4-2',
            rawText: 'Berilah kami hikmah untuk membaca tanda-tanda zaman',
            prosodyMarkedText: 'Berilah kami hikmah // untuk membaca tanda-tanda zaman ///',
            expressionNote: 'Mata menatap jernih dan mantap, ada asa perbaikan jiwa.',
            words: [
              { text: 'Berilah' },
              { text: 'kami' },
              { text: 'hikmah', isEmphasized: true, pauseAfter: 'medium' },
              { text: 'untuk' },
              { text: 'membaca', isEmphasized: true },
              { text: 'tanda-tanda' },
              { text: 'zaman', pauseAfter: 'long' }
            ]
          },
          {
            id: 'mtt-4-3',
            rawText: 'Sebelum semuanya terlambat...',
            prosodyMarkedText: 'Sebelum semuanya / terlambat... ///',
            expressionNote: 'Ucapkan kata terakhir perlahan, biarkan keheningan berbicara 3-4 detik sebelum mengakhiri.',
            words: [
              { text: 'Sebelum' },
              { text: 'semuanya', pauseAfter: 'short' },
              { text: 'terlambat...', isEmphasized: true, pauseAfter: 'long' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'karangan-bunga',
    title: 'Karangan Bunga',
    poet: 'Taufiq Ismail',
    year: '1966',
    theme: 'Pengorbanan, Kepahlawanan & Duka Cita',
    synopsis: 'Tiga anak kecil membawa seikat bunga berpita hitam menghormati kakak mahasiswa yang gugur demi kebenaran. Menuntut penghayatan duka yang suci dan ketulusan hati anak-anak.',
    stanzas: [
      {
        stanzaNumber: 1,
        moodTheme: 'Polos, Khidmat, Sentuhan Haru yang Dalam',
        voiceGuide: 'Suara lembut anak-anak, vokal jernih, jeda perenungan yang syahdu.',
        lines: [
          {
            id: 'kb-1-1',
            rawText: 'Tiga anak kecil dalam langkah malu-malu',
            prosodyMarkedText: 'Tiga anak kecil // dalam langkah malu-malu ///',
            expressionNote: 'Sorot mata teduh dan mengharukan, langkah tenang bersahaja.',
            words: [
              { text: 'Tiga', isEmphasized: true },
              { text: 'anak' },
              { text: 'kecil', pauseAfter: 'medium' },
              { text: 'dalam' },
              { text: 'langkah' },
              { text: 'malu-malu', pauseAfter: 'long' }
            ]
          },
          {
            id: 'kb-1-2',
            rawText: 'Datang ke Salemba sore itu',
            prosodyMarkedText: 'Datang ke Salemba // sore itu ///',
            expressionNote: 'Aksen waktu yang menghadirkan suasana senja duka cita.',
            words: [
              { text: 'Datang' },
              { text: 'ke' },
              { text: 'Salemba', isEmphasized: true, pauseAfter: 'medium' },
              { text: 'sore' },
              { text: 'itu', pauseAfter: 'long' }
            ]
          },
          {
            id: 'kb-1-3',
            rawText: 'Ini dari kami bertiga',
            prosodyMarkedText: 'Ini dari kami bertiga //',
            expressionNote: 'Suara pelan penuh kepolosan anak-anak.',
            words: [
              { text: 'Ini' },
              { text: 'dari' },
              { text: 'kami' },
              { text: 'bertiga', isEmphasized: true, pauseAfter: 'medium' }
            ]
          },
          {
            id: 'kb-1-4',
            rawText: 'Pita hitam pada karangan bunga',
            prosodyMarkedText: 'Pita hitam / pada karangan bunga ///',
            expressionNote: 'Tekankan kata "Pita hitam" sebagai lambang duka yang sakral.',
            words: [
              { text: 'Pita' },
              { text: 'hitam', isEmphasized: true, pauseAfter: 'short' },
              { text: 'pada' },
              { text: 'karangan' },
              { text: 'bunga', pauseAfter: 'long' }
            ]
          },
          {
            id: 'kb-1-5',
            rawText: 'Sebab kami ikut berduka',
            prosodyMarkedText: 'Sebab kami / ikut berduka //',
            expressionNote: 'Raut duka yang tulus dari lubuk hati.',
            words: [
              { text: 'Sebab' },
              { text: 'kami', pauseAfter: 'short' },
              { text: 'ikut' },
              { text: 'berduka', isEmphasized: true, pauseAfter: 'medium' }
            ]
          },
          {
            id: 'kb-1-6',
            rawText: 'Bagi kakak yang ditembak mati siang tadi',
            prosodyMarkedText: 'Bagi kakak / yang ditembak mati / siang tadi ///',
            expressionNote: 'Hening sebentar sebelum kata "ditembak mati", akhiri dengan kepedihan berwibawa.',
            words: [
              { text: 'Bagi' },
              { text: 'kakak', pauseAfter: 'short' },
              { text: 'yang' },
              { text: 'ditembak', isEmphasized: true },
              { text: 'mati', isEmphasized: true, pauseAfter: 'short' },
              { text: 'siang' },
              { text: 'tadi', pauseAfter: 'long' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'aku',
    title: 'Aku',
    poet: 'Chairil Anwar',
    year: '1943',
    theme: 'Semangat Kebebasan, Keteguhan Diri & Vitalitas Hidup',
    synopsis: 'Manifesto perjuangan individu yang gigih menentang kungkungan dan kepatuhan buta, memilih menjadi "binatang jalang" yang terus menerjang meski luka demi hidup seribu tahun lagi.',
    stanzas: [
      {
        stanzaNumber: 1,
        moodTheme: 'Pemberontak, Gigih, Tidak Menyerah',
        voiceGuide: 'Intonasi menggelegar, vokal bulat dan tajam, tatapan mata berapi-api.',
        lines: [
          {
            id: 'aku-1-1',
            rawText: 'Kalau sampai waktuku',
            prosodyMarkedText: 'Kalau sampai waktuku //',
            expressionNote: 'Tatapan lurus ke depan, dada membusung siap menantang takdir.',
            words: [
              { text: 'Kalau' },
              { text: 'sampai' },
              { text: 'waktuku', isEmphasized: true, pauseAfter: 'medium' }
            ]
          },
          {
            id: 'aku-1-2',
            rawText: 'Ku mau tak seorang kan merayu',
            prosodyMarkedText: 'Ku mau / tak seorang kan merayu ///',
            expressionNote: 'Penolakan mutlak terhadap belas kasihan.',
            words: [
              { text: 'Ku' },
              { text: 'mau', pauseAfter: 'short' },
              { text: 'tak' },
              { text: 'seorang' },
              { text: 'kan' },
              { text: 'merayu', isEmphasized: true, pauseAfter: 'long' }
            ]
          },
          {
            id: 'aku-1-3',
            rawText: 'Tidak juga kau',
            prosodyMarkedText: 'Tidak juga kau ///',
            expressionNote: 'Tunjuk lurus dengan sorot mata ke sosok terdekat, suara tegas.',
            words: [
              { text: 'Tidak' },
              { text: 'juga' },
              { text: 'kau', isEmphasized: true, pauseAfter: 'long' }
            ]
          },
          {
            id: 'aku-1-4',
            rawText: 'Tak perlu sedu sedan itu',
            prosodyMarkedText: 'Tak perlu / sedu sedan itu ///',
            expressionNote: 'Kibasan penolakan cengeng.',
            words: [
              { text: 'Tak' },
              { text: 'perlu', pauseAfter: 'short' },
              { text: 'sedu' },
              { text: 'sedan' },
              { text: 'itu', isEmphasized: true, pauseAfter: 'long' }
            ]
          },
          {
            id: 'aku-1-5',
            rawText: 'Aku ini binatang jalang',
            prosodyMarkedText: 'Aku ini / binatang jalang //',
            expressionNote: 'Kekuatan penuh dari diafragma, vokal meledak gagah.',
            words: [
              { text: 'Aku' },
              { text: 'ini', pauseAfter: 'short' },
              { text: 'binatang', isEmphasized: true },
              { text: 'jalang', isEmphasized: true, pauseAfter: 'medium' }
            ]
          },
          {
            id: 'aku-1-6',
            rawText: 'Dari kumpulannya terbuang',
            prosodyMarkedText: 'Dari kumpulannya terbuang ///',
            expressionNote: 'Kesendirian yang tidak membuat ciut, melainkan semakin liar membaja.',
            words: [
              { text: 'Dari' },
              { text: 'kumpulannya' },
              { text: 'terbuang', isEmphasized: true, pauseAfter: 'long' }
            ]
          }
        ]
      }
    ]
  }
];

// Helper function to auto-parse custom user poem into prosody format
export function parseCustomPoemText(title: string, poet: string, rawText: string): Poem {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  const poemLines = lines.map((line, idx) => {
    // Add default pauses
    let marked = line;
    if (marked.endsWith('.')) {
      marked = marked.replace(/\.+$/, '') + ' ///';
    } else if (marked.endsWith(',')) {
      marked = marked.replace(/,+$/, '') + ' //';
    } else {
      marked = marked + ' /';
    }

    const words = line.split(/\s+/).map((word, wIdx) => {
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      return {
        text: cleanWord,
        isEmphasized: cleanWord.length > 6 || wIdx === 0,
        pauseAfter: wIdx === line.split(/\s+/).length - 1 ? ('medium' as const) : undefined
      };
    });

    return {
      id: `custom-line-${idx + 1}`,
      rawText: line,
      prosodyMarkedText: marked,
      expressionNote: 'Lafalkan dengan intonasi jelas, jaga tatapan mata ke hadapan audiens.',
      words
    };
  });

  return {
    id: `custom-${Date.now()}`,
    title: title || 'Puisi Latihan Siswa',
    poet: poet || 'Siswa SMP',
    theme: 'Karya Siswa',
    synopsis: 'Teks puisi kustom untuk latihan pembacaan di panggung IFP.',
    stanzas: [
      {
        stanzaNumber: 1,
        moodTheme: 'Latihan Ekspresi & Penghayatan Mandiri',
        voiceGuide: 'Sesuaikan ritme dan dinamika vokal dengan bait puisi.',
        lines: poemLines
      }
    ]
  };
}
