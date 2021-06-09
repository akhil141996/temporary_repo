export const setPromise = function(value) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      var returnBooleanValue = value;
      returnBooleanValue ? resolve(returnBooleanValue) : reject(Error);
    }, 1000);
  });
};

export const str2bool = function(value) {
  if (value && typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return value;
};

export const getTransactionRef = () => {
  return sessionStorage.getItem('transactionRef');
};

export const getTrackingNumber = () => {
  return sessionStorage.getItem('trackingNumber');
};

export const setSessionStorage = (transactionRef, trackingNumber) => {
  sessionStorage.setItem('transactionRef', transactionRef);
  sessionStorage.setItem('trackingNumber', trackingNumber);
};

export const clearSessionStorage = () => {
  sessionStorage.removeItem('transactionRef');
  sessionStorage.removeItem('trackingNumber');
};

export const phoneNoFormat = value => {
  if (value) {
    let output = '';
    value.replace(/^\D*(\d{0,3})\D*(\d{0,3})\D*(\d{0,4})/, function(
      match,
      g1,
      g2,
      g3
    ) {
      if (g1.length) {
        output = output + '(' + g1;
        if (g1.length === 3) {
          output += ')';
          if (g2.length) {
            output += g2;
            if (g2.length === 3) {
              output += '-';
              if (g3.length) {
                output += g3;
              } else if (output.charAt(output.length - 1) === '-') {
                output = output.substring(0, output.length - 1);
              }
            }
          } else if (output.charAt(output.length - 1) === ')') {
            output = output.substring(0, output.length - 1);
          }
        }
      }
    });
    return output;
  }
  return null;
};

export const capitalize = str => {
  return str.replace(/(?:^|\s)\S/g, function(a) {
    return a.toUpperCase();
  });
};
