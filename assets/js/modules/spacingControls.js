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

const applySettings = () => {
    elements.editor.style.setProperty('--line-height', currentSettings.lineHeight);
    elements.editor.style.setProperty('--paragraph-spacing', currentSettings.paragraphSpacing);
    if (elements.lineHeightSelect) elements.lineHeightSelect.value = currentSettings.lineHeight;
    if (elements.paragraphSpacingSelect) elements.paragraphSpacingSelect.value = currentSettings.paragraphSpacing;
};

export const initSpacingControls = () => {
    loadSettings();
    applySettings();

    if (elements.lineHeightSelect) {
        elements.lineHeightSelect.addEventListener('change', (e) => {
            currentSettings.lineHeight = e.target.value;
            applySettings();
            saveSettings();
        });
    }

    if (elements.paragraphSpacingSelect) {
        elements.paragraphSpacingSelect.addEventListener('change', (e) => {
            currentSettings.paragraphSpacing = e.target.value;
            applySettings();
            saveSettings();
        });
    }
};
