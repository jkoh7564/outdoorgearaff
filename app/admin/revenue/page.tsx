import { AdminNav } from "@/app/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";
import { ImportConversions } from "./ImportConversions";

export const dynamic = "force-dynamic";

type Conversion = {
  id: string;
  network: string;
  order_id: string | null;
  sale_amount: number;
  commission_amount: number;
  currency: string;
  occurred_at: string;
};

export default async function RevenuePage() {
  const supabase = await createClient();
  const { data: conversions, error } = await supabase
    .from("affiliate_conversions")
    .select("*")
    .order("occurred_at", { ascending: false })
    .returns<Conversion[]>();

  const rows = conversions ?? [];
  const revenue = rows.reduce((sum, row) => sum + Number(row.sale_amount), 0);
  const commission = rows.reduce((sum, row) => sum + Number(row.commission_amount), 0);

  return (
    <AdminNav>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Revenue</h1>
          <p className="mt-1 text-[#66736a]">Import affiliate network reports and track sales plus commissions.</p>
        </div>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="border border-[#d9d4c7] bg-white p-5">
            <p className="text-sm font-bold text-[#66736a]">Conversions</p>
            <p className="mt-2 text-3xl font-bold">{rows.length}</p>
          </div>
          <div className="border border-[#d9d4c7] bg-white p-5">
            <p className="text-sm font-bold text-[#66736a]">Sales</p>
            <p className="mt-2 text-3xl font-bold">${revenue.toFixed(2)}</p>
          </div>
          <div className="border border-[#d9d4c7] bg-white p-5">
            <p className="text-sm font-bold text-[#66736a]">Commission</p>
            <p className="mt-2 text-3xl font-bold">${commission.toFixed(2)}</p>
          </div>
        </div>
        <div className="mb-6">
          <ImportConversions />
        </div>
        {error ? (
          <div className="border border-red-200 bg-red-50 p-4 text-red-700">{error.message}</div>
        ) : rows.length > 0 ? (
          <div className="overflow-x-auto border border-[#d9d4c7] bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[#f0ece2]">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Network</th>
                  <th className="p-4">Order</th>
                  <th className="p-4 text-right">Sale</th>
                  <th className="p-4 text-right">Commission</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[#e5dfd2]">
                    <td className="p-4">{new Date(row.occurred_at).toLocaleDateString()}</td>
                    <td className="p-4 font-bold">{row.network}</td>
                    <td className="p-4">{row.order_id ?? "-"}</td>
                    <td className="p-4 text-right">{row.currency} {Number(row.sale_amount).toFixed(2)}</td>
                    <td className="p-4 text-right">{row.currency} {Number(row.commission_amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-[#d9d4c7] bg-white p-6">No conversion reports imported yet.</div>
        )}
      </section>
    </AdminNav>
  );
}
