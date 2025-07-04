// assets/js/modules/fileManager.js

import { elements } from './domElements.js';
import { updateToolbarState } from './toolbarState.js'; // Precisará desta importação
import { createPage, attachPageEvents } from './pagination.js';

export const newDocument = () => {
    if (confirm("Você quer criar um novo documento? Quaisquer alterações não salvas serão perdidas.")) {
        elements.editor.innerHTML = '';
        const page = createPage();
        page.innerHTML = '<p>Novo documento.</p>';
        elements.documentTitle.textContent = 'Documento Sem Título';
        updateToolbarState(); // Atualiza a toolbar para o novo estado
    }
};

export const saveDocument = () => {
    const docName = prompt("Digite um nome para o documento:", elements.documentTitle.textContent);
    if (docName) {
        const documentData = {
            title: docName,
            content: elements.editor.innerHTML
        };
        try {
            localStorage.setItem(`editor_doc_${docName}`, JSON.stringify(documentData));
            elements.documentTitle.textContent = docName;
            alert(`Documento "${docName}" salvo com sucesso!`);
        } catch (e) {
            alert("Erro ao salvar documento. Armazenamento local pode estar cheio ou desabilitado.");
            console.error("Erro ao salvar:", e);
        }
    }
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