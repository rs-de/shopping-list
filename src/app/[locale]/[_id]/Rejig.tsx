import Typography from "@/components/Typography";
import { ChangeEventHandler, ComponentProps, useContext, useRef } from "react";
import { RejigContext } from "./RejigContext";

export default function Rejig() {
  const { partitionCount, setPartitionCount } = useContext(RejigContext);
  const handlePartitionCountChange: ChangeEventHandler<HTMLSelectElement> = (
    event,
  ) => {
    setPartitionCount(Number(event.target.value));
  };
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Typography className="flex flex-col items-center gap-4">
      <input
        form="article-selection"
        type="hidden"
        name="partitionNumber"
        value={0}
        ref={ref}
      />
      <input
        form="article-selection"
        type="hidden"
        name="partitionCount"
        value={partitionCount}
      />
      <PartitionCountSelect
        partitionCount={partitionCount}
        onChange={handlePartitionCountChange}
      />
      {new Array(partitionCount).fill(0).map((_, i) => {
        return (
          <button
            className="w-20 h-10 bg-primary-3 border-2 border-primary-7 rounded-lg "
            type="submit"
            form="article-selection"
            onClick={() => {
              ref.current!.value = String(i + 1);
            }}
            key={i}
          />
        );
      })}
    </Typography>
  );
}

function PartitionCountSelect({
  partitionCount,
  onChange,
}: {
  partitionCount: number;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}) {
  //odd numbers are nice, because they have a middle one
  return (
    <select
      defaultValue={partitionCount}
      onChange={onChange}
      className="bg-primary-2 text-primary-12"
      form="selected-from"
    >
      <option value="3">3</option>
      <option value="5">5</option>
      <option value="7">7</option>
    </select>
  );
}
