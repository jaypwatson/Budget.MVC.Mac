using System;
using System.Transactions;

namespace Budget.Mvc.Mac.Models.ViewModels
{
    public class BudgetViewModel
    {
        public List<Transaction> Transactions { get; set; }
    }

}    