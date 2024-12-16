import { Input } from "./ui/input";

type LeaderboardFiltersProps = {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  uploaderFilter: string;
  setUploaderFilter: (value: string) => void;
};

export const LeaderboardFilters = ({
  nameFilter,
  setNameFilter,
  uploaderFilter,
  setUploaderFilter,
}: LeaderboardFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label htmlFor="nameFilter" className="text-sm text-muted-foreground block mb-2">
          Filter by Name
        </label>
        <Input
          id="nameFilter"
          placeholder="Filter by file name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div>
        <label htmlFor="uploaderFilter" className="text-sm text-muted-foreground block mb-2">
          Filter by Uploader
        </label>
        <Input
          id="uploaderFilter"
          placeholder="Filter by uploader..."
          value={uploaderFilter}
          onChange={(e) => setUploaderFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
    </div>
  );
};