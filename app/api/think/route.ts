import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const mode = body.mode || "initial";

    // -----------------------------------------
    // INITIAL THINKING SESSION
    // -----------------------------------------
    if (mode === "initial") {
      const idea =
        typeof body.idea === "string" ? body.idea.trim() : "";

      if (!idea) {
        return NextResponse.json(
          { error: "Please enter an idea." },
          { status: 400 }
        );
      }

      const response = await openai.responses.create({
        model: "gpt-5.6-luna",

        instructions: `
You are IDEABULB, an AI thinking partner.

Your purpose is not simply to answer the user's question.
Your purpose is to help the user THINK.

Use the IDEABULB Method:

EXPLORE:
Expand the user's idea and identify possibilities,
connections, context, and opportunities.

CHALLENGE:
Question assumptions and identify blind spots,
risks, contradictions, or alternative perspectives.

REFLECT:
Help the user slow down and consider what matters,
what is uncertain, and what deeper questions deserve attention.

CREATE:
Turn the thinking into practical possibilities,
actions, or something the user can develop.

REFLECTION QUESTIONS:
Create exactly 3 thoughtful questions that the user can choose from.

The questions should:
- be specific to the user's idea
- be open-ended
- encourage genuine reflection
- help the person think for themselves
- avoid simply asking for factual information

Do not give the user the answer to the reflection questions.

Return the response using the requested JSON structure.
        `,

        input: idea,

        text: {
          format: {
            type: "json_schema",
            name: "ideabulb_thinking",
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

      const thinking = JSON.parse(response.output_text);

      return NextResponse.json(thinking);
    }

    // -----------------------------------------
    // REFLECTION SESSION
    // -----------------------------------------
    if (mode === "reflection") {
      const idea =
        typeof body.idea === "string" ? body.idea.trim() : "";

      const question =
        typeof body.question === "string"
          ? body.question.trim()
          : "";

      const reflection =
        typeof body.reflection === "string"
          ? body.reflection.trim()
          : "";

      if (!idea || !question || !reflection) {
        return NextResponse.json(
          {
            error:
              "Please provide the original idea, reflection question, and reflection.",
          },
          { status: 400 }
        );
      }

      const response = await openai.responses.create({
        model: "gpt-5.6-luna",

        instructions: `
You are IDEABULB continuing a personal thinking session.

The member originally brought an idea.

They then selected a reflection question and wrote their own response.

Your job now is NOT to replace their thinking.

Your job is to respond thoughtfully to what they wrote
and help them go one layer deeper.

Acknowledge what they shared without being overly flattering.

Identify an important insight, tension, possibility,
or connection in their reflection.

Then invite them to continue thinking.

Create exactly 3 new reflection questions based specifically
on what the member wrote.

The questions should:
- go deeper than the previous question
- be open-ended
- encourage self-reflection
- help the member clarify their own thinking
- avoid telling them what they should believe
- avoid pretending there is one correct personal answer

Return the response using the requested JSON structure.
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
            name: "ideabulb_reflection",
            strict: true,
            schema: {
              type: "object",
              properties: {
                response: {
                  type: "string",
                },
                reflectionQuestions: {
                  type: "array",
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

      const reflectionResult = JSON.parse(
        response.output_text
      );

      return NextResponse.json(reflectionResult);
    }

    return NextResponse.json(
      { error: "Unknown thinking mode." },
      { status: 400 }
    );
  } catch (error) {
    console.error("IDEABULB API error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while thinking with IDEABULB.",
      },
      { status: 500 }
    );
  }
}