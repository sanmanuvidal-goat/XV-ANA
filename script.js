// ==========================================
// CONFIGURACIÓN E INICIALIZACIÓN
// ==========================================

// PEGÁ ACÁ LA URL QUE TE DIO GOOGLE APPS SCRIPT (Entre las comillas):
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxRs-U1pAbWrsUAcLU-ejMDPBK1JX6dHTD75oShS5zfe4hmDT4jQfDMab0NzrNk0Nw73w/exec';

// Definimos la fecha objetivo (31 de Octubre a las 20:30 hs)
const currentYear = new Date().getFullYear();
const targetDate = new Date(currentYear, 9, 31, 20, 30, 0).getTime();

// Elementos del DOM
const btnMap = document.getElementById('btn-map');
const mapModal = document.getElementById('map-modal');
const closeModal = document.getElementById('close-modal');

const btnAccount = document.getElementById('btn-account');
const accountModal = document.getElementById('account-modal');
const closeAccountModal = document.getElementById('close-account-modal');

const rsvpForm = document.getElementById('rsvp-form');
const rsvpStatus = document.getElementById('rsvp-status');


// ==========================================
// CONTADOR / TIMER
// ==========================================
function updateCountdown() {
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? `0${days}` : days;
    document.getElementById('hours').innerText = hours < 10 ? `0${hours}` : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? `0${minutes}` : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? `0${seconds}` : seconds;
  } else {
    document.getElementById('days').innerText = '00';
    document.getElementById('hours').innerText = '00';
    document.getElementById('minutes').innerText = '00';
    document.getElementById('seconds').innerText = '00';
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();


// ==========================================
// MODAL GOOGLE MAPS
// ==========================================
if (btnMap && mapModal && closeModal) {
  btnMap.addEventListener('click', () => {
    mapModal.classList.add('active');
  });

  closeModal.addEventListener('click', () => {
    mapModal.classList.remove('active');
  });

  mapModal.addEventListener('click', (event) => {
    if (event.target === mapModal) {
      mapModal.classList.remove('active');
    }
  });
}


// ==========================================
// MODAL REGALOS / CUENTA BANCARIA
// ==========================================
if (btnAccount && accountModal && closeAccountModal) {
  btnAccount.addEventListener('click', () => {
    accountModal.classList.add('active');
  });

  closeAccountModal.addEventListener('click', () => {
    accountModal.classList.remove('active');
  });

  accountModal.addEventListener('click', (event) => {
    if (event.target === accountModal) {
      accountModal.classList.remove('active');
    }
  });
}


// ==========================================
// FORMULARIO RSVP CONECTADO A GOOGLE SHEETS
// ==========================================
if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = rsvpForm.querySelector('.btn-rsvp');
    btn.innerText = 'ENVIANDO...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // Recolectar datos
    const formData = {
      fullName: document.getElementById('fullName').value,
      attendance: document.querySelector('input[name="attendance"]:checked').value,
      diet: document.getElementById('diet').value,
      song: document.getElementById('song').value
    };

    // Envío a Google Apps Script
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(() => {
      // Estado temporal de confirmación exitosa
      btn.innerText = '¡CONFIRMADO!';
      btn.style.backgroundColor = '#2e7d32'; // Verde éxito
      btn.style.opacity = '1';

      rsvpStatus.innerText = `¡Muchas gracias ${formData.fullName}! Tu respuesta fue registrada.`;
      rsvpForm.reset(); // Limpia los inputs

      // Al cabo de 4 segundos restaura el botón para otra confirmación
      setTimeout(() => {
        btn.innerText = 'CONFIRMAR';
        btn.style.backgroundColor = ''; // Restaura el color original en CSS
        btn.disabled = false;           // Vuelve a habilitar el botón
        rsvpStatus.innerText = '';       // Limpia el mensaje
      }, 4000);
    })
    .catch(error => {
      console.error('Error al enviar:', error);
      btn.innerText = 'REINTENTAR';
      btn.style.opacity = '1';
      btn.disabled = false;
      rsvpStatus.innerText = 'Hubo un inconveniente al guardar. Por favor reintentá.';
    });
  });
}