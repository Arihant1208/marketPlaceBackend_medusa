import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import {
  Badge,
  Button,
  createDataTableColumnHelper,
  createDataTableFilterHelper,
  DataTable,
  DataTableFilteringState,
  DataTablePaginationState,
  DataTableSortingState,
  FocusModal,
  Heading,
  Input,
  toast,
  useDataTable,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";

import { useMemo, useState } from "react";
import { HttpTypes, ProductStatus } from "@medusajs/framework/types";

const columnHelper = createDataTableColumnHelper<any>();

const columns = [
  columnHelper.accessor("vendor_email", {
    header: "Vendor Email",
    enableSorting: true,
    sortLabel: "email",
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
  }),
  columnHelper.accessor("created_at", {
    header: "Date",
    enableSorting: true,
    sortLabel: "Date",
    cell: ({ getValue }) => getValue().toString().split("T")[0],
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <Badge color={status === "accepted" ? "green" : "orange"} size="xsmall">
          {status === "accepted" ? "Published" : "Pending"}
        </Badge>
      );
    },
  }),
];
const filterHelper = createDataTableFilterHelper<HttpTypes.AdminProduct>();

const filters = [
  filterHelper.accessor("status", {
    type: "select",
    label: "Status",
    options: [
      {
        label: "Open",
        value: "open",
      },
      {
        label: "Completed",
        value: "completed",
      },
      {
        label: "Canceled",
        value: "canceled",
      },
      {
        label: "Draft",
        value: "draft",
      },
    ],
  }),
];

const limit = 15;

const CustomPage = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const [search, setSearch] = useState<string>("");
  const [filtering, setFiltering] = useState<DataTableFilteringState>({});
  const [sorting, setSorting] = useState<DataTableSortingState | null>(null);

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);
  const statusFilters = useMemo(() => {
    return (filtering.status || []) as ProductStatus;
  }, [filtering]);

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        q: search || "",
        ...(sorting
          ? { order: `${sorting.desc ? "-" : ""}${sorting.id}` }
          : {}),
      });

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/get-all-invited-list-vendors?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch invite of vendors");
      }

      return response.json();
    },
    queryKey: [
      "products",
      limit,
      offset,
      search,
      statusFilters,
      sorting?.id,
      sorting?.desc,
    ],
  });

  const table = useDataTable({
    columns,
    data: data?.result?.data?.data || [],
    getRowId: (row) => row.id,
    rowCount: data?.result?.data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    filtering: {
      state: filtering,
      onFilteringChange: setFiltering,
    },
    filters,
    sorting: {
      state: sorting,
      onSortingChange: setSorting,
    },
  });

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      alert("Email is required");
      return;
    }
    setLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_API_URL}/invite-vendor`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendor_email: email,
      }),
    }).then(() => {
      toast.success("Email sent successfully");
      setLoading(false);
      setIsModalOpen(false);
    });
  };

  return (
    <>
      <DataTable className="border" instance={table}>
        <DataTable.Toolbar className=" flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Invite Vendor</Heading>
          <div className="flex gap-2">
            <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
              <FocusModal.Trigger asChild>
                <Button>Send Invite</Button>
              </FocusModal.Trigger>

              <FocusModal.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[450px] max-h-[500px] flex justify-center items-center bg-white shadow-lg rounded-lg p-6">
                <FocusModal.Header className="w-full absolute top-0"></FocusModal.Header>
                <div className="w-full flex flex-col items-center">
                  <h1 className="text-large-semi mb-6 text-3xl">
                    Invite Vendors
                  </h1>
                  <p className="text-center text-base-regular text-ui-fg-base mb-8">
                    Here you can invite vendors by sending invites through
                    emails.
                  </p>
                  <form className="w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col  gap-y-2">
                      <Input
                        name="email"
                        type="email"
                        title="Enter a valid email address."
                        autoComplete="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        data-testid="email-input"
                      />
                    </div>
                    <Button className="w-full mt-6" isLoading={loading}>
                      Send Invite
                    </Button>
                  </form>
                </div>
              </FocusModal.Content>
            </FocusModal>

            <DataTable.FilterMenu tooltip="Filter" />
            <DataTable.SortingMenu tooltip="Sort" />
            <DataTable.Search placeholder="Search..." />
          </div>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </>
  );
};
export const config = defineRouteConfig({
  label: "Invite Vendors ",
  icon: ChatBubbleLeftRight,
});

export default CustomPage;
