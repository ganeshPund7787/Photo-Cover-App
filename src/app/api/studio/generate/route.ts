import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { generateRandomImage } from "@/lib/studio";
import { STUDIO_STYLE_PROMPTS } from "@/lib/studio-prompts";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const DAILY_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const { prompt, style } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    if (!STUDIO_STYLE_PROMPTS[style]) {
      return NextResponse.json({ error: "Invalid style" }, { status: 400 });
    }

    // Check daily limit
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await db.generatedImage.count({
      where: {
        userId,
        createdAt: { gte: startOfDay },
      },
    });

    if (todayCount >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Daily limit reached. You can generate 3 images per day. Come back tomorrow!",
          limitInfo: { used: todayCount, limit: DAILY_LIMIT, remaining: 0 },
        },
        { status: 429 },
      );
    }

    // Generate image
    const stylePrompt = STUDIO_STYLE_PROMPTS[style];
    const fullPrompt = `${prompt.trim()}, ${stylePrompt}`;
    const imageBase64 = await generateRandomImage(fullPrompt);

    // Save to DB
    await db.generatedImage.create({
      data: {
        userId,
        prompt: prompt.trim(),
        style,
        imageUrl: imageBase64,
      },
    });

    const newCount = todayCount + 1;

    return NextResponse.json({
      image: imageBase64,
      limitInfo: {
        used: newCount,
        limit: DAILY_LIMIT,
        remaining: DAILY_LIMIT - newCount,
      },
    });
  } catch (error: any) {
    console.error("Studio generate error:", error);
    return NextResponse.json(
      { error: error.message || "Generation failed" },
      { status: 500 },
    );
  }
}
