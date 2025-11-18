import { NextResponse } from "next/server";

// Define a richer set of data sources for more realistic mocks
const CUSTOMERS = [
  "TechHub Innovations", "Quantum Retail Solutions", "Alpha Gear Mart",
  "Zenith Electronics Co.", "Global Commerce Nexus", "Velocity Gadgets",
];

const PRODUCTS = [
  "Aura-X Noise Cancelling Headphones", "Cypher-7 Mechanical Keyboard",
  "Chrono-Watch Elite", "Nova-Pro Wireless Mouse", "Spectra 4K Monitor",
];

const STATUSES = ["paid", "pending", "failed", "refunded"];

// Utility to introduce a realistic delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  // Simulate network latency for realism (e.g., 200ms to 500ms)
  await sleep(Math.random() * 300 + 200);

  const numTransactions = 50; // Generate a larger number of transactions for realism
  const mockTransactions = Array.from({ length: numTransactions }).map((_, i) => {
    
    // Calculate a dynamic date, spreading transactions over the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    // Randomize data based on index/iterators
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    
    // Generate a unique ID and moderate transaction amount
    const id = `TXN-${10000 + i}`;
    const amount = Math.floor(Math.random() * 500000) + 10000; // ₦10,000 to ₦510,000

    return {
      id: id,
      date: date.toISOString(),
      amount: amount,
      customer: customer,
      product: product, // New field
      status: status,
      paymentMethod: ["Card", "Transfer", "Crypto"][Math.floor(Math.random() * 3)], // New field
    };
  });

  // For a transactions page, you might also want pagination metadata
  return NextResponse.json({
      transactions: mockTransactions,
      metadata: {
          totalCount: numTransactions,
          currentPage: 1,
          pageSize: 50,
      }
  });
}