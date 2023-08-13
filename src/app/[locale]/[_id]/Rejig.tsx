import Typography from "@/components/Typography";
import { ChangeEventHandler, useContext, useRef } from "react";
import { RejigContext } from "./RejigContext";
import { useTranslations } from "next-intl";
import Badge from "@/components/Badge";
import { QuestionMarkCircleOutline } from "heroicons-react";
import { Popover, Transition } from "@headlessui/react";

export default function Rejig() {
  const { partitionCount, setPartitionCount } = useContext(RejigContext);
  const handlePartitionCountChange: ChangeEventHandler<HTMLSelectElement> = (
    event,
  ) => {
    setPartitionCount(Number(event.target.value));
  };
  const ref = useRef<HTMLInputElement>(null);
  const t = useTranslations();
  return (
    <Badge
      icon={
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button>
                <QuestionMarkCircleOutline className="w-7 h-7 text-primary-9 hover:text-primary-10 fill-primary-3 hover:fill-primary-4" />
              </Popover.Button>
              <Popover.Overlay className="" />
              <Transition
                show={open}
                enter="transition duration-150 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-100 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Popover.Panel className="absolute left-[-65vw] sm:left-[-40vw] md:left-[-400px] w-[85vw] max-w-xs bg-primary-3 p-4 rounded-lg drop-shadow-xl text-primary-12">
                  <Typography className="">
                    <p>{t("rejig_description")}</p>
                  </Typography>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      }
    >
      <Typography className="flex flex-col items-center gap-4">
        <PartitionCountSelect
          partitionCount={partitionCount}
          onChange={handlePartitionCountChange}
        />
        {new Array(partitionCount).fill(0).map((_, i) => {
          return (
            <button
              className="w-20 h-10 bg-primary-3 border-2 border-primary-7 rounded-lg text-primary-11"
              type="submit"
              form="article-selection"
              onClick={() => {
                ref.current!.value = String(i + 1);
              }}
              key={i}
            >
              {t(
                i === 0
                  ? "pickupTime_early"
                  : i == Math.floor(partitionCount / 2)
                  ? "pickupTime_medium"
                  : i == partitionCount - 1
                  ? "pickupTime_late"
                  : "",
              )}
            </button>
          );
        })}
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
      </Typography>
    </Badge>
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
      className="bg-primary-2 text-primary-11 rounded-lg border-2 border-primary-6 hover:border-primary-7"
      form="selected-from"
    >
      <option value="3">3</option>
      <option value="5">5</option>
      <option value="7">7</option>
    </select>
  );
}
