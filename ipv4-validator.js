// Walidator IPv4
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

/**
 * Sprawdza, czy podany string to poprawny adres IPv4.
 * @param {string} ip
 * @returns {boolean}
 */
function isValidIPv4(ip) {
  return typeof ip === 'string' && IPV4_REGEX.test(ip);
}

module.exports = { isValidIPv4, IPV4_REGEX };

// Jeśli skrypt uruchomiony bezpośrednio, wykonaj szybkie testy
if (require.main === module) {
  const examples = [
    '0.0.0.0',
    '192.168.1.1',
    '255.255.255.255',
    '256.0.0.1',
    '192.168.1',
    '01.02.03.04',
    '192.168.001.001',
    '127.0.0.1'
  ];

  console.log('IPv4 regex:', IPV4_REGEX);
  examples.forEach(ip => {
    console.log(ip, '->', isValidIPv4(ip));
  });
}
