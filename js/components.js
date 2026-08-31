document.addEventListener("DOMContentLoaded", () => {
    // Determine the base path for links based on the current URL.
    // Each blog post lives in its own folder (blog/<slug>/index.html), so
    // post pages are two levels below the site root and need '../../'.
    const inBlogPost = /\/blog\/[^/]+\/[^/]*$/.test(window.location.pathname);
    const basePath = inBlogPost ? '../../' : '';

    const swatchHTML = `<div class="mg-swatch-bar" aria-hidden="true"></div>`;

    const headerHTML = `
    <header class="mg-topbar">
        <div class="mg-topbar-inner">
            <a class="mg-logo" href="${basePath}index.html">Palak Raisinghani</a>
            <nav class="mg-topnav">
                <a href="${basePath}index.html" data-page="index.html">About</a>
                <a href="${basePath}research.html" data-page="research.html">Research</a>
                <a href="${basePath}projects.html" data-page="projects.html">Projects</a>
                <a href="${basePath}experience.html" data-page="experience.html">Experience</a>
                <a href="${basePath}blog.html" data-page="blog.html">Blog</a>
            </nav>
            <div class="mg-topbar-actions">
                <a href="${basePath}assets/cv/CV_Palak_R.pdf" target="_blank">CV</a>
                <a href="https://www.linkedin.com/in/palak-raisinghani-656bab321/" target="_blank" aria-label="LinkedIn">
                    <svg class="mg-social-icon" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://github.com/palakraisinghani" target="_blank" aria-label="GitHub">
                    <svg class="mg-social-icon" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <button class="mg-theme-toggle" id="mg-theme-toggle" type="button" aria-label="Toggle dark mode">
                    <svg class="mg-social-icon mg-icon-sun" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/></svg>
                    <svg class="mg-social-icon mg-icon-moon" viewBox="0 0 24 24"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
                </button>
            </div>
        </div>
    </header>
    `;

    const footerHTML = `
    <footer class="mg-footer">
        <p>&copy; ${new Date().getFullYear()} Palak Raisinghani. All rights reserved.</p>
    </footer>
    `;

    const headerEl = document.getElementById("global-header");
    if (headerEl) {
        headerEl.innerHTML = swatchHTML + headerHTML;

        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        const matchFile = inBlogPost ? 'blog.html' : currentFile;
        headerEl.querySelectorAll('.mg-topnav a').forEach((link) => {
            if (link.dataset.page === matchFile) {
                link.classList.add('is-active');
            }
        });

        const themeToggle = document.getElementById('mg-theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('mg-theme', 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('mg-theme', 'dark');
                }
            });
        }
    }

    const footerEl = document.getElementById("global-footer");
    if (footerEl) {
        footerEl.innerHTML = footerHTML;
    }
});
