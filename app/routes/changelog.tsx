import Typography from "~/components/Typography";
import ChangelogDoc from "../../CHANGELOG.md";

export default function Changelog() {
  return (
    <Typography className="bg-primary-2/80 p-2">
      <ChangelogDoc />
    </Typography>
  );
}
