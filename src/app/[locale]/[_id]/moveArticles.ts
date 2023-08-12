import { Article } from "@/app/api/shoppinglist";

export function moveArticles({
  idsToRejig,
  partitionNumber,
  partitionCount,
  articles,
}: {
  idsToRejig: string[];
  partitionNumber: number;
  partitionCount: number;
  articles: Article[];
}) {
  const filteredArticles = articles.filter(
    ({ _id }) => !idsToRejig.includes(_id!.toString()),
  );
  const articlesToRejig = articles.filter(({ _id }) =>
    idsToRejig.includes(_id!.toString()),
  );
  const articleCount = articles.length;
  const startIndex = Math.max(
    1,
    Math.floor(partitionNumber * Math.floor(articleCount / partitionCount)),
  );
  const rejiggedArticles = filteredArticles.slice();
  rejiggedArticles.splice(startIndex, 0, ...articlesToRejig);
  return rejiggedArticles;
}
