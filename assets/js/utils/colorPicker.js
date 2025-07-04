// assets/js/utils/colorPicker.js

import { elements } from '../modules/domElements.js';
import { applyCommand, saveSelection } from '../modules/commands.js';
import { updateToolbarState } from '../modules/toolbarState.js';

let openColorPalette = null; // Estado para controlar qual pop-up de cor está aberto

// Função para fechar qualquer pop-up de cor aberto
const closeColorPalettes = (event) => {
    // Verifica se o clique não foi dentro da paleta aberta ou nos botões de acionamento
    if (openColorPalette && !openColorPalette.contains(event.target) &&
        !elements.foreColorBtn.contains(event.target) && !elements.backColorBtn.contains(event.target)) {
        openColorPalette.classList.remove('open');
        openColorPalette = null;
        // Importante: quando a paleta é fechada, a seleção salva pode ser limpa
        // para evitar comportamentos inesperados em cliques subsequentes
        // saveSelection(null); // Poderíamos ter uma função para limpar a seleção
        // No nosso caso, applyCommand já limpa, mas em cenários mais complexos seria útil
    }
};

// Inicializa a lógica para um seletor de cor específico
const initializeColorPicker = (button, indicator, palette, swatches, customInput, command) => {
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique se propague e feche outras paletas/documento
        closeColorPalettes(event); // Fecha outras paletas se abertas

        saveSelection(); // Salva a seleção ANTES de abrir a paleta

        palette.classList.toggle('open'); // Abre/fecha a paleta
        openColorPalette = palette.classList.contains('open') ? palette : null;
    });

    swatches.forEach(swatch => {
        swatch.addEventListener('click', (event) => {
            const color = event.target.dataset.color;
            applyCommand(command, color); // Aplica a cor
            indicator.style.backgroundColor = color; // Atualiza o indicador
            customInput.value = color; // Sincroniza o input customizado
            palette.classList.remove('open'); // Fecha a paleta
            openColorPalette = null;
        });
    });

    customInput.addEventListener('input', (event) => { // Evento 'input' para pré-visualização ao arrastar
        const color = event.target.value;
        applyCommand(command, color); // Aplica a cor
        indicator.style.backgroundColor = color; // Atualiza o indicador
    });
};

// Função principal para inicializar todos os seletores de cor
export const initColorPickers = () => {
    initializeColorPicker(elements.foreColorBtn, elements.foreColorIndicator, elements.foreColorPalette, elements.foreColorSwatches, elements.foreColorCustomInput, 'foreColor');
    initializeColorPicker(elements.backColorBtn, elements.backColorIndicator, elements.backColorPalette, elements.backColorSwatches, elements.backColorCustomInput, 'backColor');

    // Listener global para fechar paletas quando clicar fora de qualquer uma
    document.addEventListener('click', closeColorPalettes);
};