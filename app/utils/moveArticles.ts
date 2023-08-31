import type { Article } from "~/services/shoppinglist";

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
    //_id can be a Object, so we must call toString()
    // Issue originates in week mongoose TypeScript support
    ({ id }) => !idsToRejig.includes(id),
  );
  const articlesToRejig = articles.filter(({ id }) => idsToRejig.includes(id));
  const articleCount = articles.length;
  //startIndex >= 0
  const startIndex = Math.max(
    0,
    Math.floor(
      (partitionNumber - 1) * Math.floor(articleCount / (partitionCount - 1)),
    ),
  );
  const rejiggedArticles = filteredArticles.slice();
  rejiggedArticles.splice(startIndex, 0, ...articlesToRejig);
  return rejiggedArticles;
}
