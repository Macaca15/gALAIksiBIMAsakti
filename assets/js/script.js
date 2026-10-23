// Konfigurasi Inisial (AOS & Lightbox)
AOS.init();
lightbox.option({
  'alwaysShowNavOnTouchDevices': true,
  'wrapAround': true
});

// Setup Elemen Audio & Video
const audio = document.querySelector('.audio');
const doorSound = document.getElementById('doorSound');
let isPlaying = true;

// Fungsi Mulai / Buka Undangan
function mulai() {
  window.scrollTo(0, 0);
  if (doorSound) doorSound.play();

  const doorSection = $('#door-section');
  
  setTimeout(() => {
    if (audio) audio.play();
    doorSection.css({
      'transition': 'transform 0.5s linear',
      'transform': 'scale(6)'
    });
  }, 600);

  setTimeout(() => {
    doorSection.css('opacity', 0);
    $('body').removeClass('overflow-hidden').addClass('transition');
    doorSection.css('display', 'none');
    // Menghapus class hidden agar navbar muncul dengan animasi CSS
    $('.nav').removeClass('navbar-hidden');
  }, 2000);
}

// Fungsi Toggle Musik
function toggleMusic(event) {
  event.preventDefault();
  const musicButton = document.getElementById('musicButton');

  if (isPlaying) {
    musicButton.innerHTML = '<i class="fas fa-fw fa-pause"></i>';
    musicButton.classList.remove('rotate');
    musicButton.style.transform = 'translateY(0)';
    audio.pause();
  } else {
    musicButton.innerHTML = '<i class="fas fa-fw fa-compact-disc"></i>';
    musicButton.classList.add('rotate');
    audio.play();
  }
  isPlaying = !isPlaying;
}

// Countdown Pernikahan
const countDownDate = new Date("Dec 20, 2026 08:00:00").getTime();
const countdownTimer = setInterval(() => {
  const now = new Date().getTime();
  const distance = countDownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const countdownEl = document.getElementById('countdown-wedding');
  
  if (countdownEl) {
    countdownEl.innerHTML = `
      <div class="col-lg-1 col-3"><div class="text-center p-2 rounded text-light"><h5>${days}</h5> Hari</div></div>
      <div class="col-lg-1 col-3"><div class="text-center p-2 rounded text-light"><h5>${hours}</h5> Jam</div></div>
      <div class="col-lg-1 col-3"><div class="text-center p-2 rounded text-light"><h5>${minutes}</h5> Menit</div></div>
      <div class="col-lg-1 col-3"><div class="text-center p-2 rounded text-light"><h5>${seconds}</h5> Detik</div></div>
    `;

    if (distance < 0) {
      clearInterval(countdownTimer);
      countdownEl.innerHTML = "<span class='text-center p-3 rounded text-light m-2'><h2>Sudah dimulai!</h2></span>";
    }
  }
}, 1000);

// Set Nama Tamu dari Parameter URL (?p=Bapak&n=Budi)
const urlParams = new URLSearchParams(window.location.search);
const pronoun = urlParams.get('p') || 'Bapak/Ibu/Saudara/i';
const name = urlParams.get('n') || 'Tamu Undangan';
const namaSambutan = document.querySelector('#namaSambutan');

if (namaSambutan) {
  namaSambutan.innerText = `${pronoun} ${name},`;
}
// Logika Memunculkan Bagian Khusus Pemangku Hajat
// Mengambil parameter 'k' dari URL (contoh: ?k=keluarga)
const kodeKhusus = urlParams.get('k');
const sesiKhusus = document.getElementById('sesi-khusus');

// Jika kodenya adalah "keluarga", maka hapus class d-none agar bagian tersebut muncul
if (kodeKhusus === 'keluarga' && sesiKhusus) {
  sesiKhusus.classList.remove('d-none');
}

// Fungsi Copy Text (Clipboard API)
function copyText(el) {
  const content = jQuery(el).siblings('div.card-container').find('div.card-number').text().trim().replace(/\s+/g, '');
  
  navigator.clipboard.writeText(content).then(() => {
    jQuery(el).text('Berhasil dicopy');
    setTimeout(() => {
      jQuery(el).html(`<i class="fas fa-regular fa-copy"></i> Copy`);
    }, 2000);
  }).catch(err => {
    console.error('Gagal menyalin teks: ', err);
  });
}

// ==========================================
// KONFIGURASI SPREADSHEET UCAPAN
// ==========================================
const wishScriptURL = 'https://script.google.com/macros/s/AKfycbwqAVbvU3TbbL8-HaHDKUiB0_ewxVlzK6hiDIJbiEoKwMDWs20Yj-pmgWjUQA8TEAJu0g/exec'; 

// Fungsi untuk Mengambil Data Ucapan dari Spreadsheet
async function loadUcapan() {
  const wishList = document.getElementById('wishList');
  const loadingUcapan = document.getElementById('loadingUcapan');
  const totalUcapan = document.getElementById('totalUcapan');

  if (!wishList) return;
  
  loadingUcapan.classList.remove('d-none');
  wishList.innerHTML = '';

  try {
    const response = await fetch(wishScriptURL);
    const data = await response.json();
    
    loadingUcapan.classList.add('d-none');
    totalUcapan.innerText = `${data.length} Ucapan`;

    // Reverse array agar ucapan terbaru berada di paling atas
    data.reverse().forEach(item => {
      const wishItemHTML = `
        <div class="wish-item p-3 mb-3 border rounded shadow-sm bg-white" data-aos="fade-up">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0 text-pink"><i class="fas fa-user-circle me-1"></i> ${item.nama}</h6>
            <small class="text-muted" style="font-size: 0.75rem;"><i class="fas fa-clock"></i> ${item.tanggal}</small>
          </div>
          <p class="mb-0 text-dark" style="font-size: 0.95rem;">${item.ucapan}</p>
        </div>
      `;
      wishList.insertAdjacentHTML('beforeend', wishItemHTML);
    });
  } catch (error) {
    loadingUcapan.classList.add('d-none');
    wishList.innerHTML = '<p class="text-center text-danger"><i class="fas fa-exclamation-triangle"></i> Gagal memuat ucapan. Silakan muat ulang halaman.</p>';
    console.error('Error fetching wishes:', error);
  }
}

// ==========================================
// EVENT LISTENERS (Dijalankan setelah halaman dimuat)
// ==========================================
window.addEventListener("load", () => {
  
  // 1. Tampilkan ucapan saat web pertama dibuka
  loadUcapan();

  // 2. RSVP Form Handler
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const status = document.getElementById('status').value;
      const nama = document.getElementById('nama').value.trim();

      if (nama === "") {
        Swal.fire({ icon: "error", text: "Nama harus diisi!" });
        return;
      }

      if (status === "0") {
        Swal.fire({ icon: "error", text: "Pilih salah satu status terlebih dahulu!" });
        return;
      }

      const data = new FormData(rsvpForm);
      const action = e.target.action;
      const inputs = rsvpForm.querySelectorAll('input, select, button');
      
      inputs.forEach(input => input.disabled = true);

      fetch(action, { method: 'POST', body: data })
        .then(() => {
          Swal.fire({ icon: "success", text: "Konfirmasi kehadiran Anda berhasil terkirim!" });
          rsvpForm.reset();
        })
        .catch((error) => {
          Swal.fire({ icon: "error", text: "Terjadi kesalahan, silahkan coba lagi." });
        })
        .finally(() => {
          inputs.forEach(input => input.disabled = false);
        });
    });
  }

  // 3. Wish Form (Ucapan) Handler
  const wishForm = document.getElementById('wishForm');
  const btnWishSubmit = document.getElementById('btnWishSubmit');
  
  if (wishForm) {
    wishForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      btnWishSubmit.disabled = true;
      btnWishSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

      const formData = new FormData(wishForm);

      fetch(wishScriptURL, { method: 'POST', body: formData })
        .then(response => {
          Swal.fire({
            icon: "success",
            title: "Terima Kasih!",
            text: "Ucapan dan Doa Anda berhasil dikirim.",
            confirmButtonColor: "var(--pink)"
          });
          wishForm.reset();
          loadUcapan(); // Refresh daftar ucapan seketika setelah berhasil
        })
        .catch(error => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Gagal mengirim ucapan! Pastikan koneksi internet stabil."
          });
          console.error('Error submitting wish:', error);
        })
        .finally(() => {
          btnWishSubmit.disabled = false;
          btnWishSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Ucapan';
        });
    });
  }
});