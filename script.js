

let url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

async function fetchData() {
  try {
    let response = await fetch(url);
    let data = await response.json();
    
    // Sort the data by market_cap in descending order initially
    data.sort((a, b) => b.market_cap - a.market_cap);
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error in fetchData:', error);
    throw error;
  }
}

function insertData(data) {
  let container = document.querySelector("#container");
  let table = document.createElement("table");
  table.innerHTML = `
    ${data.map(coin => `
      <tr>
        <td><img class="name"src="${coin.image}" alt="${coin.name}" width="20">${coin.name}</td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>$${coin.current_price}</td>
        <td>$${coin.total_volume}</td>
        <td style="color: ${coin.price_change_percentage_24h>= 0 ? 'green' : 'red'};">${Math.floor(coin.price_change_percentage_24h)}%</td>
        <td>Mkt Cap: $${coin.market_cap}</td>
      </tr>
    `).join('')}
  `;
  container.innerHTML = '';
  container.appendChild(table);
}

async function searchItem() {
  try {
    let searchInput = document.querySelector("#searchInput").value.toLowerCase();
    let data = await fetchData();
    let filteredData = data.filter(coin => coin.name.toLowerCase().includes(searchInput) || coin.symbol.toLowerCase().includes(searchInput));
    insertData(filteredData);
  } catch (error) {
    console.error('Error in searchItem:', error);
  }
}

async function sort(key) {
  try {
    let data = await fetchData();
    
    // Sort the data based on the specified key
    if (key === 'percentage') {data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    } else if (key === 'market_cap') {
      data.sort((a, b) => b.market_cap - a.market_cap);
    }

    insertData(data);
  } catch (error) {
    console.error('Error in sort:', error);
  }
}

// Initial fetch and display
fetchData().then(data => insertData(data));
