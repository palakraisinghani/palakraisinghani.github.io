// Main JavaScript file
console.log("Website loaded successfully.");

document.addEventListener('DOMContentLoaded', () => {
    // Blog tag filtering logic
    const tagButtons = document.querySelectorAll('.tag-btn');
    const blogPosts = document.querySelectorAll('.blog-sect');
    const activeTags = new Set();

    if (tagButtons.length > 0 && blogPosts.length > 0) {
        tagButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tag = btn.dataset.tag;
                
                // Toggle tag
                if (activeTags.has(tag)) {
                    activeTags.delete(tag);
                    btn.classList.remove('active');
                } else {
                    activeTags.add(tag);
                    btn.classList.add('active');
                }

                filterPosts();
            });
        });

        function filterPosts() {
            if (activeTags.size === 0) {
                // Show all if no tags selected
                blogPosts.forEach(post => post.classList.remove('hidden'));
                return;
            }

            blogPosts.forEach(post => {
                const postTags = post.dataset.tags ? post.dataset.tags.split(',').map(t => t.trim()) : [];
                // Check if post has at least one of the active tags
                const hasTag = [...activeTags].some(tag => postTags.includes(tag));
                
                if (hasTag) {
                    post.classList.remove('hidden');
                } else {
                    post.classList.add('hidden');
                }
            });
        }
    }
});
