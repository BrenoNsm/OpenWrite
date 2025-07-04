import { elements } from './domElements.js';

const PX_PER_CM = 96 / 2.54;
const MAX_ITERATIONS = 40; // segurança contra loops infinitos
let currentSettings = {
    widthCm: 21,
    heightCm: 29.7,
    margins: { top: 2.5, bottom: 2.5, left: 3, right: 3 }
};

const applyStyles = (page) => {
    page.style.width = `${currentSettings.widthCm}cm`;
    page.style.minHeight = `${currentSettings.heightCm}cm`;
    page.style.paddingTop = `${currentSettings.margins.top}cm`;
    page.style.paddingBottom = `${currentSettings.margins.bottom}cm`;
    page.style.paddingLeft = `${currentSettings.margins.left}cm`;
    page.style.paddingRight = `${currentSettings.margins.right}cm`;
};

export const attachPageEvents = (page) => {
    page.addEventListener('input', handleInput);
};

export const createPage = () => {
    const page = document.createElement('div');
    page.className = 'editor-area';
    page.contentEditable = 'true';
    page.spellcheck = false;
    applyStyles(page);
    attachPageEvents(page);
    elements.editor.appendChild(page);
    return page;
};

const rebalancePages = () => {
    const pages = Array.from(elements.editor.querySelectorAll('.editor-area'));
    if (pages.length === 0) return;
    const maxHeightPx = currentSettings.heightCm * PX_PER_CM;
    let iterations = 0;

    // Passo 1: mover excesso para páginas seguintes
    for (let i = 0; i < pages.length && iterations < MAX_ITERATIONS; i++) {
        let page = pages[i];
        while (page.scrollHeight > maxHeightPx && page.childNodes.length > 1 && iterations < MAX_ITERATIONS) {
            let next = pages[i + 1];
            if (!next) {
                next = createPage();
                pages.push(next);
            }
            next.insertBefore(page.lastChild, next.firstChild);
            iterations++;
        }
    }

    // Passo 2: remover páginas vazias
    for (let i = pages.length - 1; i > 0; i--) {
        if (pages[i].childNodes.length === 0 || pages[i].textContent.trim() === '') {
            pages[i].remove();
            pages.splice(i, 1);
        }
    }

    // Passo 3: puxar conteúdo se houver espaço
    for (let i = pages.length - 1; i > 0 && iterations < MAX_ITERATIONS; i--) {
        let prev = pages[i - 1];
        let current = pages[i];
        while (prev.scrollHeight < maxHeightPx && current.firstChild && iterations < MAX_ITERATIONS) {
            prev.appendChild(current.firstChild);
            if (prev.scrollHeight > maxHeightPx) {
                current.insertBefore(prev.lastChild, current.firstChild);
                break;
            }
            if (current.childNodes.length === 0 && i === pages.length - 1) {
                current.remove();
                pages.pop();
                break;
            }
            iterations++;
        }
    }
};

const handleInput = () => {
    rebalancePages();
}; 

export const initPagination = () => {
    const pages = elements.editor.querySelectorAll('.editor-area');
    if (pages.length === 0) {
        createPage();
    } else {
        pages.forEach(attachPageEvents);
    }
    rebalancePages();
};

export const updatePageSettings = (settings) => {
    currentSettings = settings;
    elements.editor.querySelectorAll('.editor-area').forEach(applyStyles);
};
