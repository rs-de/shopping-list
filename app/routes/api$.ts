import { json, type ActionArgs } from "@remix-run/node";
import type { RateLimiterRes } from "rate-limiter-flexible";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { ShoppingListModel } from "~/services/shoppinglist";
const rateLimiterConfig = { points: 1, duration: 5 };
const rateLimiter = new RateLimiterMemory(rateLimiterConfig);
const isRateLimitError = (error: any): error is RateLimiterRes => {
  return "msBeforeNext" in error;
};

export async function action({ request }: ActionArgs) {
  switch (request.method) {
    case "POST": {
      try {
        const rateLimitResult = await rateLimiter.consume(
          "POSTShoppingList",
          1,
        );
        const shoppinglist = (
          await ShoppingListModel.create({ articles: [] })
        ).toObject();
        return json(shoppinglist, {
          headers: { ...rateLimitToHeaders(rateLimitResult) },
        });
      } catch (error) {
        if (isRateLimitError(error)) {
          console.error(error);
          return new Response(null, {
            status: 303,
            headers: {
              location: new URL(`/`, request.url).toString(),
              ...(isRateLimitError(error) && rateLimitToHeaders(error)),
            },
          });
        } else {
          throw new Response(null, { status: 500 });
        }
      }
    }
    default: {
      throw new Response(null, { status: 405 });
    }
  }
}

const rateLimitToHeaders = (rl: RateLimiterRes) => ({
  "retry-after": String(rl.msBeforeNext / 1000),
  "x-rateLimit-limit": String(rateLimiterConfig.points),
  "x-rateLimit-remaining": String(rl.remainingPoints),
  "x-rateLimit-reset": String(new Date(Date.now() + rl.msBeforeNext)),
});
