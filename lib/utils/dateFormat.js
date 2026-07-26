import { formatInTimeZone } from "date-fns-tz";

// Frontmatter dates are bare calendar dates (YYYY-MM-DD), which YAML and the
// JSON round-trip in getSinglePage turn into midnight-UTC instants. Format in
// UTC so the rendered day always matches the frontmatter, whatever timezone
// the build or the reader is in.
const dateFormat = (date) => {
  return formatInTimeZone(date, "UTC", "dd MMM yyyy");
};

export default dateFormat;
