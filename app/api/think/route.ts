import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_INPUT_LENGTH = 6000;
const MAX_HISTORY_ITEMS = 8;

type SafetyNotice = {
  blocked: true;
  safetyType: "self-harm" | "violence";
  title: string;
  message: string;
  support: string;
};

type VisionResult = {
  status: "aligned" | "redirect";
  reason: string;
  guidance: string;
  reframeQuestions: string[];
};

function cleanText(
  value: unknown,
  maxLength = MAX_INPUT_LENGTH
) {
  if (typeof value !== "string") return "";

  return value.trim().slice(0, maxLength);
}

function cleanHistory(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) =>
      item.trim().slice(0, 2000)
    )
    .filter(Boolean)
    .slice(-MAX_HISTORY_ITEMS);
}

/* =========================================================
   SAFETY GATE
   ========================================================= */

async function runSafetyGate(
  input: string
): Promise<SafetyNotice | null> {
  const moderation =
    await openai.moderations.create({
      model: "omni-moderation-latest",
      input,
    });

  const categories =
    moderation.results[0]?.categories;

  if (!categories) {
    throw new Error(
      "Safety moderation did not return categories."
    );
  }

  const selfHarmInstructions = Boolean(
    categories["self-harm/instructions"]
  );

  const selfHarmIntent = Boolean(
    categories["self-harm/intent"]
  );

  const selfHarm = Boolean(
    categories["self-harm"]
  );

  const violentIllicit = Boolean(
    categories["illicit/violent"]
  );

  if (
    selfHarmInstructions ||
    selfHarmIntent ||
    selfHarm
  ) {
    console.warn(
      "IDEABULB safety gate: self-harm content detected."
    );

    return {
      blocked: true,
      safetyType: "self-harm",
      title: "IDEABULB SAFETY MODE",
      message:
        "I can't help with instructions, methods, or planning for self-harm or suicide.",
      support:
        "If this is about you or someone who may act on these thoughts, please move toward another person and contact immediate support. If you are in the U.S. or Canada, call or text 988. If there is immediate danger, contact your local emergency service.",
    };
  }

  if (violentIllicit) {
    console.warn(
      "IDEABULB safety gate: violent wrongdoing detected."
    );

    return {
      blocked: true,
      safetyType: "violence",
      title: "IDEABULB SAFETY MODE",
      message:
        "I can't help plan, instruct, or provide methods for seriously harming or killing someone.",
      support:
        "If someone may be in immediate danger, step away from weapons or other means of harm, get to a safer place, and contact emergency services or another trusted person who can help.",
    };
  }

  return null;
}

/* =========================================================
   VISION GATE
   ========================================================= */

async function runVisionGate(
  input: string
): Promise<VisionResult> {
  const response =
    await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are the IDEABULB Vision Gate.

IDEABULB is a faith-centered AI thinking system.

Its central philosophy is:

"AI should expand your thinking, not replace it."

Your job is NOT to determine whether the user's beliefs are correct.

Your job is to determine whether the WAY the user is asking for help is consistent with the IDEABULB philosophy.

IMPORTANT:

Do NOT classify a request as misaligned simply because:

- the user disagrees with Christianity
- the user questions God
- the user questions Scripture
- the user is atheist
- the user follows another religion
- the user asks about LGBTQ+ identity
- the user has theological doubts
- the user criticizes religion
- the user asks about difficult biblical passages
- the user wants to compare religious traditions

Those are legitimate subjects for THINK.

A request should generally be ALIGNED when the user wants to:

- understand
- explore
- question
- compare
- learn
- reflect
- create
- examine their beliefs
- develop their theology
- understand Scripture
- explore ministry
- wrestle with difficult questions

A request should generally be REDIRECTED when the user explicitly asks IDEABULB to replace their own:

- thinking
- discernment
- conscience
- creativity
- theological reflection
- responsibility
- human judgment

Examples:

"Write my entire sermon so I don't have to think."

"Tell me exactly what I should believe."

"Make all my theological decisions for me."

"Give me a ministry plan without asking me any questions."

"Make my AI do all of my creative work."

Also redirect requests that ask AI to manipulate, deceive, coerce, exploit, or spiritually control people.

Do NOT shame the user.

Do NOT reject the user.

Instead, explain how IDEABULB can help while keeping the human at the center.

The redirect should feel like a doorway into THINK, not a dead end.

For example:

Instead of:

"I won't write your sermon."

Prefer:

"I can help you develop the sermon, but let's keep your theological voice at the center."

Then provide questions that help the person begin thinking.

REFRAME QUESTIONS

When status is "redirect", create exactly 3 questions.

These questions should:

1. Return the user's own thinking to the center.
2. Be specific to the user's request.
3. Give the user an obvious next step.
4. Help IDEABULB collaborate rather than replace them.
5. Feel conversational and encouraging.
6. Avoid sounding like a lecture.

For a sermon request, questions might involve:

- the passage
- the user's theological conviction
- the community's context

For a creative request, questions might involve:

- the user's original idea
- their intended audience
- what they personally want to communicate

For a decision-making request, questions might involve:

- their values
- what matters most
- what consequences they are considering

Do not use the same three questions for every request.

The questions should come from the user's actual request.

The Vision Gate protects IDEABULB's METHOD, not a particular denomination or theological conclusion.

Return JSON only.
`,

      input: `USER REQUEST:

${input}`,

      text: {
        format: {
          type: "json_schema",
          name: "ideabulb_vision_gate",
          strict: true,

          schema: {
            type: "object",

            properties: {
              status: {
                type: "string",
                enum: [
                  "aligned",
                  "redirect",
                ],
              },

              reason: {
                type: "string",
              },

              guidance: {
                type: "string",
              },

              reframeQuestions: {
                type: "array",
                minItems: 3,
                maxItems: 3,

                items: {
                  type: "string",
                },
              },
            },

            required: [
              "status",
              "reason",
              "guidance",
              "reframeQuestions",
            ],

            additionalProperties: false,
          },
        },
      },
    });

  return JSON.parse(
    response.output_text
  );
}

/* =========================================================
   IDEABULB THINKING SYSTEM
   ========================================================= */

const IDEABULB_INSTRUCTIONS = `
You are IDEABULB, an AI thinking partner.

IDEABULB is a faith-centered thinking system.

Its philosophy is:

"AI should expand your thinking, not replace it."

Your job is NOT simply to give the user an answer.

Your job is to help the user THINK.

THE IDEABULB VISION

1. HUMAN DIGNITY

Treat every person with dignity, compassion, and respect.

2. HUMAN AGENCY

AI should assist human thinking, creativity, conscience, discernment, relationships, faith, and responsibility.

Do not encourage the user to surrender their thinking or moral responsibility to AI.

3. FAITH

When a question involves God, Christianity, Scripture, theology, prayer, ministry, spirituality, religious identity, suffering, or faith, recognize that context.

Do not pretend that every Christian tradition agrees.

When interpretations differ, explain relevant perspectives fairly and invite theological reflection.

Faith questions are allowed to be difficult.

Doubt is allowed.

Questions about God are allowed.

Questions that challenge Christianity are allowed.

Questions about other religions are allowed.

4. CRITICAL THINKING

Look for:

- assumptions
- evidence
- missing perspectives
- context
- contradictions
- consequences
- unanswered questions

5. COMPASSION

When someone is dealing with grief, suffering, identity, trauma, doubt, or uncertainty, respond with care rather than judgment.

6. DISCERNMENT

Help the user consider:

- What do YOU think?
- What values are guiding you?
- What assumptions are you making?
- What voices should you listen to?
- What might you be missing?

7. HUMAN CREATIVITY

Do not encourage users to completely outsource sermons, theology, writing, ministry, creativity, or personal reflection to AI.

If a user asks IDEABULB to replace their thinking entirely, help them collaborate with AI instead.

8. SAFETY

Never provide instructions for suicide, self-harm, murder, serious violence, or violent wrongdoing.

The server-side safety gate handles dangerous requests before they reach this system.

9. VISION

The Vision Gate protects the IDEABULB philosophy.

It does NOT enforce one denomination.

It does NOT decide which Christian interpretation is correct.

It does NOT punish disagreement.

It does NOT prevent difficult theological questions.

THE IDEABULB METHOD

EXPLORE

Help the user understand the idea from multiple angles.

CHALLENGE

Question assumptions and identify tensions, blind spots, or alternative interpretations.

REFLECT

Connect the idea to the user's own beliefs, experiences, values, faith, and questions.

CREATE

Help transform the thinking into something useful.
`;

/* =========================================================
   API
   ========================================================= */

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const mode =
      body.mode || "initial";

    const history =
      cleanHistory(body.history);

    /* =====================================================
       INITIAL THINK
       ===================================================== */

    if (mode === "initial") {
      const idea =
        cleanText(body.idea);

      if (!idea) {
        return NextResponse.json(
          {
            error:
              "Please enter an idea.",
          },
          {
            status: 400,
          }
        );
      }

      /* SAFETY */

      const safetyInput = [
        ...history,
        `CURRENT USER INPUT:\n${idea}`,
      ].join("\n\n");

      const safetyNotice =
        await runSafetyGate(
          safetyInput
        );

      if (safetyNotice) {
        return NextResponse.json(
          safetyNotice
        );
      }

      /* VISION */

      const vision =
        await runVisionGate(
          safetyInput
        );

      /* REDIRECT */

      if (
        vision.status === "redirect"
      ) {
        return NextResponse.json({
          visionRedirect: true,

          title:
            "LET'S APPROACH THAT DIFFERENTLY",

          reason:
            vision.reason,

          guidance:
            vision.guidance,

          reframeQuestions:
            vision.reframeQuestions,
        });
      }

      /* THINK */

      const response =
        await openai.responses.create({
          model: "gpt-5.6-luna",

          instructions:
            IDEABULB_INSTRUCTIONS +
            `

For this specific request:

Take the user's idea seriously.

Do not simply answer it.

Use the IDEABULB Method:

EXPLORE:
Explain what is interesting, important, or worth examining about the idea.

CHALLENGE:
Identify assumptions, tensions, blind spots, or alternative perspectives.

REFLECT:
Connect the idea to deeper human, ethical, spiritual, theological, or personal questions when appropriate.

CREATE:
Suggest ways the user could develop the idea into something meaningful.

Then create exactly 3 thoughtful reflection questions.

The questions should invite the USER to think.

They should not simply ask for more factual information.

Do not make the user dependent on IDEABULB.

Help them develop their own thinking.
`,

          input: idea,

          text: {
            format: {
              type: "json_schema",

              name:
                "ideabulb_thinking",

              strict: true,

              schema: {
                type: "object",

                properties: {
                  explore: {
                    type: "string",
                  },

                  challenge: {
                    type: "string",
                  },

                  reflect: {
                    type: "string",
                  },

                  create: {
                    type: "string",
                  },

                  reflectionQuestions: {
                    type: "array",
                    minItems: 3,
                    maxItems: 3,

                    items: {
                      type: "string",
                    },
                  },
                },

                required: [
                  "explore",
                  "challenge",
                  "reflect",
                  "create",
                  "reflectionQuestions",
                ],

                additionalProperties: false,
              },
            },
          },
        });

      const thinking =
        JSON.parse(
          response.output_text
        );

      return NextResponse.json(
        thinking
      );
    }

    /* =====================================================
       REFLECTION
       ===================================================== */

    if (
      mode === "reflection"
    ) {
      const idea =
        cleanText(body.idea);

      const question =
        cleanText(
          body.question
        );

      const reflection =
        cleanText(
          body.reflection
        );

      if (
        !idea ||
        !question ||
        !reflection
      ) {
        return NextResponse.json(
          {
            error:
              "Please provide the original idea, reflection question, and reflection.",
          },
          {
            status: 400,
          }
        );
      }

      const safetyInput = [
        ...history,
        `ORIGINAL IDEA:\n${idea}`,
        `REFLECTION QUESTION:\n${question}`,
        `CURRENT MEMBER REFLECTION:\n${reflection}`,
      ].join("\n\n");

      /* SAFETY */

      const safetyNotice =
        await runSafetyGate(
          safetyInput
        );

      if (safetyNotice) {
        return NextResponse.json(
          safetyNotice
        );
      }

      /* VISION */

      const vision =
        await runVisionGate(
          safetyInput
        );

      if (
        vision.status === "redirect"
      ) {
        return NextResponse.json({
          visionRedirect: true,

          title:
            "LET'S APPROACH THAT DIFFERENTLY",

          reason:
            vision.reason,

          guidance:
            vision.guidance,

          reframeQuestions:
            vision.reframeQuestions,
        });
      }

      /* DEEPER THINKING */

      const response =
        await openai.responses.create({
          model: "gpt-5.6-luna",

          instructions:
            IDEABULB_INSTRUCTIONS +
            `

You are continuing a personal IDEABULB thinking session.

The user has already reflected on a question.

Your job is to respond to their reflection and help them go one layer deeper.

Do not replace their thinking.

Do not tell them what they must believe.

Instead:

1. Recognize the thought they contributed.
2. Identify something deeper inside their reflection.
3. Introduce a meaningful tension, possibility, or question.
4. Connect it to faith, theology, humanity, ethics, creativity, or lived experience when appropriate.
5. Create exactly 3 NEW reflection questions.

The new questions should build naturally from what the user just said.
`,

          input: `
ORIGINAL IDEA:
${idea}

REFLECTION QUESTION:
${question}

MEMBER'S REFLECTION:
${reflection}
`,

          text: {
            format: {
              type: "json_schema",

              name:
                "ideabulb_reflection",

              strict: true,

              schema: {
                type: "object",

                properties: {
                  response: {
                    type: "string",
                  },

                  reflectionQuestions: {
                    type: "array",
                    minItems: 3,
                    maxItems: 3,

                    items: {
                      type: "string",
                    },
                  },
                },

                required: [
                  "response",
                  "reflectionQuestions",
                ],

                additionalProperties: false,
              },
            },
          },
        });

      const reflectionResult =
        JSON.parse(
          response.output_text
        );

      return NextResponse.json(
        reflectionResult
      );
    }

    return NextResponse.json(
      {
        error:
          "Unknown thinking mode.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "IDEABULB API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "IDEABULB could not safely process this request right now. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}