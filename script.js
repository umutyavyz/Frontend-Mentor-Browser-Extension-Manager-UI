const mainContentDiv = document.querySelector('.main-content');
const allButton = document.getElementById('filter-all');
const activeButton = document.getElementById('filter-active');
const inactiveButton = document.getElementById('filter-inactive');

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const logoImage = document.getElementById('logo-image');

let extensionsData = [];

// ----------------------------------------------------
// Uygulama Başlangıcında Veri Yükleme
// ----------------------------------------------------

function checkTheme(){
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme')
        logoImage.src = 'images/logo.svg';
    }
}

function toggleTheme() {
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        localStorage.setItem('theme','dark');
        logoImage.src = 'images/logo_white.svg';
    } else {
        body.classList.add('light-theme');
        localStorage.setItem('theme','light');
        logoImage.src = 'images/logo.svg';
    }
}

themeToggle.addEventListener('click', toggleTheme);

checkTheme();

function loadData() {
    const storedData = localStorage.getItem('extensionsData');

    if (storedData) {
        extensionsData = JSON.parse(storedData);
        console.log("Veri localStorage'dan yüklendi.");
        displayFilteredExtensions();
    } else {
        loadDataFromJson();
    }
}

// JSON dosyasından veriyi yükleme ve localStorage'a kaydetme
function loadDataFromJson() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Dosya yüklenemedi');
            }
            return response.json();
        })
        .then(data => {
            extensionsData = data;
            saveDataToLocalStorage();
            console.log("Veri JSON dosyasından yüklendi ve localStorage'a kaydedildi.");
            displayFilteredExtensions();
        })
        .catch(error => {
            console.error('Veri çekme hatası:', error);
        });
}

// Veriyi localStorage'a kaydetme fonksiyonu
function saveDataToLocalStorage() {
    localStorage.setItem('extensionsData', JSON.stringify(extensionsData));
}

// ----------------------------------------------------
// Olay Dinleyicileri ve Fonksiyonlar
// ----------------------------------------------------

allButton.addEventListener('click', () => {
    setActiveButton(allButton);
    displayFilteredExtensions('all');
});

activeButton.addEventListener('click', () => {
    setActiveButton(activeButton);
    displayFilteredExtensions('active');
});

inactiveButton.addEventListener('click', () => {
    setActiveButton(inactiveButton);
    displayFilteredExtensions('inactive');
});

function displayFilteredExtensions(filter = 'all') {
    let filteredData;
    const currentFilter = getActiveFilter(); // Hangi filtrenin aktif olduğunu al

    if (currentFilter === 'active') {
        filteredData = extensionsData.filter(ext => ext.isActive);
    } else if (currentFilter === 'inactive') {
        filteredData = extensionsData.filter(ext => !ext.isActive);
    } else {
        filteredData = extensionsData;
    }

    mainContentDiv.innerHTML = '';

    if (filteredData.length === 0) {
        mainContentDiv.innerHTML = '<p class="no-results">Sonuç bulunamadı.</p>';
        return;
    }

    filteredData.forEach(extension => {
        const boxDiv = document.createElement('div');
        boxDiv.className = 'box';
        boxDiv.dataset.id = extension.id;

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
                    <input type="checkbox" data-id="${extension.id}" ${extension.isActive ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        `;

        const removeButton = boxDiv.querySelector('.remove-btn');
        removeButton.addEventListener('click', () => {
            removeExtension(extension.id);
        });

        const toggleSwitch = boxDiv.querySelector('.switch input');
        toggleSwitch.addEventListener('change', (event) => {
            toggleExtension(extension.id, event.target.checked);
        });

        mainContentDiv.appendChild(boxDiv);
    });
}

// BU FONKSİYON GÜNCELLENDİ
function removeExtension(idToRemove) {
    const elementToRemove = document.querySelector(`.box[data-id="${idToRemove}"]`);
    
    if (elementToRemove) {
        elementToRemove.classList.add('removing'); // Animasyonu başlat
        
        setTimeout(() => {
            extensionsData = extensionsData.filter(ext => ext.id !== idToRemove);
            saveDataToLocalStorage();
            
            if (extensionsData.length === 0) {
                console.log("Tüm eklentiler silindi. Orijinal veri yeniden yükleniyor.");
                loadDataFromJson();
            } else {
                displayFilteredExtensions(getActiveFilter());
            }
        }, 300); // CSS transition süresiyle aynı olmalı
    }
}

function toggleExtension(idToToggle, isActive) {
    const extensionToUpdate = extensionsData.find(ext => ext.id === idToToggle);
    if (extensionToUpdate) {
        extensionToUpdate.isActive = isActive;
        saveDataToLocalStorage();
        
        const currentFilter = getActiveFilter();
        if (currentFilter === 'active' || currentFilter === 'inactive') {
            const elementToRemove = document.querySelector(`.box[data-id="${idToToggle}"]`);
            if (elementToRemove) {
                elementToRemove.remove();
            }
        }
    }
}

function getActiveFilter() {
    if (allButton.classList.contains('active-filter')) {
        return 'all';
    } else if (activeButton.classList.contains('active-filter')) {
        return 'active';
    } else if (inactiveButton.classList.contains('active-filter')) {
        return 'inactive';
    }
    return 'all';
}

function setActiveButton(clickedButton) {
    const buttons = [allButton, activeButton, inactiveButton];
    buttons.forEach(btn => btn.classList.remove('active-filter'));
    clickedButton.classList.add('active-filter');
}

// ----------------------------------------------------
// Uygulamayı Başlatma
// ----------------------------------------------------
loadData();
setActiveButton(allButton);