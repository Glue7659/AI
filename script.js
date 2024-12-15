// Bankaların vadesiz limitleri ve faiz oranları
let odeabankLimits = [
  { "min": 0, "max": 25000, "nonInterest": 7500 },
  { "min": 25001, "max": 50000, "nonInterest": 7500 },
  { "min": 50001, "max": 100000, "nonInterest": 10000 },
  { "min": 100001, "max": 250000, "nonInterest": 20000 },
  { "min": 250001, "max": 500000, "nonInterest": 40000 },
  { "min": 500001, "max": 750000, "nonInterest": 75000 },
  { "min": 750001, "max": 1000000, "nonInterest": 125000 },
  { "min": 1000001, "max": 2000000, "nonInterest": 200000 },
  { "min": 2000001, "max": 5000000, "nonInterest": 300000 },
  { "min": 5000001, "max": 10000000, "nonInterest": 500000 }
];
let tebLimits = [
  { "min": 0, "max": 5000, "nonInterest": 0 },
  { "min": 5001, "max": 9999, "nonInterest": 5000 },
  { "min": 10000, "max": 24999, "nonInterest": 5000 },
  { "min": 25000, "max": 49999, "nonInterest": 5000 },
  { "min": 50000, "max": 99999, "nonInterest": 7500 },
  { "min": 100000, "max": 249999, "nonInterest": 15000 },
  { "min": 250000, "max": 499999, "nonInterest": 30000 },
  { "min": 500000, "max": 749999, "nonInterest": 50000 },
  { "min": 750000, "max": 1000000, "nonInterest": 50000 },
  { "min": 1000001, "max": 1500000, "nonInterest": 125000 },
  { "min": 1500001, "max": 2000000, "nonInterest": 150000 },
  { "min": 2000001, "max": 3000000, "nonInterest": 200000 },
  { "min": 3000001, "max": 4000000, "nonInterest": 250000 },
  { "min": 4000001, "max": Infinity, "nonInterest": 0 }
];

// Sayıya binlik ayırıcı nokta eklemek
function formatNumber(number) {
  return number.toLocaleString('tr-TR'); // Nokta ile binlik ayırıcı ekler
}

// Kullanıcı girişini çözme (örn. 1.000.000 -> 1000000)
function parseInput(input) {
  // Binlik ayırıcıyı kaldırıyoruz
  const value = input.replace(/\./g, ''); // Noktayı kaldırıyoruz
  return parseFloat(value) || 0;
}

// Vadesiz tutarı hesaplama
function calculateNonInterest(principal, limits) {
  for (const limit of limits) {
    if (principal >= limit.min && principal <= limit.max) {
      return limit.nonInterest;
    }
  }
  return 0;
}

// Günlük faiz hesaplama
function calculateDailyInterest(principal, rate, term, limits) {
  let totalPrincipal = principal;
  const dailyRate = rate / 100 / 365; // Yıllık faiz oranını günlük faize dönüştür
  const nonInterest = calculateNonInterest(totalPrincipal, limits);
  
  for (let day = 0; day < term; day++) {
    totalPrincipal += (totalPrincipal - nonInterest) * dailyRate; // Her gün faiz eklenir
  }
  return totalPrincipal - principal; // Toplam faiz
}

// Vadeli faiz hesaplama (normal faiz)
function calculateNormalInterest(principal, rate, term) {
  return principal * (rate / 100) * (term / 365); // Faiz sadece vade sonunda eklenir
}

// Faiz hesaplamalarını güncelleme
function updateComparison() {
  const principal = parseInput(document.getElementById('principal').value);
  const rate = parseInput(document.getElementById('rate').value);
  const term = parseInput(document.getElementById('term').value);
  
  // Odeabank hesaplamaları
  const odeaNonInterest = calculateNonInterest(principal, odeabankLimits);
  const odeaNormalInterest = calculateNormalInterest(principal, rate, term); // Vadeli faiz
  const odeaDailyInterest = calculateDailyInterest(principal, rate, term, odeabankLimits); // Günlük faiz

  // TEB hesaplamaları
  const tebNonInterest = calculateNonInterest(principal, tebLimits);
  const tebNormalInterest = calculateNormalInterest(principal, rate, term); // Vadeli faiz
  const tebDailyInterest = calculateDailyInterest(principal, rate, term, tebLimits); // Günlük faiz

  // Sonuçları tabloya yerleştir
  document.getElementById('odea_vadesiz_tutar').textContent = `${formatNumber(odeaNonInterest)} (Odeabank)`;
  document.getElementById('odea_vadeli').textContent = formatNumber(odeaNormalInterest);
  document.getElementById('odea_bilesik').textContent = formatNumber(odeaDailyInterest);

  document.getElementById('teb_vadesiz_tutar').textContent = `${formatNumber(tebNonInterest)} (TEB)`;
  document.getElementById('teb_vadeli').textContent = formatNumber(tebNormalInterest);
  document.getElementById('teb_bilesik').textContent = formatNumber(tebDailyInterest);

  // Günlük faiz başlığını güncelle
  document.getElementById('odea_gunluk').textContent = `Günlük faizin ${term} güne göre getirisi (Odeabank)`;
  document.getElementById('teb_gunluk').textContent = `Günlük faizin ${term} güne göre getirisi (TEB)`;
}

// Sayfa yüklendiğinde
window.onload = function() {
  document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    updateComparison();
  });
};
