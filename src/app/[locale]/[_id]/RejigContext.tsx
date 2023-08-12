import { ReactNode, createContext, useState } from "react";

export const initialState = {
  partitionCount: 3,
  setPartitionCount: (count: number) => {},
};
export const RejigContext = createContext(initialState);

export function RejigContextProvider({ children }: { children: ReactNode }) {
  const [partitionCount, setPartitionCount] = useState(
    initialState.partitionCount,
  );
  const rejigContext = { partitionCount, setPartitionCount };
  return (
    <RejigContext.Provider value={rejigContext}>
      {children}
    </RejigContext.Provider>
  );
}
