// Renders the blog listing page and each post's header/prev-next nav
// from the single ordered list in js/blog-data.js.
document.addEventListener("DOMContentLoaded", () => {
    if (typeof BLOG_POSTS === "undefined") return;

    const inBlogPost = /\/blog\/[^/]+\/[^/]*$/.test(window.location.pathname);
    const basePath = inBlogPost ? '../../' : '';

    const externalIcon = '<svg class="external-link-icon" viewBox="0 0 24 24" width="14" height="14"><path d="M14 3h7v7h-2v-3.586l-9.293 9.293-1.414-1.414 9.293-9.293h-3.586v-2zM5 21c-1.103 0-2-.897-2-2v-14c0-1.103.897-2 2-2h7v2h-7v14h14v-7h2v7c0 1.103-.897 2-2 2h-14z"/></svg>';

    const resolveUrl = (post) => post.external ? post.url : basePath + post.url;
    const linkAttrs = (post) => post.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const linkLabel = (post) => post.title + (post.external ? ' ' + externalIcon : '');
    const tagChips = (post) => post.tags.map(t => `<span class="blog-tag-chip">${t}</span>`).join('');
    const metaHTML = (post) => `<span class="blog-date">${post.date}</span><span class="blog-tags-display">${tagChips(post)}</span>`;

    // --- Blog listing page ---
    const listEl = document.getElementById('blog-list');
    if (listEl) {
        listEl.innerHTML = BLOG_POSTS.map(post => `
            <article class="blog-sect" data-reveal data-tags="${post.tags.map(t => t.toLowerCase()).join(',')}">
                <h3><a href="${resolveUrl(post)}"${linkAttrs(post)}>${linkLabel(post)}</a></h3>
                <div class="blog-meta">${metaHTML(post)}</div>
                <p class="blog-desc">${post.desc}</p>
            </article>
        `).join('');
    }

    // --- Blog hero quote rotation ---
    const heroImg = document.getElementById('blog-hero-img');
    if (heroImg && typeof BLOG_QUOTES !== "undefined" && BLOG_QUOTES.length > 1) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let quoteIndex = 0;

        setInterval(() => {
            quoteIndex = (quoteIndex + 1) % BLOG_QUOTES.length;
            const nextQuote = BLOG_QUOTES[quoteIndex];

            const swap = () => {
                heroImg.src = nextQuote.src;
                heroImg.alt = nextQuote.alt;
            };

            if (prefersReducedMotion) {
                swap();
            } else {
                heroImg.classList.add('is-fading');
                setTimeout(() => {
                    swap();
                    heroImg.classList.remove('is-fading');
                }, 300);
            }
        }, 5000);
    }

    // --- Individual blog post page ---
    const headerEl = document.querySelector('.blog-post-header[data-blog-id]');
    if (!headerEl) return;

    const index = BLOG_POSTS.findIndex(p => p.id === headerEl.dataset.blogId);
    if (index === -1) return;

    const post = BLOG_POSTS[index];
    headerEl.innerHTML = `<h2>${post.title}</h2><div class="blog-meta">${metaHTML(post)}</div>`;

    const endEl = document.getElementById('blog-end');
    if (!endEl) return;

    const prev = BLOG_POSTS[index + 1]; // older post
    const next = BLOG_POSTS[index - 1]; // newer post

    endEl.innerHTML = `
        <div class="blog-nav-container">
            <div class="blog-nav-prev">
                ${prev ? `<span class="blog-nav-label">← Previous Blog</span><a href="${resolveUrl(prev)}"${linkAttrs(prev)}>${linkLabel(prev)}</a>` : ''}
            </div>
            <div class="blog-nav-next">
                ${next ? `<span class="blog-nav-label">Next Blog →</span><a href="${resolveUrl(next)}"${linkAttrs(next)}>${linkLabel(next)}</a>` : ''}
            </div>
        </div>
    `;
});
