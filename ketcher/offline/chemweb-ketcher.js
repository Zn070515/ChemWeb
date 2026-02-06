(function () {
    const root = document.getElementById('root');
    const panelBtn = document.getElementById('chemweb-toggle-panel');
    const outputBtn = document.getElementById('chemweb-toggle-output');
    const preview3dBtn = document.getElementById('chemweb-toggle-3d');

    if (!root || !panelBtn || !outputBtn || !preview3dBtn) {
        return;
    }

    function findLayoutContainer() {
        const candidates = root.querySelectorAll('div');
        for (const el of candidates) {
            const style = window.getComputedStyle(el);
            if (style.display !== 'grid') {
                continue;
            }
            if (el.children.length < 2) {
                continue;
            }
            return el;
        }
        return null;
    }

    function setupLayout(layout) {
        const panel = layout.children[1];
        const output = layout.children[2];
        if (!panel || !output) {
            return;
        }

        let panelHidden = true;
        let outputHidden = true;
        let preview3dRequested = false;

        const tryOpen3DTab = () => {
            const directTargets = [
                '[data-testid="3D Viewer button"]',
                '[data-testid="miew-button"]',
                '[data-testid="miew"]'
            ];
            for (const selector of directTargets) {
                const target = root.querySelector(selector);
                if (target) {
                    target.click();
                    return true;
                }
            }

            const candidates = root.querySelectorAll(
                'button, [role="tab"], [role="button"], [data-testid], [title]'
            );
            for (const el of candidates) {
                const text = (el.textContent || '').trim();
                const title = (el.getAttribute('title') || '').trim();
                const testId = (el.getAttribute('data-testid') || '').trim();
                if (
                    text.toLowerCase() === '3d' ||
                    text.toLowerCase().includes('3d') ||
                    title.toLowerCase().includes('3d') ||
                    testId.toLowerCase().includes('3d')
                ) {
                    el.click();
                    return true;
                }
            }
            return false;
        };

        const applyLayout = () => {
            panel.style.display = panelHidden ? 'none' : '';
            output.style.display = outputHidden ? 'none' : '';

            const columns = ['1fr'];
            if (!panelHidden) {
                columns.push('270px');
            }
            if (!outputHidden) {
                columns.push('320px');
            }
            layout.style.gridTemplateColumns = columns.join(' ');
            layout.style.removeProperty('grid-template-areas');

            panelBtn.classList.toggle('is-active', !panelHidden);
            outputBtn.classList.toggle('is-active', !outputHidden);
            preview3dBtn.classList.toggle(
                'is-active',
                !outputHidden && preview3dRequested
            );
        };

        panelBtn.addEventListener('click', () => {
            panelHidden = !panelHidden;
            applyLayout();
        });

        outputBtn.addEventListener('click', () => {
            outputHidden = !outputHidden;
            if (outputHidden) {
                preview3dRequested = false;
            }
            applyLayout();
        });

        preview3dBtn.addEventListener('click', () => {
            outputHidden = false;
            preview3dRequested = true;
            applyLayout();
            window.setTimeout(() => {
                if (!tryOpen3DTab()) {
                    preview3dRequested = false;
                    preview3dBtn.classList.remove('is-active');
                }
            }, 200);
        });

        applyLayout();
    }

    const observer = new MutationObserver(() => {
        const layout = findLayoutContainer();
        if (layout) {
            observer.disconnect();
            setupLayout(layout);
        }
    });

    observer.observe(root, { childList: true, subtree: true });

    const initialLayout = findLayoutContainer();
    if (initialLayout) {
        observer.disconnect();
        setupLayout(initialLayout);
    }
})();
