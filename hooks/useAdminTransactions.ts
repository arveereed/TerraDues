import { getTransactions } from "@/services/transactionService";
import { TransactionType } from "@/types";
import { useCallback, useState } from "react";

export const useAdminTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      if (data) {
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions: ", error);
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchTransactions();
    } catch (error) {
      console.error("Error loading data: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions]);

  return { loadData, transactions, isLoading };
};
