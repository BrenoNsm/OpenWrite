// assets/js/modules/commands.js

import { elements } from './domElements.js';

let savedSelectionRange = null; // Para salvar a seleção antes de abrir o pop-up ou executar comandos específicos

// Salva a seleção atual do editor
export const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        savedSelectionRange = selection.getRangeAt(0);
    } else {
        savedSelectionRange = null;
    }
};

// Aplica um comando de edição ao documento
export const applyCommand = (command, value = null) => {
    // Restaura a seleção se uma foi salva (importante para manter o cursor/seleção)
    if (savedSelectionRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedSelectionRange);
        savedSelectionRange = null; // Limpa após restaurar
    }

    document.execCommand(command, false, value);
    elements.editor.focus(); // Mantém o foco no editor
};

// Funções para comandos específicos que exigem HTML customizado
export const openLinkModal = () => {
    saveSelection();
    elements.linkUrl.value = '';
    elements.linkModal.classList.add('open');
    elements.linkUrl.focus();
};

export const openImageModal = () => {
    saveSelection();
    elements.imageUrl.value = '';
    elements.imageModal.classList.add('open');
    elements.imageUrl.focus();
};

export const openTableModal = () => {
    saveSelection();
    elements.tableRows.value = '3';
    elements.tableCols.value = '3';
    elements.tableModal.classList.add('open');
    elements.tableRows.focus();
};

const closeModal = (modal) => modal.classList.remove('open');

const insertTableHtml = () => {
    const rows = parseInt(elements.tableRows.value, 10);
    const cols = parseInt(elements.tableCols.value, 10);
    if (rows > 0 && cols > 0) {
        let tableHtml = '<table style="width:100%; border-collapse: collapse;"><tbody>';
        for (let r = 0; r < rows; r++) {
            tableHtml += '<tr>';
            for (let c = 0; c < cols; c++) {
                tableHtml += '<td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>';
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';
        applyCommand('insertHTML', tableHtml);
    }
    closeModal(elements.tableModal);
};

const insertLinkFromModal = () => {
    const url = elements.linkUrl.value.trim();
    if (url) {
        applyCommand('createLink', url);
    }
    closeModal(elements.linkModal);
};

const insertImageFromModal = () => {
    const url = elements.imageUrl.value.trim();
    if (url) {
        applyCommand('insertImage', url);
    }
    closeModal(elements.imageModal);
};

export const initInsertModals = () => {
    if (elements.confirmInsertLink) {
        elements.confirmInsertLink.addEventListener('click', insertLinkFromModal);
    }
    if (elements.cancelInsertLink) {
        elements.cancelInsertLink.addEventListener('click', () => closeModal(elements.linkModal));
    }
    if (elements.linkModal) {
        const closeBtn = elements.linkModal.querySelector('.close-button');
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(elements.linkModal));
        elements.linkModal.addEventListener('click', (e) => { if (e.target === elements.linkModal) closeModal(elements.linkModal); });
    }

    if (elements.confirmInsertImage) {
        elements.confirmInsertImage.addEventListener('click', insertImageFromModal);
    }
    if (elements.cancelInsertImage) {
        elements.cancelInsertImage.addEventListener('click', () => closeModal(elements.imageModal));
    }
    if (elements.imageModal) {
        const closeBtn = elements.imageModal.querySelector('.close-button');
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(elements.imageModal));
        elements.imageModal.addEventListener('click', (e) => { if (e.target === elements.imageModal) closeModal(elements.imageModal); });
    }

    if (elements.confirmInsertTable) {
        elements.confirmInsertTable.addEventListener('click', insertTableHtml);
    }
    if (elements.cancelInsertTable) {
        elements.cancelInsertTable.addEventListener('click', () => closeModal(elements.tableModal));
    }
    if (elements.tableModal) {
        const closeBtn = elements.tableModal.querySelector('.close-button');
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(elements.tableModal));
        elements.tableModal.addEventListener('click', (e) => { if (e.target === elements.tableModal) closeModal(elements.tableModal); });
    }
};