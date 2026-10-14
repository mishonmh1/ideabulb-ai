
"use client";

import { useMemo } from "react";

type DailyReflectionProps = {
  onChooseQuestion: (question: string) => void;
};

const spiritualQuestions = [
  {
    scripture: "Mark 4:35–41",
    question:
      "Why were the disciples afraid even though Jesus was with them in the boat?",
    description:
      "Read the passage. What does this story reveal about fear, faith, and how we understand God's presence during difficult moments?",
  },
  {
    scripture: "Luke 10:25–37",
    question: "Who is my neighbor, and what does it mean to love them?",
    description:
      "Read the parable of the Good Samaritan. Who gets included in our definition of neighbor, and who might we be overlooking?",
  },
  {
    scripture: "John 8:1–11",
    question:
      "What does this story teach us about judgment, mercy, and accountability?",
    description:
      "Read the passage carefully. Pay attention to who is judging, who is being judged, and how Jesus responds.",
  },
  {
    scripture: "Micah 6:6–8",
    question: "What does it mean to do justice, love mercy, and walk humbly?",
    description:
      "Read the passage. How might these words shape the way we treat people and participate in our communities?",
  },
  {
    scripture: "Psalm 13",
    question: "Can we be honest with God when we feel abandoned or forgotten?",
    description:
      "Read this psalm of lament. What do you notice about the writer's honesty, emotions, and movement through the prayer?",
  },
  {
    scripture: "Matthew 6:25–34",
    question: "What is the difference between trusting God and ignoring our worries?",
    description:
      "Read the passage. What does Jesus say about worry, daily needs, and the present moment?",
  },
  {
    scripture: "Genesis 1:26–31",
    question: "What does it mean for human beings to be made in God's image?",
    description:
      "Read the creation story. How might this passage influence the way we understand human dignity and the worth of others?",
  },
  {
    scripture: "Luke 15:11–32",
    question: "Who deserves forgiveness, and who gets to decide?",
    description:
      "Read the parable of the two sons. Consider the perspectives of the younger son, the older son, and the father.",
  },
  {
    scripture: "James 2:14–18",
    question: "What is the relationship between faith and action?",
    description:
      "Read the passage. How does the writer connect what we believe with the way we respond to people's needs?",
  },
  {
    scripture: "John 20:24–29",
    question: "Is doubt the opposite of faith, or can they exist together?",
    description:
      "Read Thomas's encounter with the risen Jesus. What does the story suggest about questions, evidence, and belief?",
  },
  {
    scripture: "Matthew 5:1–12",
    question: "Why does Jesus call the poor in spirit and those who mourn blessed?",
    description:
      "Read the Beatitudes slowly. How might Jesus' vision of blessing challenge the way society defines success?",
  },
  {
    scripture: "Acts 8:26–40",
    question: "What can we learn from asking someone to help us understand scripture?",
    description:
      "Read the story of Philip and the Ethiopian official. Notice the role of questions, interpretation, and welcome.",
  },
];

function getDailyQuestion() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / 86400000
  );

  return spiritualQuestions[
    (dayOfYear - 1) % spiritualQuestions.length
  ];
}

export default function DailyReflection({
  onChooseQuestion,
}: DailyReflectionProps) {
  const dailyReflection = useMemo(() => getDailyQuestion(), []);

  const reflectionPrompt = [
    `Scripture: ${dailyReflection.scripture}`,
    `Question: ${dailyReflection.question}`,
    dailyReflection.description,
  ].join("\n\n");

  return (
    <section className="rounded-[2rem] border border-[#d6a72c]/30 bg-white p-7 shadow-sm sm:p-10">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8b6b11]">
        Daily Spiritual Reflection
      </p>

      <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
        Open your Bible. Explore the question.
      </h2>

      <div className="mt-7 rounded-2xl bg-[#f8f5ed] p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-[#8b6b11]">
          Today's Scripture
        </p>

        <p className="mt-2 text-xl font-black">
          {dailyReflection.scripture}
        </p>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-[#8b6b11]">
          Today's Question
        </p>

        <h3 className="mt-2 text-2xl font-bold leading-snug">
          {dailyReflection.question}
        </h3>

        <p className="mt-4 leading-7 text-[#14213d]/70">
          {dailyReflection.description}
        </p>
      </div>

      <p className="mt-5 text-sm leading-6 text-[#14213d]/65">
        Take a few minutes to read the passage. Notice what stands out,
        what challenges you, and what questions you still have.
        You don't need to have every answer.
      </p>

      <button
        type="button"
        onClick={() => onChooseQuestion(reflectionPrompt)}
        className="mt-7 rounded-full bg-[#14213d] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#1c2e52]"
      >
        Reflect on This
      </button>
    </section>
  );
}
