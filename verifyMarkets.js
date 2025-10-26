import fetch from "node-fetch";

const stations = ["London", "NYC"];

async function fetchMarket(station) {
  const query = `
  {
    markets(first: 10, query: "highest temperature in ${station}") {
      edges {
        node {
          slug
          question
          outcomes {
            name
            price
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch("https://api.polymarket.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await res.json();

    if (!data.data || !data.data.markets.edges.length) {
      console.log(`❌ No market found for ${station} today.`);
      return;
    }

    const market = data.data.markets.edges[0].node;
    console.log(`\n✅ Market found for ${station}:`);
    console.log("Slug:", market.slug);
    console.log("Question:", market.question);
    console.log("Outcomes:");
    market.outcomes.forEach(o => {
      const cents = (o.price).toFixed(2);
      const percent = (o.price * 100).toFixed(0) + "%";
      console.log(`  ${o.name} • ${percent} (${cents}¢)`);
    });
  } catch (err) {
    console.error(`Error fetching ${station} market:`, err);
  }
}

(async () => {
  for (const station of stations) {
    await fetchMarket(station);
  }
})();
