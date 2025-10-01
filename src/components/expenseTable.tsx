"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { NotionItem } from "@/types/notion";

export function ExpenseTable() {
  const [expenseData, setExpenseData] = useState<NotionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching expenses...");

    axios
      .get<NotionItem[]>("/api/expense")
      .then((r) => {
        console.log("Raw Axios response:", r);
        console.log("Data from API:", r.data);

        setExpenseData(r.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading === true) {
    return <div>Loading...</div>;
  }

  if (!expenseData || expenseData.length === 0) {
    return <div>No expenses found.</div>;
  }

  // ✅ Calculate total sum
  const totalAmount = expenseData.reduce((sum, item) => {
    const amount = item.properties.Amount?.number ?? 0;
    return sum + amount;
  }, 0);

  const formattedTotal = new Intl.NumberFormat("id-ID").format(totalAmount);
  const formattedTotalIfPaid = new Intl.NumberFormat("id-ID").format(
    expenseData
      .filter((item) => item.properties["Paid?"]?.select?.name === "Paid")
      .reduce((sum, item) => {
        const amount = item.properties.Amount?.number ?? 0;
        return sum + amount;
      }, 0)
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Paid?</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Month</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {expenseData.map((item) => {
          const props = item.properties;
          const source = props.Source?.title?.[0]?.plain_text ?? "Untitled";
          const amount = props.Amount?.number ?? 0;
          const formattedAmount = new Intl.NumberFormat("id-ID").format(amount);
          const paid = props["Paid?"]?.select?.name ?? "Unpaid";
          const tag = props.Tags?.select?.name ?? "-";
          const date = props.Date?.date?.start ?? "-";
          const month = props.MonthName ?? "";

          return (
            <TableRow key={item.id}>
              <TableCell>{source}</TableCell>
              <TableCell>Rp. {formattedAmount}</TableCell>
              <TableCell>{paid}</TableCell>
              <TableCell>{tag}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>{month}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={1}>
            <strong>Total</strong>
          </TableCell>
          <TableCell>
            <strong>Rp. {formattedTotal}</strong>
          </TableCell>
          <TableCell colSpan={3}></TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={1}>
            <strong>Total Paid</strong>
          </TableCell>
          <TableCell>
            <strong>Rp. {formattedTotalIfPaid}</strong>
          </TableCell>
          <TableCell colSpan={3}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
