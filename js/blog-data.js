// Single source of truth for blog post order, metadata, and navigation.
// Newest first. To add/reorder a post, edit this list only -
// the blog listing page and each post's prev/next links are generated from it.
const BLOG_POSTS = [
    {
        id: "robot-rl",
        title: "A Robot comes to Life with Reinforcement Learning",
        url: "blog/RobotRL/index.html",
        date: "Oct 5, 2026",
        tags: ["Concepts", "Technical", "Research"],
        desc: "Learning with trial and error. Balancing Exploration and Exploitation. Acting with Foresight.",
        external: false
    },
    {
        id: "efficient-processing-dnn",
        title: "Efficient Processing of DNNs",
        url: "blog/Efficient_Processing_DNN/index.html",
        date: "Sep 1, 2026",
        tags: ["Concepts", "Technical", "Computer Architecture"],
        desc: "Get a 10K feet view of Effecient Processing and the diversity of ideas blooming under this umbrella",
        external: false
    },
    {
        id: "seoul-bike-eda",
        title: "Exploratory Data Analysis of the Rented Bike Count in Seoul",
        url: "blog/seoul-bike-eda/index.html",
        date: "Aug 30, 2026",
        tags: ["Concepts", "Application", "Technical"],
        desc: "Digging into the Seoul rented-bike-count dataset - demand patterns across weather, season, and time of day",
        external: false
    },
    {
        id: "life-of-lots-of-pie",
        title: "Life of Lots of Pie",
        url: "blog/life-of-lots-of-pie/index.html",
        date: "May 26, 2026",
        tags: ["Reflections"],
        desc: "About my JEE journey, hopefully insightful and motivating to JEE aspirants",
        external: false
    },
    {
        id: "tale-that-tells-taste",
        title: "The Tale that tells Taste",
        url: "blog/tale-that-tells-taste/index.html",
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
        url: "blog/japan/index.html",
        date: "May 20, 2025",
        tags: ["Travel"],
        desc: "An account of my trip to Japan",
        external: false
    }
];
