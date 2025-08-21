// Bu bölümü kaldırın, çünkü aşağıdaki kod zaten aynı işlemi yapıyor.
// fetch('data.json')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Dosya yüklenemedi:' + response.statusText); 
//     }
//     return response.json();
//   })
//   .then(name => {
//     console.log("Harici JSON Verisi:");
//     console.log(name);
//   })
//   .catch(error => {
//     console.error('Hata:', error);
//   });


// HTML elementlerini seçme
const mainContentDiv = document.querySelector('.main-content');
const allButton = document.getElementById('filter-all');
const activeButton = document.getElementById('filter-active');
const inactiveButton = document.getElementById('filter-inactive');

let extensionsData = []; // Veriyi saklayacağımız global değişken

// JSON verisini çekme ve sayfanın başlangıç durumunu ayarlama
fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Dosya yüklenemedi');
    }
    return response.json();
  })
  .then(data => {
    extensionsData = data; // Veriyi global değişkene ata
    displayExtensions(extensionsData); // Başlangıçta tüm verileri göster
    
    // Butonlara olay dinleyicileri ekleme
    allButton.addEventListener('click', () => {
      setActiveButton(allButton);
      displayExtensions(extensionsData); // Tüm verileri gönder
    });

    activeButton.addEventListener('click', () => {
      setActiveButton(activeButton);
      const activeExtensions = extensionsData.filter(ext => ext.isActive);
      displayExtensions(activeExtensions);
    });

    inactiveButton.addEventListener('click', () => {
      setActiveButton(inactiveButton);
      const inactiveExtensions = extensionsData.filter(ext => !ext.isActive);
      displayExtensions(inactiveExtensions);
    });
  })
  .catch(error => {
    console.error('Veri çekme hatası:', error);
  });

// Eklentileri HTML'de gösteren fonksiyon
function displayExtensions(extensions) {
  mainContentDiv.innerHTML = ''; // Önceki içeriği temizle

  if (extensions.length === 0) {
      mainContentDiv.innerHTML = '<p class="no-results">Sonuç bulunamadı.</p>';
      return;
  }

  extensions.forEach(extension => {
    const boxDiv = document.createElement('div');
    boxDiv.className = 'box';

    boxDiv.innerHTML = `
      <div class="box-top">
        <div class="box-left">
          <img style="width: 64px; height: 64px;" src="${extension.logo}" alt="${extension.name} logo">
          <div class="text-content">
            <h2>${extension.name}</h2>
            <p>${extension.description}</p>
          </div>
        </div>
      </div>
      <div class="box-bottom">
        <button class="remove-btn">Remove</button>
        <label class="switch">
            <input type="checkbox" ${extension.isActive ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
      </div>
    `;
    mainContentDiv.appendChild(boxDiv);
  });
}

// Butonların aktif/pasif görünümünü yöneten fonksiyon
function setActiveButton(clickedButton) {
  // Tüm butonlardan 'active-filter' sınıfını kaldır
  const buttons = [allButton, activeButton, inactiveButton];
  buttons.forEach(btn => btn.classList.remove('active-filter'));
  
  // Tıklanan butona 'active-filter' sınıfını ekle
  clickedButton.classList.add('active-filter');
}