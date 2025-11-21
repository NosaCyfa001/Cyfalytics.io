/*export async function GET() {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      start(controller) {
        function send(data: any) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        }

        // Send first update immediately
        send({ type: "ready" });

        // Push updates every 2 seconds (mock logic)
        const interval = setInterval(() => {
          const now = new Date();
          const months = [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
          ];

          const currentMonths = months.slice(0, now.getMonth() + 1);

          // Monthly revenue
          const monthlyRevenue = currentMonths.map((m) => ({
            month: m,
            revenue: 100_000_000 + Math.floor(Math.random() * 100_000_000)
          }));

          // Category revenue
          const categories = ["Food", "Drinks", "Electronics", "Fashion"];
          const categoryRevenue = categories.map((c) => ({
            category: c,
            amount: 10_000_000 + Math.floor(Math.random() * 80_000_000)
          }));

          // Stats
          const stats = {
            orders: 1000 + Math.floor(Math.random() * 500),
            customers: 200 + Math.floor(Math.random() * 100),
            refunds: Math.floor(Math.random() * 20),
            revenueToday: 5_000_000 + Math.floor(Math.random() * 5_000_000)
          };

          send({
            type: "update",
            monthlyRevenue,
            categoryRevenue,
            stats
          });
        }, 2000);

        return () => clearInterval(interval);
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
      },
    }
  );
}*/