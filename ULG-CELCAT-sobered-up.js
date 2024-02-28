// ==UserScript==
// @name         ULG-CELCAT-sobered-up
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simplify the information on our CELCAT calendar for 3rd-year medical students at ULG.
// @author       Sokhyrr
// @match        https://my.calendar.uliege.be/calendar/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const replacements = {
        // Rename the course titles
        "Pathologies du système cardio-vasculaire (PATH0134-A-a)": "CardioPatho",
        "Virologie clinique (SBIM0490-A-a)":"Viro",
        "Introduction à la sémiologie clinique générale (MEDE3003-A-a)":"Sémio",
        "Recherche d'informations probantes dans le domaine médical (perspective de l'evidence-based medicine) (APPR0333-A-a)":"EBM",
        "Pathologies du système respiratoire (PATH0135-A-a)" : "RespiPatho",
        "Travaux pratiques en réanimation (MEDE0005-A-a)":"TP Réa",
        "Principes généraux de médecine générale (MEGE1162-A-a)" : "Med G",
        "Microbiologie médicale (MICR0130-A-b)" : "Microbio",
        "Principes généraux de diagnostic clinique et de thérapeutique (PATH0132-A-a)" : "DT",
        "Intégration des connaissances y compris apprentissage au raisonnement clinique et diagnostique": "ARCd",
        "Principes généraux d'oncologie (PATH0133-A-a)":"Onco",

        // Rename the location names
        "B36 Stainier (0/5) [Liège Sart-Tilman - Hopital]":"Stainier",
        "B45 AMPHI C (0/8) [Liège Sart-Tilman - Vallée]":"Amphi C",
        "B4 A204 (0/24) [Liège Sart-Tilman - Agora]":"204",
        "B4 A304 (0/30) [Liège Sart-Tilman - Agora]":"304",
        "B31 Portalis (2/89) [Liège Sart-Tilman - Agora]":"B31 Portalis",
        "B35a Bacq & Florkin (1/8) [Liège Sart-Tilman - Hopital]":"B&F",
        "B36 Jorissen (0/3) [Liège Sart-Tilman - Hopital]":"Jorissen",
        "B35a Roskam (0/8) [Liège Sart-Tilman - Hopital]" : "Roskam",
        "B7b A202 (0/26) [Liège Sart-Tilman - Agora]":"202",
        "B36 TP Microbiologie (-1/29) [Liège Sart-Tilman - Hopital]":"Salle TP Microbio",
        "B36 salle 3 (-1/14) [Liège Sart-Tilman - Hopital]":"BP3",
        "B36 salle 4 (-1/13) [Liège Sart-Tilman - Hopital]":"BP4",
        "B36 salle 5 (-1/12) [Liège Sart-Tilman - Hopital]":"BP5",
        "B36 salle 6 (-1/11) [Liège Sart-Tilman - Hopital]":"BP6",
        "B36 salle 1 (-1/16) [Liège Sart-Tilman - Hopital]": "BP1",
        "B36 salle 2 (-1/15) [Liège Sart-Tilman - Hopital]": "BP2",
        "B23 salle 14 (-1/7) [Liège Sart-Tilman - Hopital]": "BP14",
        "B23 salle 15 (-1/8) [Liège Sart-Tilman - Hopital]": "BP15",
        "B23 salle 16 (-1/9) [Liège Sart-Tilman - Hopital]": "BP16",
        "B36 salle 7 (-1/10) [Liège Sart-Tilman - Hopital]":"BP7",
        "B35a Welsch (0/7) [Liège Sart-Tilman - Hopital]": "Welsch",

        // Delete these texts from the calendar
        "Introduction médecine générale":"",
        "Microbiologie médicale (MICR0330-A-d)":"",
        "Microbiologie générale et clinique (MICR1717-A-a)":"",
        " I ":"",
        "(PATH0136-A-a)":"",
        "Travaux dirigés":"",
        "Travaux pratiques":"",
        "via podcast e-campus":"",
        "en ligne":"",
        "Podcast via e-campus":"",
        "Cours": "",
    };

function replaceText(node) {
    if (node && node.nodeType === Node.TEXT_NODE) {
        for (let key in replacements) {
            const regex = new RegExp(escapeRegExp(key), 'g');
            node.nodeValue = node.nodeValue.replace(regex, replacements[key]);
        }
    } else if (node && node.nodeType === Node.ELEMENT_NODE) {
        // Hide elements containing "Activité annulée"
        if (node.textContent.includes("Activité annulée")) {
            node.style.display = "none";
            return;
        }
        // Replace text in other nodes
        node.childNodes.forEach(replaceText);
    }
}
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                replaceText(node);
            });
        });
    });
    replaceText(document.body);
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
