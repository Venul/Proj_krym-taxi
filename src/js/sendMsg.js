$(".form-calculator").submit(function () {
  var phoneLn = $(this).find('input[type="tel"]').val().length;
  if ((phoneLn < 9) || (phoneLn > 12)) {
      alert('Номер телефона не полный, укажите правильный!');
  } else {
  var formElements = $(this).serializeArray();
  //Prepare message
  let msgFrom = formElements.find(x=>x.name === 'from').value;
  let msgTo = formElements.find(x=>x.name === 'to').value;
  let msgClass = formElements.find(x=>x.name === 'class').value;
  let msgFutureOrder = formElements.find(x=>x.name === 'radio_order').value;
  let msgFOdate = formElements.find(x=>x.name === 'input_date').value;
  let msgFOtime = formElements.find(x=>x.name === 'input_time').value;
  let msgBackOrder = formElements.find(x=>x.name === 'input_check') && 
  formElements.find(x=>x.name === 'input_check').value;
  let msgBOdate = formElements.find(x=>x.name === 'rev_date').value;
  let msgBOtime = formElements.find(x=>x.name === 'rev_time').value;
  let msgMessage = formElements.find(x=>x.name === 'message').value;
  let msgCost = formElements.find(x=>x.name === 'cost_transfer').value;
  let msgContact = formElements.find(x=>x.name === 'input_phone').value;
  
  let message = ['🚕 ##Новый заказ!## 🚕'];
  if(msgFrom) {
    message.push('Откуда: *' + $("#from option:selected").text() +'*');
  };
  if(msgTo) {
    message.push('Куда: *' + $("#to option:selected").text() +'*');
    message.push(' ');
  };             
  if(msgClass) {
    message.push('Класс машины: ' + $("#class option:selected").text());
  }; 
  if(msgFutureOrder == 2) {
    message.push('---------------');
    message.push('Предварительный заказ:');
    if(msgFOdate) {
      message.push('Дата: ' + msgFOdate);
    };
    if(msgFOtime) {
      message.push('Время: ' + msgFOtime);
    };
    message.push(' ');
  };
  if(msgBackOrder) {
    message.push('---------------');
    message.push('Обратный заказ:');
    if(msgBOdate) {
      message.push('Дата: ' + msgBOdate);
    };
    if(msgBOtime) {
      message.push('Время: ' + msgBOtime);
    };
    message.push(' ');
  }
  if(msgMessage) {
    message.push('Пожелания к заказу: ' + msgMessage);
  }            
  if(msgCost) {
    message.push('Стоимость заказа: *' + msgCost + '₽*');
  } else {
    message.push('Стоимость заказа не известна');
  }            
  if(msgContact) {
    message.push('Контактный телефон: `' + msgContact + '`');
  }
  $.ajax({
      type: 'POST',
      url: "https://taxi-krim.herokuapp.com/notify",
      data: { message: message.join('\n') },
      success: function (msg) {
          if(msg && msg.description){
              $('.rez_calc').html('Что-то пошло не так.<br>' + msg.description);
              $('.rez_calc').addClass('min').slideDown('slow');
          } else {
              $(".form-calculator").slideUp('slow');
              $('.rez_calc').html('Мы приняли ваш заказ, ожидайте звонка!');
              $('.rez_calc').removeClass('min').slideDown('slow');
          }
      },
      failure: function(errMsg){
          $('.rez_calc').html('Что-то пошло не так.<br>' + errMsg);
          $('.rez_calc').addClass('min').slideDown('slow');
      }
  });
}
return false;
});

$(".modal form").submit(function () {
  var phoneLn = $(this).find('input[type="tel"]').val().length;
  var yad = $(this).attr('data-yad');
  if ((phoneLn < 9) || (phoneLn > 12)) {
    alert('Номер телефона не полный, укажите правильный!');
  } else {
    let message = ['🚕 *Заявка от клиента:* 🚕'];
    let formElem = $(this) && $(this)[0] && $(this)[0][0] && $(this)[0][0].form && $(this)[0][0].form.elements;
    let txtName = formElem && formElem.txtname && formElem.txtname.value;
    let txtPhone = formElem && formElem.phone && formElem.phone.value;

    if (txtName) message.push(`Имя: ${txtName}`);
    if (txtPhone) message.push(`Телефон: ${txtPhone}`);
    
    $.ajax({
      type: "POST",
      url: "https://taxi-krim.herokuapp.com/notify",
      data: { message: message.join('\n') },
      success: function (msg) {
        if (msg) {
          $(".modal form input").not(':button, :submit, :reset, :hidden').val('');
          $('.modal__close').click();
          $('.modal3').addClass('show');
          setTimeout(function () {
            $('.modal__close').click();
          }, 3000);
        } else {
          alert('возможно вы не указали телефон, проверьте правильность заполненных полей');
        }
      }
    });
  }
  return false;
});