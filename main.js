$(function() {

  var withdrawalURL = new Firebase('https://bank-ledger.firebaseio.com/withdrawals');
  var depositURL = new Firebase('https://bank-ledger.firebaseio.com/deposits');
  var feeURL = new Firebase('https://bank-ledger.firebaseio.com/fees');
  var balanceURL = new Firebase('https://bank-ledger.firebaseio.com/balance');

  var amount = date = balance = '';

  balanceURL.on('value', function(fbObj) {
    var data = fbObj.val();
    balance = data.amount;
    if (balance < 0) {
      $('#balance').css('color', 'red');
      $('#withdrawal').attr('disabled', true);
    } else {
      $('#balance').css('color', 'black');
      $('#withdrawal').attr('disabled', false);
    }
    $('#balance').text('$' + Math.abs(balance));
  });

  withdrawalURL.on('child_added', function(fbObj) {
    var data = fbObj.val();
    console.log(data);
    $('#withdrawalList').append('<li>$' + data.amount + ' - ' + data.date + '</li>');
  });

  depositURL.on('child_added', function(fbObj) {
    var data = fbObj.val();
    console.log(data);
    $('#depositList').append('<li>$' + data.amount + ' - ' + data.date + '</li>');
  });

  feeURL.on('child_added', function(fbObj) {
    var data = fbObj.val();
    console.log(data);
    $('#feeList').append('<li>$' + data.amount + ' - ' + data.date + '</li>');
  });

  $('#input').keyup(function() {
    this.value = this.value.replace(/[^0-9\.]/, '');
    // this.value = this.value.replace(/\.[^0-9]{1,2}$/, '');
  });

  $('#deposit').on('click', function() {
    amount = $('#input').val();
    if (amount === '' || parseInt(amount) === 0) {
      $('#input').val('');
      $('#input').focus();
      return;
    }
    date = new Date().toDateString();
    var newB = parseInt(balance) + parseInt(amount);
    depositURL.push({amount: amount, date: date});
    balanceURL.update({
      amount: newB
    });
    $('#input').val('');
    $('#input').focus();
  });

  $('#withdrawal').on('click', function() {
    amount = $('#input').val();
    if (amount === '' || parseInt(amount) === 0) {
      $('#input').val('');
      $('#input').focus();
      return;
    }
    date = new Date().toDateString();
    var newB = parseInt(balance) - parseInt(amount);
    if (newB < 0) {
      newB -= 50;
      feeURL.push({amount: 50, date: date});
    }
    withdrawalURL.push({amount: amount, date: date});
    balanceURL.update({
      amount: newB
    });
    $('#input').val('');
    $('#input').focus();
  });

});
