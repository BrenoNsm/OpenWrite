// assets/js/modules/fileManager.js

import { elements } from './domElements.js';
import { updateToolbarState } from './toolbarState.js'; // Precisará desta importação
import { createPage, attachPageEvents } from './pagination.js';

const getCleanText = () => {
    let text = elements.editor.innerText || '';
    text = text.replace(/\u00A0/g, ' ');
    text = text.replace(/ {2,}/g, ' ');
    const lines = text.split(/\r?\n/);
    const result = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '') {
            if (result.length && result[result.length - 1] !== '') {
                result.push('');
            }
        } else if (result.length && result[result.length - 1] !== '') {
            result[result.length - 1] += ' ' + trimmed;
        } else {
            result.push(trimmed);
        }
    }
    return result.join('\n\n');
};

export const newDocument = () => {
    if (confirm('Você quer criar um novo documento? Quaisquer alterações não salvas serão perdidas.')) {
        elements.editor.innerHTML = '<p><br></p>';
        elements.documentTitle.textContent = 'Documento Sem Título';
        updateToolbarState();
    }
};

export const saveDocument = () => {
    const docName = prompt(
        "Digite um nome para o documento:",
        elements.documentTitle.textContent
    );
    if (docName) {
        const documentData = {
            title: docName,
            content: elements.editor.innerHTML,
        };
        try {
            localStorage.setItem(
                `editor_doc_${docName}`,
                JSON.stringify(documentData)
            );
            elements.documentTitle.textContent = docName;
            alert(`Documento "${docName}" salvo com sucesso!`);
        } catch (e) {
            alert(
                "Erro ao salvar documento. Armazenamento local pode estar cheio ou desabilitado."
            );
            console.error("Erro ao salvar:", e);
        }
    }
};

const downloadBlob = (blob, filename) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const exportAsOwd = () => {
    const data = {
        title: elements.documentTitle.textContent,
        content: elements.editor.innerHTML,
    };
    const blob = new Blob([JSON.stringify(data)], {
        type: 'application/x-openwrite',
    });
    const name = `${data.title || 'documento'}.owd`;
    downloadBlob(blob, name);
};

export const importFromOwd = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data && data.content) {
                elements.editor.innerHTML = data.content;
                elements.documentTitle.textContent = data.title || 'Documento Sem Título';
                updateToolbarState();
            } else {
                alert('Arquivo inválido.');
            }
        } catch (err) {
            alert('Erro ao ler arquivo.');
        }
    };
    reader.readAsText(file);
};

export const exportAsDoc = () => {
    const html = `<html><head><meta charset="utf-8"></head><body>${elements.editor.innerHTML}</body></html>`;
    const blob = new Blob([html], {
        type: 'application/msword',
    });
    downloadBlob(blob, `${elements.documentTitle.textContent || 'documento'}.doc`);
};

export const exportAsOdt = () => {
    const html = `<html><head><meta charset="utf-8"></head><body>${elements.editor.innerHTML}</body></html>`;
    const blob = new Blob([html], {
        type: 'application/vnd.oasis.opendocument.text',
    });
    downloadBlob(blob, `${elements.documentTitle.textContent || 'documento'}.odt`);
};

export const loadDocument = () => {
    const savedDocs = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('editor_doc_')) {
            savedDocs.push(key.substring('editor_doc_'.length));
        }
    }

    if (savedDocs.length === 0) {
        alert("Nenhum documento salvo encontrado.");
        return;
    }

    const docToLoad = prompt(`Documentos salvos:\n${savedDocs.join('\n')}\n\nDigite o nome do documento para carregar:`);
    if (docToLoad) {
        try {
            const documentData = JSON.parse(localStorage.getItem(`editor_doc_${docToLoad}`));
            if (documentData && documentData.content) {
                elements.editor.innerHTML = documentData.content;
                elements.editor.querySelectorAll('.editor-area').forEach(attachPageEvents);
                elements.documentTitle.textContent = documentData.title || docToLoad;
                updateToolbarState(); // Atualiza a toolbar para o documento carregado
                alert(`Documento "${docToLoad}" carregado com sucesso!`);
            } else {
                alert(`Documento "${docToLoad}" não encontrado ou inválido.`);
            }
        } catch (e) {
            alert("Erro ao carregar documento.");
            console.error("Erro ao carregar:", e);
        }
    }
};