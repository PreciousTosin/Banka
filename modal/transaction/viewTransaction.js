function viewTransaction(data) {
  return `<ul class="transaction--details">
      <li>
        <div class="highlight title">Id</div>
        <div>${data.id}</div>
      </li>
      <li>
        <div class="highlight title">Transaction Date</div>
        <div>${data.createdon}</div>
      </li>
      <li>
        <div class="highlight title">Transaction Type</div>
        <div>${data.type}</div>
      </li>
      <li>
        <div class="highlight title">Account</div>
        <div>${data.accountnumber}</div>
      </li>
      <li>
        <div class="highlight title">Cashier</div>
        <div>${data.cashier}</div>
      </li>
      <li>
        <div class="highlight title">Amount</div>
        <div>${data.amount}</div>
      </li>
      <li>
        <div class="highlight title">Old Balance</div>
        <div>${data.oldbalance}</div>
      </li>
      <li>
        <div class="highlight title">New Balance</div>
        <div>${data.newbalance}</div>
      </li>
    </ul>`;
}