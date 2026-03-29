import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const DAILY_LIMIT = 3;

export async function GET(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      // Not logged in — return full limit so UI doesn't break
      return NextResponse.json({
        used: 0,
        limit: DAILY_LIMIT,
        remaining: DAILY_LIMIT,
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const used = await db.generatedImage.count({
      where: {
        userId: user.id,
        createdAt: { gte: startOfDay },
      },
    });

    return NextResponse.json({
      used,
      limit: DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - used),
    });
  } catch (error) {
    return NextResponse.json({
      used: 0,
      limit: DAILY_LIMIT,
      remaining: DAILY_LIMIT,
    });
  }
}
