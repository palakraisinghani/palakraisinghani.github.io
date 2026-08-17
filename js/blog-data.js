// Single source of truth for blog post order, metadata, and navigation.
// Newest first. To add/reorder a post, edit this list only -
// the blog listing page and each post's prev/next links are generated from it.
const BLOG_POSTS = [
    {
        id: "life-of-lots-of-pie",
        title: "Life of Lots of Pie",
        url: "blog/Life_of_lots_of_pie.html",
        date: "May 26, 2026",
        tags: ["Reflections"],
        desc: "About my JEE journey, hopefully insightful and motivating to JEE aspirants",
        external: false
    },
    {
        id: "tale-that-tells-taste",
        title: "The Tale that tells Taste",
        url: "blog/the_tale_that_tells_taste.html",
        date: "May 22, 2026",
        tags: ["Philosophy", "Reflections"],
        desc: "Expectations spoil the fun, very easily",
        external: false
    },
    {
        id: "numbers-logic-garden-of-ideas",
        title: "Numbers, Logic & Garden of Ideas",
        url: "https://indianexpress.com/article/education/life-in-an-iit-numbers-logic-journey-pune-to-iisc-bangalore-jeemain-2026-jee-advanced-btech-mathematics-and-computing-10354651/",
        date: "Nov 12, 2025",
        tags: ["Reflections"],
        desc: "Indian Express article about JEE and my journey to IISc Bangalore",
        external: true
    },
    {
        id: "japan",
        title: "The Red Sun in the White Sky",
        url: "blog/japan.html",
        date: "May 20, 2025",
        tags: ["Travel"],
        desc: "An account of my trip to Japan",
        external: false
    }
];
