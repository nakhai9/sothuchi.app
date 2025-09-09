import { PageLayout } from "../components";
import { DataGrid } from "../ui";

const columns = [{ title: "Description", field: "description" as const }];

const data = [
  {
    description: "hello",
  },
];
export default function Transactions() {
  return (
    <PageLayout title="Transactions">
      <DataGrid columns={columns} data={data} />
    </PageLayout>
  );
}
