let musik = document.getElementById("lagu-latar");
let ikonMusik = document.getElementById("kontrol-musik");
let lagiMuter = true;
let undanganDibuka = false;

// ==========================================
// URL API GOOGLE APPS SCRIPT (Satu URL Utama)
// ==========================================
const URL_API_GOOGLE = 'https://script.google.com/macros/s/AKfycbxd6JYqowBupJtPuObnrGAfPWbqQcHzaB7oHHQGcrl9GNf4fg0JE5htfZigM6kDjl_CLA/exec';

// ==========================================
// 1. FUNGSI UTAMA UNDANGAN & MUSIK
// ==========================================
function bukaUndangan() {
  let sampul = document.getElementById("sampul-depan");
  let body = document.getElementById("halaman-utama");
  let wadahScroll = document.querySelector('.wadah-scroll');
  
  if (wadahScroll) wadahScroll.style.display = 'block';
  if (sampul) sampul.classList.add("tarik-ke-atas");
  if (body) body.style.overflowY = "auto";
  
  undanganDibuka = true;

  if (musik) musik.play();
  if (ikonMusik) ikonMusik.style.display = "flex"; 
}

function aturMusik() {
  if (!musik || !ikonMusik) return;
  
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
  if (undanganDibuka && musik && ikonMusik) {
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

// ==========================================
// 2. FITUR SALIN REKENING & ALAMAT
// ==========================================
function salinRekening(idRekening, idTombol) {
  let elemRek = document.getElementById(idRekening);
  let tombol = document.getElementById(idTombol);
  if (!elemRek || !tombol) return;

  navigator.clipboard.writeText(elemRek.innerText);

  let teksAsli = tombol.innerText;
  tombol.innerText = "✅ Berhasil Disalin!";
  setTimeout(function() {
    tombol.innerText = teksAsli;
  }, 2000);
}

function salinAlamat(idAlamat, idTombol) {
  let elemAlamat = document.getElementById(idAlamat);
  let tombol = document.getElementById(idTombol);
  if (!elemAlamat || !tombol) return;

  navigator.clipboard.writeText(elemAlamat.innerText);

  let teksAsli = tombol.innerText;
  tombol.innerText = "✅ Alamat Berhasil Disalin!";
  setTimeout(function() {
    tombol.innerText = teksAsli;
  }, 2000);
}

function kembaliKeAtas() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ==========================================
// 3. FITUR HITUNG MUNDUR (COUNTDOWN)
// ==========================================
const tanggalPernikahan = new Date("2026-08-15T08:00:00").getTime();

const hitungMundur = setInterval(function() {
  const sekarang = new Date().getTime();
  const selisih = tanggalPernikahan - sekarang;

  const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
  const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
  const detik = Math.floor((selisih % (1000 * 60)) / 1000);

  if (document.getElementById("hari")) document.getElementById("hari").innerHTML = hari;
  if (document.getElementById("jam")) document.getElementById("jam").innerHTML = jam;
  if (document.getElementById("menit")) document.getElementById("menit").innerHTML = menit;
  if (document.getElementById("detik")) document.getElementById("detik").innerHTML = detik;

  if (selisih < 0) {
    clearInterval(hitungMundur);
    if (document.getElementById("hari")) document.getElementById("hari").innerHTML = "00";
    if (document.getElementById("jam")) document.getElementById("jam").innerHTML = "00";
    if (document.getElementById("menit")) document.getElementById("menit").innerHTML = "00";
    if (document.getElementById("detik")) document.getElementById("detik").innerHTML = "00";
  }
}, 1000);

// ==========================================
// 4. FITUR KIRIM UCAPAN (KE GOOGLE SHEETS)
// ==========================================
function kirimUcapan() {
  const inputNama = document.getElementById('input-nama');
  const inputPesan = document.getElementById('input-pesan');
  const inputKehadiran = document.getElementById('input-kehadiran');

  if (!inputNama || !inputPesan) return;

  const nama = inputNama.value.trim();
  const pesan = inputPesan.value.trim();
  const kehadiran = inputKehadiran ? inputKehadiran.value : 'Hadir';

  if (nama === '' || pesan === '') {
    alert('Nama dan pesan ucapan harus diisi dulu ya!');
    return;
  }

  const tombolKirim = document.querySelector('.tombol-coklat[onclick="kirimUcapan()"]');
  if (tombolKirim) {
    tombolKirim.innerHTML = 'MENGIRIM... ⏳';
    tombolKirim.disabled = true;
  }

  const data = new URLSearchParams();
  data.append('nama', nama);
  data.append('pesan', pesan);
  data.append('kehadiran', kehadiran);

  fetch(URL_API_GOOGLE, {
    method: 'POST',
    body: data,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    }
  })
  .then(response => response.text())
  .then(result => {
    if (tombolKirim) {
      tombolKirim.innerHTML = 'KIRIMKAN UCAPAN';
      tombolKirim.disabled = false;
    }

    const tempatUcapan = document.getElementById('daftar-ucapan');
    if (tempatUcapan) {
      let kelasBadge = 'hadir';
      if (kehadiran === 'Tidak Hadir') kelasBadge = 'tidak-hadir';
      if (kehadiran === 'Masih Ragu') kelasBadge = 'ragu';

      const kartuKomentarBaru = `
        <div class="kartu-komentar">
          <div class="komentar-header">
            <strong>${nama}</strong>
            <span class="badge-hadir ${kelasBadge}">${kehadiran}</span>
          </div>
          <p class="komentar-pesan">${pesan}</p>
        </div>
      `;
      tempatUcapan.insertAdjacentHTML('afterbegin', kartuKomentarBaru);
    }

    inputNama.value = '';
    inputPesan.value = '';
    if (inputKehadiran) inputKehadiran.value = 'Hadir';

    alert('Yeay! Ucapan dan doa restu berhasil dikirim!');
  })
  .catch(error => {
    console.error('Error!', error.message);
    if (tombolKirim) {
      tombolKirim.innerHTML = 'KIRIMKAN UCAPAN';
      tombolKirim.disabled = false;
    }
    alert('Waduh, gagal ngirim nih. Pastikan internet lancar dan coba lagi ya!');
  });
}

// ==========================================
// 5. FITUR BACA UCAPAN SAAT WEB DIBUKA
// ==========================================
window.addEventListener('load', function() {
  ambilDataUcapan();
});

function ambilDataUcapan() {
  const tempatUcapan = document.getElementById('daftar-ucapan');
  if (!tempatUcapan) return;

  tempatUcapan.innerHTML = '<p style="text-align:center; font-family: sans-serif; font-size: 14px;">Memuat doa dan ucapan...</p>';

  fetch(URL_API_GOOGLE)
    .then(response => response.json())
    .then(data => {
      tempatUcapan.innerHTML = '';

      if (!data || data.length === 0) {
        tempatUcapan.innerHTML = '<p style="text-align:center; font-size: 13px; color: #777;">Belum ada ucapan. Jadilah yang pertama!</p>';
        return;
      }

      data.reverse().forEach(item => {
        // Ambil data array [Nama, Kehadiran, Pesan] atau fallback ke Object
        const nama = item[0] || item.nama || 'Anonim';
        const kehadiran = item[1] || item.kehadiran || 'Hadir';
        const pesan = item[2] || item.pesan || '-';

        let kelasBadge = 'hadir';
        if (kehadiran === 'Tidak Hadir') kelasBadge = 'tidak-hadir';
        if (kehadiran === 'Masih Ragu') kelasBadge = 'ragu';

        const kartuKomentar = `
          <div class="kartu-komentar">
            <div class="komentar-header">
              <strong>${nama}</strong>
              <span class="badge-hadir ${kelasBadge}">${kehadiran}</span>
            </div>
            <p class="komentar-pesan">${pesan}</p>
          </div>
        `;
        
        tempatUcapan.insertAdjacentHTML('beforeend', kartuKomentar);
      });
    })
    .catch(error => {
      console.error('Error!', error);
      tempatUcapan.innerHTML = '<p style="text-align:center; color: red;">Gagal memuat ucapan.</p>';
    });
}

// ==========================================
// 6. SCROLL REVEAL & LIGHTBOX
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
  const pilihanObserver = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('tampil');
      }
    });
  }, pilihanObserver);

  const targetAnimasi = document.querySelectorAll('.animasi-muncul');
  targetAnimasi.forEach(el => {
    observer.observe(el);
  });
});

function bukaLightbox(srcGambar) {
  const lightbox = document.getElementById('lightbox-modal');
  const gambarModal = document.getElementById('lightbox-img-terpilih');
  
  if (lightbox && gambarModal) {
    lightbox.style.display = 'block';
    gambarModal.src = srcGambar;
    document.body.style.overflow = 'hidden';
  }
}

function tutupLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}