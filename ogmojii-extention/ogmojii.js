const baseDomain = window.location.hostname.split('.').slice(-2).join('.');
if (!['facebook.com', 'instagram.com'].includes(baseDomain)) return;

const regex = /(:[a-z0-9]|:[()-])+/gi;

function insertZeroWidthSpace(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
            const content = mutation.target.textContent;
            const modifiedContent = content.replace(regex, match => match.replace(/:/g, ":\u200B"));

            if (content !== modifiedContent) {
                mutation.target.textContent = modifiedContent;
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(mutation.target);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
}

const editableDivs = document.querySelectorAll('div[contenteditable="true"]');
const borderColor = baseDomain === 'facebook.com' ? 'blue' : 'pink';

editableDivs.forEach(function(div) {
    if (div.parentElement) {
        div.parentElement.style.border = `2px dashed ${borderColor}`;
    }
    const observer = new MutationObserver(insertZeroWidthSpace);
    observer.observe(div, { childList: true, characterData: true, subtree: true });
});