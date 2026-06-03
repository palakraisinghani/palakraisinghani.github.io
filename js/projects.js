document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const contentContainer = document.getElementById('project-content');

    if (tabs.length > 0 && contentContainer) {
        
        const loadContent = async (filename) => {
            contentContainer.innerHTML = '<p>Loading...</p>';
            try {
                // Adjust base path if needed, though this script is meant to be run from projects.html
                const response = await fetch(`projects/${filename}`);
                if (response.ok) {
                    const html = await response.text();
                    contentContainer.innerHTML = html;
                } else {
                    contentContainer.innerHTML = '<p>Error loading projects. Ensure you are running this via a local web server (e.g. VS Code Live Server or python -m http.server).</p>';
                }
            } catch (error) {
                contentContainer.innerHTML = '<p>Error loading projects. Ensure you are running this via a local web server to avoid CORS issues.</p>';
                console.error("Fetch error: ", error);
            }
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                loadContent(tab.dataset.target);
            });
        });

        // Load the initial active tab
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            loadContent(activeTab.dataset.target);
        }
    }
});