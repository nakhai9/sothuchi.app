"use client";
import { useGlobalStore } from "@/store/globalStore";

import { PageLayout } from "../components";
import { DataGrid } from "../ui";

const columns = [{ title: "Description", field: "description" as const }];

const data = [
  {
    description: "hello",
  },
];
export default function Transactions() {
  const userInfo = useGlobalStore((state) => state.userInfo);
  return (
    <PageLayout title="Transactions">
      {userInfo?.firstName}
      <DataGrid columns={columns} data={data} />
    </PageLayout>
  );
}
