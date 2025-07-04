import { elements } from './domElements.js';

const defaultSettings = {
    lineHeight: '1.8',
    paragraphSpacing: '1em'
};

let currentSettings = { ...defaultSettings };

const loadSettings = () => {
    try {
        const saved = localStorage.getItem('spacingSettings');
        if (saved) {
            currentSettings = { ...currentSettings, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error('Erro ao carregar espaçamentos salvos:', e);
    }
};

const saveSettings = () => {
    try {
        localStorage.setItem('spacingSettings', JSON.stringify(currentSettings));
    } catch (e) {
        console.error('Erro ao salvar espaçamentos:', e);
    }
};


const highlightActive = () => {
    if (elements.lineOptions) {
        elements.lineOptions.forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.value === currentSettings.lineHeight);
        });
    }
};

const applySettings = () => {
    elements.editor.style.setProperty('--line-height', currentSettings.lineHeight);
    elements.editor.style.setProperty('--paragraph-spacing', currentSettings.paragraphSpacing);
    if (elements.spacingBtn) elements.spacingBtn.textContent = currentSettings.lineHeight;
    highlightActive();

};

export const initSpacingControls = () => {
    loadSettings();
    applySettings();


    if (elements.spacingBtn) {
        elements.spacingBtn.addEventListener('click', () => {
            if (elements.spacingMenu) elements.spacingMenu.classList.toggle('open');
        });
    }

    if (elements.lineOptions) {
        elements.lineOptions.forEach((btn) => {
            btn.addEventListener('click', () => {
                currentSettings.lineHeight = btn.dataset.value;
                applySettings();
                saveSettings();
                if (elements.spacingMenu) elements.spacingMenu.classList.remove('open');
            });
        });
    }

    if (elements.increaseSpacing) {
        elements.increaseSpacing.addEventListener('click', () => {
            const value = parseFloat(currentSettings.paragraphSpacing);
            currentSettings.paragraphSpacing = `${(value + 0.5).toFixed(1)}em`;

    if (elements.lineHeightSelect) {
        elements.lineHeightSelect.addEventListener('change', (e) => {
            currentSettings.lineHeight = e.target.value;

            applySettings();
            saveSettings();
        });
    }


    if (elements.decreaseSpacing) {
        elements.decreaseSpacing.addEventListener('click', () => {
            const value = parseFloat(currentSettings.paragraphSpacing);
            const newValue = Math.max(0, value - 0.5);
            currentSettings.paragraphSpacing = `${newValue.toFixed(1)}em`;

            applySettings();
            saveSettings();
        });
    }


    document.addEventListener('click', (e) => {
        if (!elements.spacingMenu.contains(e.target) && !elements.spacingBtn.contains(e.target)) {
            elements.spacingMenu.classList.remove('open');
        }
    });

};
