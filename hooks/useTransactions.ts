import { getTransactionsByUserId } from "@/services/transactionService";
import { TransactionsWithSummaryType } from "@/types";
import { useCallback, useState } from "react";

export const useTransactions = (userId: string | undefined) => {
  const [transactions, setTransactions] =
    useState<TransactionsWithSummaryType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTransactionsByUserId = useCallback(async () => {
    try {
      const data = await getTransactionsByUserId(userId);
      if (data) {
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions: ", error);
    }
  }, [userId]); // recreate the function when userId changes

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      await fetchTransactionsByUserId();
    } catch (error) {
      console.error("Error loading data: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchTransactionsByUserId]);

  return { loadData, transactions, isLoading };
};
