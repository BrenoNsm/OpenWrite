// assets/js/modules/domElements.js

export const elements = {
    editor: document.getElementById('editor'),
    documentTitle: document.querySelector('.document-title'),
    newDocBtn: document.getElementById('newDocBtn'),
    saveDocBtn: document.getElementById('saveDocBtn'),
    loadDocBtn: document.getElementById('loadDocBtn'),

    // Formatação de Caracteres
    boldBtn: document.getElementById('boldBtn'),
    italicBtn: document.getElementById('italicBtn'),
    underlineBtn: document.getElementById('underlineBtn'),
    strikethroughBtn: document.getElementById('strikethroughBtn'),
    subscriptBtn: document.getElementById('subscriptBtn'),
    superscriptBtn: document.getElementById('superscriptBtn'),
    removeFormatBtn: document.getElementById('removeFormatBtn'),

    // Controles de Texto/Parágrafo
    formatBlockSelect: document.getElementById('formatBlockSelect'),
    fontSizeSelect: document.getElementById('fontSizeSelect'),


    spacingBtn: document.getElementById('spacingBtn'),
    spacingMenu: document.getElementById('spacingMenu'),
    lineOptions: document.querySelectorAll('#spacingMenu .line-option'),
    increaseSpacing: document.getElementById('increaseSpacing'),
    decreaseSpacing: document.getElementById('decreaseSpacing'),

    // Elementos para os seletores de cor personalizados
    foreColorBtn: document.getElementById('foreColorBtn'),
    foreColorIndicator: document.getElementById('foreColorBtn').querySelector('.color-indicator'),
    foreColorPalette: document.getElementById('foreColorPalette'),
    foreColorSwatches: document.getElementById('foreColorPalette').querySelectorAll('.color-swatch'),
    foreColorCustomInput: document.getElementById('foreColorPalette').querySelector('.custom-color-input'),

    backColorBtn: document.getElementById('backColorBtn'),
    backColorIndicator: document.getElementById('backColorBtn').querySelector('.color-indicator'),
    backColorPalette: document.getElementById('backColorPalette'),
    backColorSwatches: document.getElementById('backColorPalette').querySelectorAll('.color-swatch'),
    backColorCustomInput: document.getElementById('backColorPalette').querySelector('.custom-color-input'),

    alignLeftBtn: document.getElementById('alignLeftBtn'),
    alignCenterBtn: document.getElementById('alignCenterBtn'),
    alignRightBtn: document.getElementById('alignRightBtn'),
    alignJustifyBtn: document.getElementById('alignJustifyBtn'),
    indentBtn: document.getElementById('indentBtn'),
    outdentBtn: document.getElementById('outdentBtn'),

    // Inserir Objetos
    quoteBtn: document.getElementById('quoteBtn'),
    hrBtn: document.getElementById('hrBtn'),
    unorderedListBtn: document.getElementById('unorderedListBtn'),
    orderedListBtn: document.getElementById('orderedListBtn'),
    createLinkBtn: document.getElementById('createLinkBtn'),
    insertImageBtn: document.getElementById('insertImageBtn'),
    insertTableBtn: document.getElementById('insertTableBtn'),

    // Desfazer/Refazer
    undoBtn: document.getElementById('undoBtn'),
    redoBtn: document.getElementById('redoBtn'),

    // NOVO: Botão de configuração de página
    pageSetupBtn: document.getElementById('pageSetupBtn'), // <-- VERIFIQUE SE ESTE ID ESTÁ CORRETO NO HTML

    // NOVO: Elementos do Modal de Configuração da Página
    pageSetupModal: document.getElementById('pageSetupModal'), // <-- VERIFIQUE ESTE ID
    pageOrientation: document.getElementById('pageOrientation'),
    pageSize: document.getElementById('pageSize'),
    marginTop: document.getElementById('marginTop'),
    marginBottom: document.getElementById('marginBottom'),
    marginLeft: document.getElementById('marginLeft'),
    marginRight: document.getElementById('marginRight'),
    applyPageSetupBtn: document.getElementById('applyPageSetupBtn'),
    cancelPageSetupBtn: document.getElementById('cancelPageSetupBtn'),

    // Modais de Inserção
    linkModal: document.getElementById('linkModal'),
    linkUrl: document.getElementById('linkUrl'),
    confirmInsertLink: document.getElementById('confirmInsertLink'),
    cancelInsertLink: document.getElementById('cancelInsertLink'),

    imageModal: document.getElementById('imageModal'),
    imageUrl: document.getElementById('imageUrl'),
    confirmInsertImage: document.getElementById('confirmInsertImage'),
    cancelInsertImage: document.getElementById('cancelInsertImage'),

    tableModal: document.getElementById('tableModal'),
    tableRows: document.getElementById('tableRows'),
    tableCols: document.getElementById('tableCols'),
    confirmInsertTable: document.getElementById('confirmInsertTable'),
    cancelInsertTable: document.getElementById('cancelInsertTable'),

    // NOVO: Referência ao paper-container para ajustar maxWidth
    paperContainer: document.querySelector('.paper-container'), // <-- ESTE É IMPORTANTE PARA O LAYOUT
};