import { PageLayout } from '../components';
import { DataGrid } from '../ui';

const columns = [
  { title: 'Description', field: 'description' },
  { title: 'Category', field: 'Category' },
  { title: "Amount", field: "amount" }
  // ...
];

const data = [
  {
    description: "hello"
  }
]
export default function Transactions() {
  return (
    <PageLayout title="Transactions">
      <DataGrid columns={columns} data={data} />
    </PageLayout>
  );
}
