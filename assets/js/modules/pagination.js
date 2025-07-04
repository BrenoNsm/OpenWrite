import { elements } from './domElements.js';

const PX_PER_CM = 96 / 2.54;
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

const handleInput = (e) => {
    const page = e.currentTarget;
    const maxHeightPx = currentSettings.heightCm * PX_PER_CM;
    if (page.scrollHeight > maxHeightPx) {
        let next = page.nextElementSibling;
        if (!next) {
            next = createPage();
        }
        while (page.scrollHeight > maxHeightPx && page.lastChild) {
            next.insertBefore(page.lastChild, next.firstChild);
        }
        placeCaretAtStart(next);
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
