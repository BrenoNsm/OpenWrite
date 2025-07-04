// assets/js/main.js

import { elements } from './modules/domElements.js';
import { applyCommand, saveSelection, openLinkModal, openImageModal, openTableModal, initInsertModals } from './modules/commands.js';
import { newDocument, saveDocument, loadDocument } from './modules/fileManager.js';
import { updateToolbarState } from './modules/toolbarState.js';
import { initColorPickers } from './utils/colorPicker.js';
import { initPageSetupModal } from './modules/pageSetupModal.js'; // Importa o módulo do modal
import { initSpacingControls } from './modules/spacingControls.js';
import { initPagination } from './modules/pagination.js';


document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todos os módulos
    initColorPickers();
    initPageSetupModal(); // CHAMA APENAS A INICIALIZAÇÃO, NÃO O ABRE DIRETO
    initPagination();
    initSpacingControls();
    initInsertModals();

    initPagination();

    initSpacingControls();
    initInsertModals();

    // Adiciona ouvintes de evento aos botões e controles (mantido como está)
    // Ações de Arquivo
    elements.newDocBtn.addEventListener('click', newDocument);
    elements.saveDocBtn.addEventListener('click', saveDocument);
    elements.loadDocBtn.addEventListener('click', loadDocument);

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
    elements.indentBtn.addEventListener('click', () => applyCommand('indent'));
    elements.outdentBtn.addEventListener('click', () => applyCommand('outdent'));

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
                case 's':
                    event.preventDefault();
                    saveDocument();
                    break;
                case 'L':
                    event.preventDefault();
                    openLinkModal();
                    break;
                case '[':
                    event.preventDefault();
                    applyCommand('outdent');
                    break;
                case ']':
                    event.preventDefault();
                    applyCommand('indent');
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