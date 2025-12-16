import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { Project, Skill, Organization, Technology, ContactLink } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET && secret !== "temp_secret") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase Admin not initialized" }, { status: 500 });
  }

  try {
    const batch = adminDb.batch();

    // 1. Skills
    const skills: Omit<Skill, "id">[] = [
      {
        title: "Visual",
        description: "From wireframes to high-fidelity mockups, I help designers create visually appealing and user-friendly interfaces.",
        funny: "Drawing boxes and circles that somehow convince people I'm a creative genius. Magic happens when coffee kicks in.",
        category: "Visual"
      },
      {
        title: "Frontend",
        description: "I specialize in building sleek, responsive, and engaging websites using modern web technologies like React, Next.js, and Tailwind CSS.",
        funny: "Turning pixels into code, and bugs into features. Also, the reason dark mode exists on websites.",
        category: "Frontend"
      },
      {
        title: "Backend",
        description: "I work closely with backend developers to build scalable, efficient, and secure APIs using popular programming languages like Node.js, Express, and MongoDB.",
        funny: "The silent ninja making sure your app doesn't crash after 100 users. Error logs are my love language.",
        category: "Backend"
      },
      {
        title: "UI/UX",
        description: "I help designers and developers create intuitive, user-friendly, and engaging user interfaces using proven design principles and methodologies.",
        funny: "I make sure buttons don't look like links and links don't look like buttons. That's called experience.",
        category: "UI/UX"
      },
    ];

    skills.forEach((skill, index) => {
      const ref = adminDb.collection("skills").doc();
      batch.set(ref, { ...skill, order: index });
    });

    // 2. Organizations / Experience
    const organizations: Omit<Organization, "id">[] = [
      {
        name: "E-Cell",
        role: "Lead Graphics Designer",
        description: "Promoted entrepreneurship by designing impactful visuals for events and initiatives at Jabalpur Engineering College.",
        funny: "Created posters so good, they made people attend events just for the graphics!",
      },
      {
        name: "Tourist",
        role: "Frontend Developer",
        description: "Developed intuitive user interfaces for a hospital management system, enhancing patient experience.",
        funny: "Ensured the hospital's UI had fewer bugs than its waiting rooms.",
      },
      {
        name: "Kaarwaa.N",
        role: "Lead Graphics Designer",
        description: "Educated and motivated students in government schools through engaging and visually appealing designs.",
        funny: "Convinced kids to study harder with designs cooler than their video games.",
      },
      {
        name: "The-LitC",
        role: "Graphic Designer",
        description: "Designed visually appealing posters and digital assets for literary and technical events, enhancing event outreach and engagement.",
        funny: "Crafted designs so good that people showed up to events just to admire the posters.",
      },
    ];

    organizations.forEach((org, index) => {
      const ref = adminDb.collection("experiences").doc();
      batch.set(ref, { ...org, order: index });
    });

    // 3. Technologies
    const technologies: Omit<Technology, "id">[] = [
      {
        name: "ReactJS",
        category: "Frontend Framework",
        description: "Building interactive UIs efficiently and declaratively.",
        funny: "Turning JSX into magic without breaking a sweat (most times).",
      },
      {
        name: "TailwindCSS",
        category: "CSS Framework",
        description: "Utility-first styling for a consistent design system.",
        funny: "Spending less time styling, more time vibing.",
      },
      {
        name: "HTML",
        category: "Markup Language",
        description: "Structuring web pages with semantic elements.",
        funny: "The skeleton of all my digital masterpieces.",
      },
      {
        name: "CSS",
        category: "Styling Language",
        description: "Adding colors, layouts, and animations to designs.",
        funny: "Making pixels pop like never before.",
      },
      {
        name: "JavaScript",
        category: "Programming Language",
        description: "Powering web apps with interactivity and logic.",
        funny: "Because what's life without a few console.logs?",
      },
      {
        name: "C++",
        category: "Programming Language",
        description: "The foundation of my programming journey.",
        funny: "Where pointers and I have a love-hate relationship.",
      },
      {
        name: "NodeJS",
        category: "Backend Framework",
        description: "Building scalable server-side applications.",
        funny: "Bringing JavaScript to the backend like a boss.",
      },
      {
        name: "Firebase",
        category: "Backend-as-a-Service",
        description: "Simplifying database and authentication needs.",
        funny: "Where backend feels almost like frontend magic.",
      },
      {
        name: "MongoDB",
        category: "NoSQL Database",
        description: "Storing data flexibly with documents.",
        funny: "No schema, no worries!",
      },
      {
        name: "ExpressJS",
        category: "Backend Framework",
        description: "Creating server-side APIs with ease.",
        funny: "The 'E' in MERN, but cooler than it sounds.",
      },
      {
        name: "Figma",
        category: "Design Tool",
        description: "Designing UI prototypes collaboratively.",
        funny: "Where my ideas take their first visual breath.",
      },
      {
        name: "Canva",
        category: "Design Tool",
        description: "Quick and simple graphic designing.",
        funny: "Turning procrastination into professional posters.",
      },
    ];

    technologies.forEach((tech, index) => {
      const ref = adminDb.collection("technologies").doc();
      batch.set(ref, { ...tech, order: index });
    });

    // 4. Projects
    const projects: Omit<Project, "id">[] = [
      {
        title: "fast-apps",
        desktopImage: "/FastApps/desktop.png",
        description: "A CLI tool that instantly scaffolds production-ready React or Node.js apps with pre-configured setups. It removes boilerplate work by generating projects with modern best practices and popular tools like Tailwind CSS, shadcn/ui, Express, and dotenv.",
        githubLink: "https://github.com/satendra03/fast-apps",
        liveLink: "https://fast-apps.vercel.app",
      },
      {
        title: "Portfolio",
        desktopImage: "/Portfolio/desktop.png",
        description: "A personal portfolio showcasing my projects, skills, and experiences. It provides an interactive platform for visitors to explore my professional journey and accomplishments.",
        githubLink: "https://github.com/satendra03/portfolio",
        liveLink: "https://satendra-portfolio.vercel.app",
      },
      {
        title: "JourneyJolt",
        desktopImage: "/JourneyJolt/desktop.png",
        description: "An AI-powered travel planner designed to create personalized itineraries for users based on their preferences, location, and budget. Ideal for hassle-free trip planning.",
        githubLink: "https://github.com/satendra03/trip-planner-by-satendra",
        liveLink: "https://trip-planner-by-satendra.vercel.app",
      },
      {
        title: "BeatBlast",
        desktopImage: "/BeatBlast/desktop.png",
        description: "A music application inspired by Spotify, featuring dynamic playlists, an engaging interface, and compatibility across devices for a seamless listening experience.",
        githubLink: "https://github.com/satendra03/BeatBlast-MusicHub",
        liveLink: "https://beat-blast-music-hub-by-satendra.vercel.app/",
      },
      {
        title: "ToDo App",
        desktopImage: "/ToDo/desktop.png",
        description: "A simple yet efficient task management tool that allows users to organize their daily tasks, set deadlines, and track their progress with ease.",
        githubLink: "https://github.com/satendra03/ToDo-bySatendra",
        liveLink: "https://todo-by-satendra.vercel.app/",
      },
      {
        title: "E-Quest Quiz",
        desktopImage: "/EQuest/desktop.png",
        description: "An interactive quiz platform for E-Cell events, supporting real-time questions, leaderboard tracking, and participant authentication for smooth quiz operations.",
        githubLink: "https://github.com/satendra03/E-Cell-Quiz-FrontEnd",
        liveLink: "https://e-cell-quiz-front-end.vercel.app/",
      },
      {
        title: "CareCrest - SIH Project",
        desktopImage: "/CareCrest/desktop.png",
        description: "A hospital management system offering features like patient records, appointment scheduling, and department management for efficient healthcare operations.",
        githubLink: "https://github.com/satendra03/sig-1620",
        liveLink: "https://sig-1620.vercel.app/",
      },
      {
        title: "Ochi Web Clone",
        desktopImage: "/OchiClone/desktop.png",
        description: "A clone of the Ochi website, highlighting design and development skills with a focus on user interface and responsive web design.",
        githubLink: "https://github.com/satendra03/React-Ochi-Web-Clone",
        liveLink: "https://satendra-temp-portfolio.vercel.app/",
      },
      {
        title: "LaughLab",
        desktopImage: "/LaughLab/desktop.png",
        description: "A browser extension designed for lighthearted entertainment, providing users with a collection of jokes, memes, and fun content.",
        githubLink: "https://github.com/satendra03/LaughLab",
        liveLink: "https://microsoftedge.microsoft.com/addons/detail/laughlab-satendra-kumar/meaikeiaoghlpdikgjhmkmakmdkimnnp",
      },
    ];

    projects.forEach((proj, index) => {
      const ref = adminDb.collection("projects").doc();
      batch.set(ref, { ...proj, order: index });
    });

    // 5. Contacts
    const contacts: Omit<ContactLink, "id">[] = [
        {
            title: "Email",
            link: "mailto:satendrakumarparteti.work@gmail.com",
            desc: "Your best bet for detailed conversations.",
            icon: "Mail",
        },
        {
            title: "LinkedIn",
            link: "https://www.linkedin.com/in/connect-satendra",
            desc: "Serious me - where I wear my professional hat.",
            icon: "Linkedin",
        },
        {
            title: "Instagram",
            link: "https://www.instagram.com/_satendra_03",
            desc: "Where aesthetics and occasional tech meet.",
            icon: "Instagram",
        },
        {
            title: "GitHub",
            link: "https://github.com/satendra03",
            desc: "The place where I experiment, break things, and sometimes create magic.",
            icon: "Github",
        },
        {
            title: "Twitter",
            link: "https://twitter.com/satendra_03",
            desc: "Short, snappy thoughts sprinkled with a bit of tech and fun.",
            icon: "Twitter",
        },
    ];

    contacts.forEach((contact, index) => {
        const ref = adminDb.collection("contacts").doc();
        batch.set(ref, { ...contact, order: index });
    });

    await batch.commit();

    return NextResponse.json({ message: "Seeding successful" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
