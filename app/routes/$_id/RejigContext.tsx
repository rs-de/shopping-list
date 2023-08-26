import type { ReactNode } from "react";
import React from "react";

export const initialState = {
  partitionCount: 3,
  setPartitionCount: (count: number) => {},
};
export const RejigContext = React.createContext(initialState);

export function RejigContextProvider({ children }: { children: ReactNode }) {
  const [partitionCount, setPartitionCount] = React.useState(
    initialState.partitionCount,
  );
  const rejigContext = { partitionCount, setPartitionCount };
  return (
    <RejigContext.Provider value={rejigContext}>
      {children}
    </RejigContext.Provider>
  );
}
