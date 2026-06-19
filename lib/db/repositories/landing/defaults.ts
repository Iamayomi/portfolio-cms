import type { LandingContent } from "../../../types/landing";

export const defaultLandingContent: Omit<
  LandingContent,
  "_id" | "createdAt" | "updatedAt"
> = {
  key: "landing",
  hero: {
    pageLabel: "Page 01 / working note",
    greeting: "Hi, I'm Somto",
    headline:
      "I build web products and backend systems, while growing deeper into smart contract development and security.",
    intro:
      "I build web products end to end. Lately I have been spending more time with Solidity, Foundry, and the small mistakes that make protocol logic unsafe.",
    portraitImageUrl: "/dp.png",
    primaryCta: {
      label: "See builds",
      href: "/builds",
      published: true,
      variant: "primary",
    },
    secondaryCta: {
      label: "Contact",
      href: "/contact",
      published: true,
      variant: "secondary",
    },
    snapshots: [
      {
        label: "Started",
        value: "Fullstack work since 2022.",
      },
      {
        label: "Now",
        value: "Building deeper Solidity and security habits.",
      },
      {
        label: "Open to",
        value:
          "Product engineering, Web3 frontend, and early security-facing work.",
      },
    ],
  },
  selectedWorks: {
    eyebrow: "Selected work",
    title: "Small proof I can explain",
    linkLabel: "All builds",
    linkHref: "/builds",
    featuredCount: 3,
  },
  selectedNotes: {
    eyebrow: "Selected notes",
    title: "Writing on engineering, Web3, and other fun stuff (maybe)",
    linkLabel: "All notes",
    linkHref: "/notes",
    featuredCount: 10,
  },
  aside: {
    studyTitle: "Current study",
    studyDescription:
      "I am treating smart contract security as practice first, proof later.",
    studyItems: [
      "Solidity fundamentals",
      "Foundry tests",
      "Access control",
      "Reentrancy",
      "Protocol assumptions",
    ],
    toolboxTitle: "Toolbox",
    toolboxDescription:
      "The tools I reach for when I need to build, shape, ship, or study a system properly.",
    skillGroups: [
      {
        title: "Build apps",
        description:
          "Frameworks, runtimes, APIs, and databases I use for product work.",
        skills: [
          "Next.js",
          "React",
          "TypeScript",
          "Node.js",
          "NestJS",
          "Express.js",
          "Prisma",
          "PostgreSQL",
          "MongoDB",
          "REST APIs",
        ],
      },
      {
        title: "Shape interfaces",
        description:
          "State, forms, validation, styling, and motion tools for clean UI.",
        skills: [
          "Zustand",
          "Redux Toolkit",
          "React Query",
          "React Hook Form",
          "Zod",
          "Tailwind CSS",
          "shadcn/ui",
          "Framer Motion",
        ],
      },
      {
        title: "Work with chains",
        description:
          "Web3 and EVM tools I use while growing into protocol work.",
        skills: [
          "Solidity",
          "Foundry",
          "EVM",
          "ethers.js",
          "web3.js",
          "Wagmi",
          "Viem",
          "RainbowKit",
          "Hardhat",
        ],
      },
      {
        title: "Study security",
        description: "The habits I am building for smart contract review.",
        skills: [
          "Invariant thinking",
          "Access control",
          "Reentrancy",
          "Fuzz testing",
          "Threat modeling",
          "Writeups",
        ],
      },
    ],
  },
};
