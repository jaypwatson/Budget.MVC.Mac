using System;
using System.Data;
using Budget.Mvc.Mac.Models;
using Microsoft.Data.Sqlite;
using Dapper;

namespace Budget.Mvc.Mac.Repositories
{
    public interface IBudgetRepository
    {
        List<Transaction> GetTransactions();
    }

    public class BudgetRepository: IBudgetRepository
    {
        private readonly IConfiguration _configuration;

        public BudgetRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Retrieves a list of transactions from the database.
        /// </summary>
        /// <returns>A list of <see cref="Transaction"/> objects representing all transactions.</returns>
        /// <remarks>
        /// This method establishes a connection to the database using a connection string defined in the configuration.
        /// It executes a SQL query that selects various fields from the Transactions table, including the amount, category ID, date, ID, transaction type, name, and the corresponding category name from the Category table.
        /// The results are then mapped to a list of <see cref="Transaction"/> objects and returned.
        /// The method uses Dapper for executing the query and mapping the results.
        /// </remarks>
        public List<Transaction> GetTransactions()
        {
            using (IDbConnection connection = new SqliteConnection(_configuration.GetConnectionString("ConnectionString")))
            {
                var query =
                    @"SELECT t.Amount, t.CategoryId, t.[Date], t.Id, t.TransactionType, t.Name, c.Name AS Category
                      FROM Transactions AS t
                      LEFT JOIN Category AS c
                      ON t.CategoryId = c.Id;";

                var allTransactions = connection.Query<Transaction>(query);

                return allTransactions.ToList();
            }
        }
    }
}