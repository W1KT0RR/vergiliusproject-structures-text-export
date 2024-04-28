// ==UserScript==
// @name         Vergilius Project Structure Exporter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Export all Vergilius Project structures and their descriptions to the clipboard.
// @author       w1kt0r
// @match        https://www.vergiliusproject.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    async function fetchStructureDetails(url) {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const structureDetails = doc.querySelector('#copyblock').innerText;
        return structureDetails;
    }

    async function exportStructures() {
        const structureLinks = Array.from(document.querySelectorAll('#myDiv a'));
        const structureData = [];

        for (const link of structureLinks) {
            const url = 'https://www.vergiliusproject.com' + link.getAttribute('href');
            const structureName = link.innerText.replace(/\s*\(.*?\)\s*/g, '').replace(/<[^>]*>/g, '').trim();
            const structureDetails = await fetchStructureDetails(url);
            structureData.push(`Structure: ${structureName}\n\n${structureDetails}\n\n`);
        }

        const exportData = structureData.join('----------------------------------------\n');
        GM_setClipboard(exportData);
        alert('Structure details exported to clipboard!');
    }

    const exportButton = document.createElement('button');
    exportButton.innerText = 'Export Structures';
    exportButton.style.position = 'fixed';
    exportButton.style.top = '10px';
    exportButton.style.right = '10px';
    exportButton.style.zIndex = '9999';
    exportButton.addEventListener('click', () => {
        window.focus();
        exportStructures();
    });
    document.body.appendChild(exportButton);
})();