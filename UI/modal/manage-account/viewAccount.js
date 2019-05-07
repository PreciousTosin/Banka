function viewBankAccount(data) {
  return `<ul class="account--details">
      <li>
        <div class="highlight title">Id</div>
        <div>${data.id}</div>
      </li>
      <li>
        <div class="highlight title">Date Created</div>
        <div>${data.createdon}</div>
      </li>
      <li>
        <div class="highlight title">Account Number</div>
        <div>${data.accountnumber}</div>
      </li>
      <li>
        <div class="highlight title">Owner</div>
        <div>${data.owner}</div>
      </li>
      <li>
        <div class="highlight title">Type</div>
        <div>${data.type}</div>
      </li>
      <li>
        <div class="highlight title">Status</div>
        <div>${data.status}</div>
      </li>
      <li>
        <div class="highlight title">Balance</div>
        <div>${data.balance}</div>
      </li>
    </ul>`;
}