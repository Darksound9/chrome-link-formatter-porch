document.addEventListener('DOMContentLoaded', function () {
    const btnSlack = document.getElementById('btnSlack');
    const btnSlackShort = document.getElementById('btnSlackShort');
    const btnSlackIDOnly = document.getElementById('btnSlackIDOnly');
    const btnBitBucketPR = document.getElementById('btnBitBucketPR');

    let currentTitle = '';
    let currentID = '';
    let currentUrl = '';
    let BBPRTitle = '';

    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        const activeTab = tabs[0];
        currentTitle = activeTab.title || '';
        currentID = activeTab.url || '';
        currentUrl = activeTab.url || '';
        BBRPRTitle = '';
        chrome.tabs.sendMessage(tabs[0].id, {data: "hello"}, response => {
            if (response) {
            BBPRTitle = response;
            }
        });
    });

    // Button handlers

    // Slack (full)
    btnSlack.addEventListener('click', function () {
        const safeTitle = sanitizeTitleForSlack(currentTitle);
        const slackLink = `[${safeTitle}](${currentUrl})`;
        copyToClipboard(slackLink, btnSlack);
    });

    // Slack Short
    btnSlackShort.addEventListener('click', function () {
        // Sanitize
        let safeTitle = sanitizeTitleForSlack(currentTitle);
        // Truncate
        safeTitle = shortifyTitle(safeTitle, 35);
        // Build
        const slackLink = `[${safeTitle}](${currentUrl})`;
        copyToClipboard(slackLink, btnSlackShort);
    });

    // Slack (ID Only)
    btnSlackIDOnly.addEventListener('click', function () {
        const safeID = sanitizeTitleForSlackIDOnly(currentID);
        const slackLink = `[${safeID}](${currentUrl})`;
        //test
        copyToClipboard(slackLink, btnSlackIDOnly);
    });
    
    //Bitbucket PR Copy URL (with title)
    btnBitBucketPR.addEventListener('click', function () {
        if (BBPRTitle) {
            const slackLink = `[${BBPRTitle + ' PR'}](${currentUrl})`;
            copyToClipboard(slackLink, btnBitBucketPR);
        }
    });
    

    // Copy and feedback
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            showCopiedOnButton(button);
        }).catch(err => {
            console.error('Copy error:', err);
        });
    }

    function showCopiedOnButton(button) {
        const originalText = button.textContent;
        const originalBg = getComputedStyle(button).backgroundColor;

        button.textContent = 'Copied!';
        button.style.backgroundColor = 'oklch(0.648 0.2 131.684)';

        setTimeout(() => {
            // Restore original values
            button.textContent = originalText;
            button.style.backgroundColor = originalBg;
        }, 1000);
    }

    // Shortify title
    function shortifyTitle(title, maxLen) {
        if (title.length > maxLen) {
            return title.slice(0, maxLen) + '...';
        }
        return title;
    }

    function sanitizeTitleForSlack(title) {
        return title
            .replace(/\[/g, '(')
            .replace(/\]/g, ')')
            .replace(/\(/g, '{')
            .replace(/\)/g, '}');
    }

    function sanitizeTitleForSlackIDOnly(title) {
        return title
            .replace('https://porchsoftware.atlassian.net/browse/', '');
    }
});
