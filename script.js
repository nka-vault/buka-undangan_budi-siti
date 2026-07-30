let musik = document.getElementById("lagu-latar");
let ikonMusik = document.getElementById("kontrol-musik");
let lagiMuter = true;
let undanganDibuka = false;

// Fungsi saat tombol "Buka Undangan" diklik
function bukaUndangan() {
  let sampul = document.getElementById("sampul-depan");
  let body = document.getElementById("halaman-utama");
  document.querySelector('.wadah-scroll').style.display = 'block';

  sampul.classList.add("tarik-ke-atas");
  body.style.overflowY = "auto";
  undanganDibuka = true;

  if (musik) {
    musik.play();
  }
  
  if (ikonMusik) {
    ikonMusik.style.display = "flex"; 
  }
}

// Fungsi kontrol Pause/Play musik di pojok
function aturMusik() {
  if (lagiMuter) {
    musik.pause(); 
    ikonMusik.classList.remove("muter"); 
  } else {
    musik.play(); 
    ikonMusik.classList.add("muter"); 
  }
  lagiMuter = !lagiMuter; 
}

// Fitur Auto-Pause saat pindah tab browser
document.addEventListener("visibilitychange", function() {
  if (undanganDibuka) {
    if (document.hidden) {
      musik.pause();
      ikonMusik.classList.remove("muter");
    } else {
      if (lagiMuter) {
        musik.play();
        ikonMusik.classList.add("muter");
      }
    }
  }
});

// Fitur Salin Rekening
function salinRekening(idRekening, idTombol) {
  let teksNomor = document.getElementById(idRekening).innerText;
  navigator.clipboard.writeText(teksNomor);

  let tombol = document.getElementById(idTombol);
  let teksAsli = tombol.innerText;
  
  tombol.innerText = "✅ Berhasil Disalin!";
  setTimeout(function() {
    tombol.innerText = teksAsli;
  }, 2000);
}

// Fitur Salin Alamat
function salinAlamat(idAlamat, idTombol) {
  let teksAlamat = document.getElementById(idAlamat).innerText;
  navigator.clipboard.writeText(teksAlamat);

  let tombol = document.getElementById(idTombol);
  let teksAsli = tombol.innerText;
  
  tombol.innerText = "✅ Alamat Berhasil Disalin!";
  setTimeout(function() {
    tombol.innerText = teksAsli;
  }, 2000);
}

// Fitur Kirim Ucapan & Kehadiran
function kirimUcapan() {
  let nama = document.getElementById("input-nama").value.trim();
  let pesan = document.getElementById("input-pesan").value.trim();
  let kehadiran = document.getElementById("input-kehadiran").value;

  if (nama === "" || pesan === "") {
    alert("Mohon isi Nama dan Pesan terlebih dahulu ya!");
    return;
  }

  let daftar = document.getElementById("daftar-ucapan");

  let kelasBadge = "hadir";
  if (kehadiran === "Tidak Hadir") {
    kelasBadge = "tidak-hadir";
  } else if (kehadiran === "Masih Ragu") {
    kelasBadge = "masih-ragu";
  }

  let kartuBaru = document.createElement("div");
  kartuBaru.classList.add("kartu-komentar");

  kartuBaru.innerHTML = `
    <div class="komentar-header">
      <strong>${nama}</strong>
      <span class="badge-hadir ${kelasBadge}">${kehadiran}</span>
    </div>
    <p class="komentar-pesan">${pesan}</p>
  `;

  daftar.prepend(kartuBaru);

  document.getElementById("input-nama").value = "";
  document.getElementById("input-pesan").value = "";

  alert("Terima kasih! Ucapan dan konfirmasi kehadiran Anda berhasil dikirim.");
}

// ==========================================
// FITUR BARU: TOMBOL KEMBALI KE ATAS
// ==========================================
function kembaliKeAtas() {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // Efek geser pelan-pelan ke atas
  });
}
// --- FITUR HITUNG MUNDUR (COUNTDOWN) ---
// Ganti tanggal di bawah sesuai hari H pernikahan (Bulan Tanggal, Tahun Jam:Menit:Detik)
const tanggalPernikahan = new Date("Dec 12, 2026 08:00:00").getTime();

const hitungMundur = setInterval(function() {
  const sekarang = new Date().getTime();
  const selisih = tanggalPernikahan - sekarang;

  // Rumus matematika kalkulasi waktu
  const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
  const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
  const detik = Math.floor((selisih % (1000 * 60)) / 1000);

  // Lempar hasilnya ke HTML
  document.getElementById("hari").innerHTML = hari;
  document.getElementById("jam").innerHTML = jam;
  document.getElementById("menit").innerHTML = menit;
  document.getElementById("detik").innerHTML = detik;

  // Aksi kalau waktu sudah habis (hari H tiba)
  if (selisih < 0) {
    clearInterval(hitungMundur);
    document.getElementById("hari").innerHTML = "00";
    document.getElementById("jam").innerHTML = "00";
    document.getElementById("menit").innerHTML = "00";
    document.getElementById("detik").innerHTML = "00";
  }
}, 1000); // Mesin berdetak setiap 1000 milidetik (1 detik)
// ==========================================
// --- FITUR KIRIM UCAPAN (KE GOOGLE SHEETS) ---
// ==========================================
function kirimUcapan() {
  // Ambil data dari kolom input
  const nama = document.getElementById('input-nama').value;
  const pesan = document.getElementById('input-pesan').value;
  const kehadiran = document.getElementById('input-kehadiran').value;

  // Cek kalau nama atau pesan masih kosong
  if (nama === '' || pesan === '') {
    alert('Nama dan pesan ucapan harus diisi dulu ya!');
    return;
  }

  // Ambil tombol buat diubah teksnya jadi loading
  const tombolKirim = document.querySelector('.tombol-coklat[onclick="kirimUcapan()"]');
  tombolKirim.innerHTML = 'MENGIRIM... ⏳';
  tombolKirim.disabled = true;

  // Link Web App Google Script lu
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxqCTZbBAHjj-MeGHQYa3Sm6gIgYCsjr8a3lRQ73GyuWBV-mLjR9zHsZm6h02I9sSerrQ/exec';
  
  // Susun data yang mau dikirim
  const data = new URLSearchParams();
  data.append('nama', nama);
  data.append('pesan', pesan);
  data.append('kehadiran', kehadiran);

  // Proses kirim ke Google Sheets
  fetch(scriptURL, {
    method: 'POST',
    body: data,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    }
  })
  .then(response => response.text())
  .then(result => {
    // Balikin tombol kayak semula
    tombolKirim.innerHTML = 'KIRIMKAN UCAPAN';
    tombolKirim.disabled = false;

    // --- FITUR NAMPILIN KOMENTAR LANGSUNG ---
    const tempatUcapan = document.getElementById('daftar-ucapan');
    
    // Nentuin warna badge sesuai pilihan kehadiran
    let kelasBadge = 'hadir';
    if (kehadiran === 'Tidak Hadir') kelasBadge = 'tidak-hadir';
    if (kehadiran === 'Masih Ragu') kelasBadge = 'ragu';

    // Bikin elemen kartu komentar baru
    const kartuKomentarBaru = `
      <div class="kartu-komentar">
        <div class="komentar-header">
          <strong>${nama}</strong>
          <span class="badge-hadir ${kelasBadge}">${kehadiran}</span>
        </div>
        <p class="komentar-pesan">${pesan}</p>
      </div>
    `;
    
    // Masukin komentar baru ke posisi paling atas
    tempatUcapan.insertAdjacentHTML('afterbegin', kartuKomentarBaru);

    // Bersihin form setelah sukses terkirim
    document.getElementById('input-nama').value = '';
    document.getElementById('input-pesan').value = '';
    document.getElementById('input-kehadiran').value = 'Hadir';

    alert('Yeay! Ucapan dan doa restu berhasil dikirim!');
  })
  .catch(error => {
    console.error('Error!', error.message);
    tombolKirim.innerHTML = 'KIRIMKAN UCAPAN';
    tombolKirim.disabled = false;
    alert('Waduh, gagal ngirim nih. Pastikan internet lancar dan coba lagi ya!');
  });
}
// ==========================================
// --- FITUR BACA UCAPAN SAAT WEB DIBUKA ---
// ==========================================

// Masukin Link API lu yang tadi
const URL_API_GOOGLE = 'https://script.google.com/macros/s/AKfycbzpBX39otw-6r5PHU-_axaTlRoUn6URoacH5VpZyeOBQMIQqC-QloJDM6o3eTovY5urpg/exec';

// Jalankan fungsi ini otomatis pas web selesai loading
window.addEventListener('load', function() {
  ambilDataUcapan();
});

function ambilDataUcapan() {
  const tempatUcapan = document.getElementById('daftar-ucapan');
  
  // Munculin teks loading sementara
  tempatUcapan.innerHTML = '<p style="text-align:center; font-family: sans-serif; font-size: 14px;">Memuat doa dan ucapan...</p>';

  // Proses tarik data dari Google Sheets
  fetch(URL_API_GOOGLE)
    .then(response => response.json())
    .then(data => {
      // Bersihkan teks loading
      tempatUcapan.innerHTML = '';

      // Balik urutan data biar komentar paling baru ada di paling atas
      data.reverse().forEach(item => {
        let kelasBadge = 'hadir';
        if (item.kehadiran === 'Tidak Hadir') kelasBadge = 'tidak-hadir';
        if (item.kehadiran === 'Masih Ragu') kelasBadge = 'ragu';

        // Bikin struktur HTML buat tiap komentar
        const kartuKomentar = `
          <div class="kartu-komentar">
            <div class="komentar-header">
              <strong>${item.nama}</strong>
              <span class="badge-hadir ${kelasBadge}">${item.kehadiran}</span>
            </div>
            <p class="komentar-pesan">${item.pesan}</p>
          </div>
        `;
        
        // Masukin ke dalam daftar
        tempatUcapan.insertAdjacentHTML('beforeend', kartuKomentar);
      });
    })
    .catch(error => {
      console.error('Error!', error);
      tempatUcapan.innerHTML = '<p style="text-align:center; color: red;">Gagal memuat ucapan.</p>';
    });
} 
// ==========================================
// --- MESIN PENGGERAK ANIMASI SCROLL REVEAL ---
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
  const pilihanObserver = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15 // Animasi bakal jalan kalau elemen udah nampak 15% di layar HP
  };

  const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('tampil'); // Tambahin kelas 'tampil'
        // observer.unobserve(entry.target); // (Opsional) Biar animasinya cuma main sekali tiap di-scroll
      }
    });
  }, pilihanObserver);

  // Daftarkan semua elemen yang punya kelas 'animasi-muncul'
  const targetAnimasi = document.querySelectorAll('.animasi-muncul');
  targetAnimasi.forEach(el => {
    observer.observe(el);
  });
});
// ==========================================
// --- FUNGSI BUKA & TUTUP LIGHTBOX GALERI ---
// ==========================================
function bukaLightbox(srcGambar) {
  const lightbox = document.getElementById('lightbox-modal');
  const gambarModal = document.getElementById('lightbox-img-terpilih');
  
  lightbox.style.display = 'block';
  gambarModal.src = srcGambar;
  
  // Kunci scroll background web utama biar gak ikut gerak-gerik
  document.body.style.overflow = 'hidden';
}

function tutupLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  lightbox.style.display = 'none';
  
  // Kembalikan fungsi scroll web utama
  document.body.style.overflow = 'auto';
}