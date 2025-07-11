// assets/js/modules/pageSetupModal.js

import { elements } from './domElements.js';
import { updateToolbarState } from './toolbarState.js';
import { updatePageSettings } from './pagination.js';

// Configurações padrão ABNT (cm)
let currentPageSettings = {
    orientation: 'portrait',
    size: 'A4',
    margins: {
        top: 3.0,
        bottom: 2.0,
        left: 3.0,
        right: 2.0
    }
};

const paperSizesCm = {
    'A4': { width: 21.0, height: 29.7 },
    'Letter': { width: 21.59, height: 27.94 },
    'Legal': { width: 21.59, height: 35.56 }
};

const loadPageSettings = () => {
    try {
        const savedSettings = localStorage.getItem('pageSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            currentPageSettings = { ...currentPageSettings, ...parsedSettings };
        }
    } catch (e) {
        console.error("Erro ao carregar configurações de página salvas:", e);
    }
};

const savePageSettings = () => {
    try {
        localStorage.setItem('pageSettings', JSON.stringify(currentPageSettings));
    } catch (e) {
        console.error("Erro ao salvar configurações de página:", e);
    }
};

const applyPageSettingsToEditor = () => {
    const { orientation, size, margins } = currentPageSettings;
    const paper = paperSizesCm[size];

    let editorWidth, editorHeight;

    if (orientation === 'portrait') {
        editorWidth = paper.width;
        editorHeight = paper.height;
    } else { // landscape
        editorWidth = paper.height;
        editorHeight = paper.width;
    }


    // AQUI É A PARTE CRÍTICA DO JAVASCRIPT
    // Garante que o container do papel ocupe toda a largura disponível
    // e limita o editor ao tamanho de papel configurado
    elements.paperContainer.style.maxWidth = '100%';
    elements.editor.style.width = '100%';
    elements.editor.style.maxWidth = `${editorWidth}cm`;

    elements.editor.style.minHeight = `${editorHeight}cm`; // Altura mínima do papel

    // Aplica as margens ao padding do editor-area
    elements.editor.style.paddingTop = `${margins.top}cm`;
    elements.editor.style.paddingBottom = `${margins.bottom}cm`;
    elements.editor.style.paddingLeft = `${margins.left}cm`;
    elements.editor.style.paddingRight = `${margins.right}cm`;


    updateToolbarState();
};

export const openPageSetupModal = () => {
    const modalElement = elements.pageSetupModal;

    elements.pageOrientation.value = currentPageSettings.orientation;
    elements.pageSize.value = currentPageSettings.size;
    elements.marginTop.value = currentPageSettings.margins.top;
    elements.marginBottom.value = currentPageSettings.margins.bottom;
    elements.marginLeft.value = currentPageSettings.margins.left;
    elements.marginRight.value = currentPageSettings.margins.right;

    modalElement.classList.add('open'); // Adiciona a classe 'open' para exibir o modal
};

const closePageSetupModal = () => {
    const modalElement = elements.pageSetupModal;
    if (modalElement) {
        modalElement.classList.remove('open'); // Remove a classe 'open' para ocultar o modal
    }
};

export const initPageSetupModal = () => {
    // Carrega e aplica as configurações ao iniciar, mas NÃO ABRE o modal
    loadPageSettings();
    applyPageSettingsToEditor();

    // Adiciona event listener ao botão de abrir o modal
    if (elements.pageSetupBtn) {
        elements.pageSetupBtn.addEventListener('click', openPageSetupModal);
    } else {
        console.error("Erro: Botão de configuração de página (pageSetupBtn) não encontrado no DOM.");
    }

    if (elements.pageSetupModal) {
        const closeBtn = elements.pageSetupModal.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.addEventListener('click', closePageSetupModal);
        } else {
            console.warn("Botão de fechar modal não encontrado.");
        }

        if (elements.cancelPageSetupBtn) {
            elements.cancelPageSetupBtn.addEventListener('click', closePageSetupModal);
        } else {
            console.warn("Botão Cancelar do modal não encontrado.");
        }

        if (elements.applyPageSetupBtn) {
            elements.applyPageSetupBtn.addEventListener('click', () => {
                currentPageSettings = {
                    orientation: elements.pageOrientation.value,
                    size: elements.pageSize.value,
                    margins: {
                        top: parseFloat(elements.marginTop.value),
                        bottom: parseFloat(elements.marginBottom.value),
                        left: parseFloat(elements.marginLeft.value),
                        right: parseFloat(elements.marginRight.value)
                    }
                };
                savePageSettings();
                applyPageSettingsToEditor();
                closePageSetupModal();
            });
        } else {
            console.warn("Botão Aplicar do modal não encontrado.");
        }

        elements.pageSetupModal.addEventListener('click', (event) => {
            if (event.target === elements.pageSetupModal) {
                closePageSetupModal();
            }
        });
    } else {
        console.error("Erro: Modal de configuração de página (pageSetupModal) não encontrado no DOM.");
    }
};