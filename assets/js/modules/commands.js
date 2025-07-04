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
export const insertTable = () => {
    const rows = prompt('Número de linhas:', '3');
    const cols = prompt('Número de colunas:', '3');
    if (rows && cols && !isNaN(rows) && !isNaN(cols)) {
        let tableHtml = '<table style="width:100%; border-collapse: collapse;"><tbody>';
        for (let r = 0; r < parseInt(rows); r++) {
            tableHtml += '<tr>';
            for (let c = 0; c < parseInt(cols); c++) {
                // Adiciona um estilo básico para a célula e um <br> para facilitar a seleção
                tableHtml += '<td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>';
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';
        elements.editor.focus();
        document.execCommand('insertHTML', false, tableHtml);
    } else {
        alert('Por favor, insira números válidos para linhas e colunas.');
    }
};

export const createLink = () => {
    const url = prompt('Digite a URL para o link:');
    if (url) {
        applyCommand('createLink', url);
    }
};

export const insertImage = () => {
    const imageUrl = prompt('Digite a URL da imagem:');
    if (imageUrl) {
        applyCommand('insertImage', imageUrl);
    }
};