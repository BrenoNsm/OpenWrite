// assets/js/main.js

import { elements } from './modules/domElements.js';
import { applyCommand, saveSelection, openLinkModal, openImageModal, openTableModal, initInsertModals } from './modules/commands.js';
import {
    newDocument,
    exportAsOwd,
    importFromOwd,
    exportAsDoc,
    exportAsOdt,
} from './modules/fileManager.js';
import { updateToolbarState } from './modules/toolbarState.js';
import { initColorPickers } from './utils/colorPicker.js';
import { initPageSetupModal } from './modules/pageSetupModal.js'; // Importa o módulo do modal
import { initSpacingControls } from './modules/spacingControls.js';

const adjustIndent = (delta) => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    let node = range.startContainer;
    if (node.nodeType === 3) node = node.parentNode;
    while (node && node !== elements.editor && !/^(P|DIV|LI)$/i.test(node.nodeName)) {
        node = node.parentNode;
    }
    if (!node || node === elements.editor) return;
    const current = parseFloat(node.style.marginLeft) || 0;
    const newMargin = Math.max(0, current + delta);
    node.style.marginLeft = newMargin ? `${newMargin}em` : '';
    updateToolbarState();
};

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todos os módulos
    initColorPickers();
    initPageSetupModal(); // CHAMA APENAS A INICIALIZAÇÃO, NÃO O ABRE DIRETO
    initSpacingControls();
    initInsertModals();

    // Adiciona ouvintes de evento aos botões e controles (mantido como está)
    // Ações de Arquivo
    elements.newDocBtn.addEventListener('click', newDocument);
    if (elements.downloadOwdBtn) {
        elements.downloadOwdBtn.addEventListener('click', exportAsOwd);
    }
    if (elements.uploadOwdInput) {
        elements.uploadOwdInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) importFromOwd(file);
            e.target.value = '';
        });
    }
    if (elements.exportBtn && elements.exportMenu) {
        elements.exportBtn.addEventListener('click', () => {
            elements.exportMenu.classList.toggle('open');
        });
        document.addEventListener('click', (ev) => {
            if (
                !elements.exportMenu.contains(ev.target) &&
                !elements.exportBtn.contains(ev.target)
            ) {
                elements.exportMenu.classList.remove('open');
            }
        });
    }
    if (elements.exportDoc) {
        elements.exportDoc.addEventListener('click', () => {
            elements.exportMenu.classList.remove('open');
            exportAsDoc();
        });
    }
    if (elements.exportOdt) {
        elements.exportOdt.addEventListener('click', () => {
            elements.exportMenu.classList.remove('open');
            exportAsOdt();
        });
    }

    // Desfazer/Refazer
    elements.undoBtn.addEventListener('click', () => applyCommand('undo'));
    elements.redoBtn.addEventListener('click', () => applyCommand('redo'));

    // Formatação de Caracteres
    elements.boldBtn.addEventListener('click', () => applyCommand('bold'));
    elements.italicBtn.addEventListener('click', () => applyCommand('italic'));
    elements.underlineBtn.addEventListener('click', () => applyCommand('underline'));
    elements.strikethroughBtn.addEventListener('click', () => applyCommand('strikeThrough'));
    elements.subscriptBtn.addEventListener('click', () => applyCommand('subscript'));
    elements.superscriptBtn.addEventListener('click', () => applyCommand('superscript'));
    elements.removeFormatBtn.addEventListener('click', () => applyCommand('removeFormat'));

    // Controles de Texto/Parágrafo
    elements.formatBlockSelect.addEventListener('change', (event) => {
        applyCommand('formatBlock', `<${event.target.value}>`);
    });
    elements.fontSizeSelect.addEventListener('change', (event) => {
        applyCommand('fontSize', event.target.value);
    });

    // Lógica para os seletores de cor (definidos em colorPicker.js) já estão sendo inicializados por initColorPickers()

    elements.alignLeftBtn.addEventListener('click', () => applyCommand('justifyLeft'));
    elements.alignCenterBtn.addEventListener('click', () => applyCommand('justifyCenter')); // Corrigi o addEventListener
    elements.alignRightBtn.addEventListener('click', () => applyCommand('justifyRight'));
    elements.alignJustifyBtn.addEventListener('click', () => applyCommand('justifyFull'));
    elements.indentBtn.addEventListener('click', () => adjustIndent(2));
    elements.outdentBtn.addEventListener('click', () => adjustIndent(-2));

    // Inserir Objetos
    elements.quoteBtn.addEventListener('click', () => applyCommand('formatBlock', '<blockquote>'));
    elements.hrBtn.addEventListener('click', () => applyCommand('insertHorizontalRule'));
    elements.unorderedListBtn.addEventListener('click', () => applyCommand('insertUnorderedList'));
    elements.orderedListBtn.addEventListener('click', () => applyCommand('insertOrderedList'));
    elements.createLinkBtn.addEventListener('click', openLinkModal);
    elements.insertImageBtn.addEventListener('click', openImageModal);
    elements.insertTableBtn.addEventListener('click', openTableModal);

    // Implementa atalhos de teclado (mantido como está)
    elements.editor.addEventListener('keydown', (event) => {
        const isCmdOrCtrl = event.metaKey || event.ctrlKey;

        if (isCmdOrCtrl) {
            switch (event.key) {
                case 'z':
                    event.preventDefault();
                    applyCommand('undo');
                    break;
                case 'y':
                    event.preventDefault();
                    applyCommand('redo');
                    break;
                case 'b':
                    event.preventDefault();
                    applyCommand('bold');
                    break;
                case 'i':
                    event.preventDefault();
                    applyCommand('italic');
                    break;
                case 'u':
                    event.preventDefault();
                    applyCommand('underline');
                    break;
                case 'L':
                    event.preventDefault();
                    openLinkModal();
                    break;
                case '[':
                    event.preventDefault();
                    adjustIndent(-2);
                    break;
                case ']':
                    event.preventDefault();
                    adjustIndent(2);
                    break;
                case 'p':
                    event.preventDefault();
                    openImageModal();
                    break;
                case 't':
                    event.preventDefault();
                    openTableModal();
                    break;
            }
        }
    });

    // Eventos para atualização do estado da barra de ferramentas
    elements.editor.addEventListener('mouseup', updateToolbarState);
    elements.editor.addEventListener('keyup', updateToolbarState);
    elements.editor.addEventListener('input', updateToolbarState);
    elements.editor.addEventListener('focus', updateToolbarState);
    elements.editor.addEventListener('selectionchange', updateToolbarState);

    updateToolbarState(); // Também atualiza no carregamento inicial
});