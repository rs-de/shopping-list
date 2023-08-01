import { NextRequest, NextResponse } from "next/server";
import { ShoppingListModel } from "./shoppinglist";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

const rateLimiterConfig = { points: 1, duration: 5 };
const rateLimiter = new RateLimiterMemory(rateLimiterConfig);

export async function POST(req: NextRequest) {
  try {
    const rateLimitResult = await rateLimiter.consume("POSTShoppingList", 1);
    const { _id } = (await ShoppingListModel.create({ articles: [] })).toJSON();
    return NextResponse.redirect(new URL(`/${_id}`, req.url), {
      status: 303,
      headers: rateLimitToHeaders(rateLimitResult),
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 303,
      headers: {
        location: String(new URL(`/`, req.url)),
        ...(isRateLimitError(error) && rateLimitToHeaders(error)),
      },
    });
  }
}

const isRateLimitError = (error: any): error is RateLimiterRes => {
  return "msBeforeNext" in error;
};

const rateLimitToHeaders = (rl: RateLimiterRes) => ({
  "retry-after": String(rl.msBeforeNext / 1000),
  "x-rateLimit-limit": String(rateLimiterConfig.points),
  "x-rateLimit-remaining": String(rl.remainingPoints),
  "x-rateLimit-reset": String(new Date(Date.now() + rl.msBeforeNext)),
});
