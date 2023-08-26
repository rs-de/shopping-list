import { Response } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import TextShadow from "~/components/TextShadow";
import Typography from "~/components/Typography";

export const loader = () => {
  throw new Response(null, { status: 404, statusText: "Not Found" });
};

export default () => null;

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return error.status === 404 ? (
      <NotFound />
    ) : (
      <Box>
        <h1 className="text-primary-11">
          {error.status} {error.statusText}
        </h1>
      </Box>
    );
  } else if (error instanceof Error) {
    return (
      <Box>
        <h1 className="text-primary-11">Error</h1>
        <p>{error.message}</p>
      </Box>
    );
  } else {
    return (
      <Box>
        <h1 className="text-primary-11">Unknown Error</h1>
      </Box>
    );
  }
}

export function NotFound() {
  return (
    <Box>
      <h1 className="text-primary-11">404 Not Found</h1>
    </Box>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return (
    <Typography className="text-primary-12 mt-10">
      <TextShadow className="flex flex-col items-center">{children}</TextShadow>
    </Typography>
  );
}
