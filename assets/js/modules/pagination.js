import { elements } from './domElements.js';

const PX_PER_CM = 96 / 2.54;
const MAX_ITERATIONS = 30; // evita loops infinitos quando o conteúdo é muito grande
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

const placeCaretAtStart = (el) => {
    el.focus();
    const range = document.createRange();
    range.setStart(el, 0);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
};

const getLastTextNode = (node) => {
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
        return node;
    }
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const child = getLastTextNode(node.childNodes[i]);
        if (child) return child;
    }
    return null;
};

const splitTextNodeToFit = (page, textNode, maxHeightPx) => {
    const original = textNode.textContent;
    let low = 0;
    let high = original.length;
    let index = 0;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        textNode.textContent = original.slice(0, mid);
        if (page.scrollHeight > maxHeightPx) {
            high = mid - 1;
        } else {
            index = mid;
            low = mid + 1;
        }
    }

    textNode.textContent = original.slice(0, index);
    return document.createTextNode(original.slice(index));
};

const handleInput = (e) => {
    let page = e.currentTarget;
    const maxHeightPx = currentSettings.heightCm * PX_PER_CM;
    let iterations = 0;

    while (page.scrollHeight > maxHeightPx && iterations < MAX_ITERATIONS) {
        // Se a página tem apenas um filho e ainda está maior que o permitido,
        // interrompe para evitar um loop infinito (conteúdo grande demais).
        if (page.childNodes.length <= 1) break;

        let next = page.nextElementSibling;
        if (!next) next = createPage();

        const textNode = getLastTextNode(page);
        if (!textNode) break;

        const remainder = splitTextNodeToFit(page, textNode, maxHeightPx);
        if (remainder.textContent) {
            next.insertBefore(remainder, next.firstChild);
        } else {
            // Se não couber nada, move o próprio nó
            next.insertBefore(textNode, next.firstChild);
        }

        placeCaretAtStart(next);

        if (next.scrollHeight > maxHeightPx) {
            // Continua verificando a próxima página
            page = next;
        } else {
            break;
        }

        iterations++;
    }
};

export const initPagination = () => {
    const pages = elements.editor.querySelectorAll('.editor-area');
    if (pages.length === 0) {
        createPage();
    } else {
        pages.forEach(attachPageEvents);
    }
};

export const updatePageSettings = (settings) => {
    currentSettings = settings;
    elements.editor.querySelectorAll('.editor-area').forEach(applyStyles);
};
