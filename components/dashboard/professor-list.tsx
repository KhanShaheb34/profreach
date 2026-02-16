"use client";

import { useState, useMemo } from "react";
import { useStorage } from "@/hooks/use-storage";
import { useDebounce } from "@/hooks/use-debounce";
import { getProfessors } from "@/lib/storage";
import { FilterBar } from "./filter-bar";
import { ProfessorCard } from "./professor-card";
import type { Professor } from "@/lib/types";
import { GraduationCap } from "lucide-react";

export function ProfessorList() {
  const professors = useStorage(getProfessors);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updatedAt-desc");

  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    if (!professors) return [];

    let result = [...professors];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.university.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.researchAreas.some((a) => a.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.applicationStatus === statusFilter);
    }

    // Sort
    const [field, direction] = sortBy.split("-") as [keyof Professor, string];
    result.sort((a, b) => {
      const aVal = String(a[field] ?? "");
      const bVal = String(b[field] ?? "");
      const cmp = aVal.localeCompare(bVal);
      return direction === "desc" ? -cmp : cmp;
    });

    return result;
  }, [professors, debouncedSearch, statusFilter, sortBy]);

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No professors yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {professors?.length === 0
              ? "Add your first professor using the input above."
              : "No professors match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((professor) => (
            <ProfessorCard key={professor.id} professor={professor} />
          ))}
        </div>
      )}
    </div>
  );
}
