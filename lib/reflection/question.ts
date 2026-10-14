export type ReflectionTopic =
  | "Identity & Purpose"
  | "Relationships & Community"
  | "Faith & Spirituality"
  | "Justice & Society"
  | "Personal Growth"
  | "Science & The Future";

export type ReflectionQuestion = {
  id: string;
  topic: ReflectionTopic;
  question: string;
  description: string;
};

export const reflectionQuestions: ReflectionQuestion[] = [
  { id: "purpose-01", topic: "Identity & Purpose", question: "What makes a life meaningful to you?", description: "Think about the people, experiences, values, and choices that shape your sense of meaning." },
  { id: "purpose-02", topic: "Identity & Purpose", question: "What is something you believe today that you didn't believe five years ago?", description: "Consider what changed your perspective and what that change taught you." },
  { id: "purpose-03", topic: "Identity & Purpose", question: "How much of who you are comes from your own choices?", description: "Reflect on the influence of family, culture, experiences, and personal decisions." },
  { id: "relationships-01", topic: "Relationships & Community", question: "What makes you feel truly understood by another person?", description: "Consider what listening, trust, honesty, and care look like in your relationships." },
  { id: "relationships-02", topic: "Relationships & Community", question: "What does it mean to show up for someone?", description: "Think about the difference between being present and simply being nearby." },
  { id: "relationships-03", topic: "Relationships & Community", question: "How do you balance caring for others with caring for yourself?", description: "Reflect on boundaries, responsibility, rest, and the needs you sometimes overlook." },
  { id: "faith-01", topic: "Faith & Spirituality", question: "How have your beliefs shaped the way you see the world?", description: "Explore how faith, doubt, spiritual practice, or personal experience has influenced your perspective." },
  { id: "faith-02", topic: "Faith & Spirituality", question: "Can doubt be part of a meaningful spiritual life?", description: "Consider what questions and uncertainty can teach us about belief and understanding." },
  { id: "faith-03", topic: "Faith & Spirituality", question: "What does it mean to live according to your values?", description: "Think about the connection between what you say you believe and how you actually live." },
  { id: "justice-01", topic: "Justice & Society", question: "What does fairness look like when people start from different places?", description: "Reflect on equality, opportunity, history, and what a fair society might require." },
  { id: "justice-02", topic: "Justice & Society", question: "When should a community challenge a tradition?", description: "Consider when traditions preserve wisdom and when they may need to change." },
  { id: "justice-03", topic: "Justice & Society", question: "Whose perspectives are often missing from important conversations?", description: "Think about who gets heard, who gets overlooked, and why representation matters." },
  { id: "growth-01", topic: "Personal Growth", question: "What is something you are still learning to accept about yourself?", description: "Reflect with honesty and compassion on the parts of yourself you are still understanding." },
  { id: "growth-02", topic: "Personal Growth", question: "What would you try if you were less afraid of getting it wrong?", description: "Consider how fear affects your choices and what a small first step might look like." },
  { id: "growth-03", topic: "Personal Growth", question: "What does rest mean to you beyond simply stopping work?", description: "Explore the relationship between rest, health, worth, and your expectations of yourself." },
  { id: "future-01", topic: "Science & The Future", question: "What responsibilities come with creating powerful new technology?", description: "Consider innovation, accountability, privacy, access, and the people affected by new tools." },
  { id: "future-02", topic: "Science & The Future", question: "Can a technology be useful and still create harm?", description: "Think about trade-offs, unintended consequences, and how communities can respond." },
  { id: "future-03", topic: "Science & The Future", question: "What should never be sacrificed in the name of progress?", description: "Reflect on human dignity, relationships, freedom, and the values that guide innovation." },
];

export const reflectionTopics: ReflectionTopic[] = [
  "Identity & Purpose",
  "Relationships & Community",
  "Faith & Spirituality",
  "Justice & Society",
  "Personal Growth",
  "Science & The Future",
];

export function getDailyReflection(date = new Date()): ReflectionQuestion {
  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
  );
  const index =
    ((dayNumber % reflectionQuestions.length) + reflectionQuestions.length) %
    reflectionQuestions.length;
  return reflectionQuestions[index];
}

export function getQuestionsByTopic(
  topic: ReflectionTopic | "All Topics"
): ReflectionQuestion[] {
  if (topic === "All Topics") return reflectionQuestions;
  return reflectionQuestions.filter((item) => item.topic === topic);
}
