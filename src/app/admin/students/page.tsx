"use client";

import { StudentsTable } from "@/components/admin/students-table";

/** All students across every cohort — filter by status or search by
 * name/code/phone. Row click opens the student detail. */
export default function StudentsPage() {
  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <StudentsTable />
    </div>
  );
}
