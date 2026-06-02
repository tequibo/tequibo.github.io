export async function fetchObjktHoldersFromTzkt(contract, tokenId) {
  const url = `https://api.tzkt.io/v1/tokens/balances?token.contract=${contract}&token.tokenId=${tokenId}&balance.gt=0`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Transform the data to match the structure of your previous function if needed
    const holders = data.map(entry => ({
      holder_id: entry.account.address,
      quantity: entry.balance,
      holder: {
        name: entry.account.alias || entry.account.address,
      },
    }));

    return holders;
  } catch (error) {
    console.error("Failed to fetch token holders:", error);
    return null;
  }
}