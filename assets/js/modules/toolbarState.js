// assets/js/modules/toolbarState.js

import { elements } from './domElements.js';

// Função auxiliar para obter a cor do texto/fundo (melhorada para robustez)
const getComputedColor = (command) => {
    try {
        const color = document.queryCommandValue(command);
        if (color && color !== 'transparent' && color !== 'rgb(0, 0, 0)' && color !== '#000000') {
            // Se a cor for RGB, tenta converter para HEX para consistência
            if (color.startsWith('rgb')) {
                const rgb = color.match(/\d+/g).map(Number);
                if (rgb.length === 3) {
                    const toHex = (c) => ("0" + c.toString(16)).slice(-2);
                    return "#" + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]).toUpperCase();
                }
            }
            return color.toUpperCase(); // Retorna HEX ou nome da cor em maiúsculas
        }
    } catch (e) {
        // Ignora erros de queryCommandValue
    }
    return null;
};

// Atualiza o estado da barra de ferramentas (ativa/desativa botões, muda indicadores de cor)
export const updateToolbarState = () => {
    // Formatação de Caracteres
    elements.boldBtn.classList.toggle('active', document.queryCommandState('bold'));
    elements.italicBtn.classList.toggle('active', document.queryCommandState('italic'));
    elements.underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
    elements.strikethroughBtn.classList.toggle('active', document.queryCommandState('strikeThrough'));
    elements.subscriptBtn.classList.toggle('active', document.queryCommandState('subscript'));
    elements.superscriptBtn.classList.toggle('active', document.queryCommandState('superscript'));

    // Alinhamento
    elements.alignLeftBtn.classList.toggle('active', document.queryCommandState('justifyLeft'));
    elements.alignCenterBtn.classList.toggle('active', document.queryCommandState('justifyCenter'));
    elements.alignRightBtn.classList.toggle('active', document.queryCommandState('justifyRight'));
    elements.alignJustifyBtn.classList.toggle('active', document.queryCommandState('justifyFull'));

    // Listas e Recuo
    elements.unorderedListBtn.classList.toggle('active', document.queryCommandState('insertUnorderedList'));
    elements.orderedListBtn.classList.toggle('active', document.queryCommandState('insertOrderedList'));
    elements.indentBtn.classList.toggle('active', document.queryCommandState('indent'));
    elements.outdentBtn.classList.toggle('active', document.queryCommandState('outdent'));

    // Formato do Bloco: Lógica mais precisa
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        let currentNode = selection.getRangeAt(0).commonAncestorContainer;
        if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode = currentNode.parentNode;
        }
        let blockTag = 'p';
        if (elements.editor.contains(currentNode)) {
            let currentBlock = currentNode;
            while (currentBlock && currentBlock !== elements.editor && !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'LI'].includes(currentBlock.tagName)) {
                currentBlock = currentBlock.parentNode;
            }
            if (currentBlock && elements.editor.contains(currentBlock)) {
                blockTag = currentBlock.tagName.toLowerCase();
            }
        }
        // Ajuste para listas: se for LI, pode querer mostrar 'p' ou manter o valor de bloco se não for lista/quote
        if (blockTag === 'li') {
             let parentList = currentNode.closest('ul, ol');
             if (parentList) {
                // Se o LI está dentro de uma lista, não muda o select de bloco para LI, mantém o valor atual ou 'p'
                if (!elements.formatBlockSelect.value.startsWith('h') && elements.formatBlockSelect.value !== 'blockquote') {
                     elements.formatBlockSelect.value = 'p';
                }
             }
        } else if (elements.formatBlockSelect.value !== blockTag) {
            elements.formatBlockSelect.value = blockTag;
        }
    }

    // --- ATUALIZAÇÃO DOS INDICADORES DE COR ---
    let currentForeColor = getComputedColor('foreColor');
    elements.foreColorIndicator.style.backgroundColor = currentForeColor || '#000000';
    elements.foreColorCustomInput.value = currentForeColor || '#000000';

    let currentBackColor = getComputedColor('backColor');
    elements.backColorIndicator.style.backgroundColor = currentBackColor || '#FFFFFF'; // Padrão branco para "sem destaque"
    elements.backColorCustomInput.value = currentBackColor || '#FFFFFF';
};