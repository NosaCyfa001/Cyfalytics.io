import { salesByRegion } from "@/app/data/mockData";

export function RegionalSalesTable() {
  return (
    <table className="min-w-full text-sm border-t border-gray-200 dark:border-gray-700 text-center">
      <thead>
        <tr className="text-center text-gray-600 dark:text-gray-400">
          <th className="py-2">Region</th>
          <th className="py-2">Revenue</th>
          <th className="py-2">Orders</th>
        </tr>
      </thead>
      <tbody>
        {salesByRegion.map((item) => (
          <tr
            key={item.region}
            className="border-t border-gray-100 dark:border-gray-800"
          >
            <td className="py-2">{item.region}</td>
            <td className="py-2">₦{item.revenue.toLocaleString()}</td>
            <td className="py-2">{item.orders}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
