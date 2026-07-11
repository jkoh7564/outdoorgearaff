import { AdminNav } from "@/app/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  status: string;
  created_at: string;
};

export default async function SubscribersPage() {
  const supabase = await createClient();
  const { data: subscribers, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Subscriber[]>();

  return (
    <AdminNav>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Newsletter</h1>
          <p className="mt-1 text-[#66736a]">Email captures from returning visitors and public signup forms.</p>
        </div>
        {error ? (
          <div className="border border-red-200 bg-red-50 p-4 text-red-700">{error.message}</div>
        ) : subscribers && subscribers.length > 0 ? (
          <div className="overflow-x-auto border border-[#d9d4c7] bg-white">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead className="bg-[#f0ece2]">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-t border-[#e5dfd2]">
                    <td className="p-4 font-bold">{subscriber.email}</td>
                    <td className="p-4">{subscriber.source ?? "-"}</td>
                    <td className="p-4">{subscriber.status}</td>
                    <td className="p-4">{new Date(subscriber.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-[#d9d4c7] bg-white p-6">No subscribers yet.</div>
        )}
      </section>
    </AdminNav>
  );
}
