"use client";

import { useRouter } from "next/navigation";
import { Card, Pager } from "@/components/admin/ui";
import { FilterBar } from "@/components/admin/filter-bar";
import { TableSkeletonRows } from "@/components/admin/table-bits";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/format-money";
import { formatDate } from "@/lib/format-date";
import { useTableQuery } from "@/hooks/use-table-query";
import { useGetCustomersQuery } from "@/redux/customers/customers-api";

const DEFAULTS = {};
const PAGE_SIZE = 12;

export default function CustomersPage() {
  const router = useRouter();
  const { page, search, setSearch, setPage, queryParams } = useTableQuery({
    defaults: DEFAULTS,
    pageSize: PAGE_SIZE,
  });

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetCustomersQuery({
      page,
      limit: PAGE_SIZE,
      search: (queryParams.search as string | undefined) ?? undefined,
    });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search name, phone, email…"
        resultLabel={meta ? `${String(meta.total)} total` : undefined}
      />

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading ? (
        <TableSkeletonRows />
      ) : rows.length === 0 ? (
        <EmptyState
          title={search.trim() ? "No matching customers" : "No customers yet"}
          description={
            search.trim()
              ? "Nothing matches your search — try clearing it."
              : "Customers appear automatically the first time they order."
          }
        />
      ) : (
        <>
          <Card
            className={cn(
              "overflow-hidden transition-opacity",
              isFetching && "opacity-60",
            )}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink/10 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink/50">
                    <th className="px-6 py-3.5 font-semibold">Customer</th>
                    <th className="px-4 py-3.5 font-semibold">Phone</th>
                    <th className="px-4 py-3.5 font-semibold">Orders</th>
                    <th className="px-4 py-3.5 font-semibold">Total spent</th>
                    <th className="px-4 py-3.5 font-semibold">Last order</th>
                    <th className="px-6 py-3.5" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/admin/customers/${c.id}`)}
                      className="cursor-pointer border-b border-ink/[0.08] transition-colors last:border-0 hover:bg-accent/[0.05]"
                    >
                      <td className="px-6 py-4">
                        <div className="text-[15px] font-semibold text-ink">
                          {c.fullName}
                        </div>
                        <div className="mt-0.5 text-[12.5px] text-ink/55">
                          {c.email ?? "No email"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[14px] text-ink/70">
                        {c.phone}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[14px] text-ink/70">
                        {c.orderCount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[14px] font-medium">
                        {formatMoney(c.totalSpent)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[13.5px] text-ink/70">
                        {formatDate(c.lastOrderAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-ink/40">→</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {meta ? (
            <Pager page={page} pageCount={meta.totalPages} onPage={setPage} />
          ) : null}
        </>
      )}
    </div>
  );
}
