// Mendapatkan elemen-elemen yang diperlukan dari DOM
const spinWheel = document.getElementById("spinWheel");
const spinBtn = document.getElementById("spin_btn");
const text = document.getElementById("text");

// Array yang berisi informasi sudut minimum, maksimum, dan nilai setiap segmen roda
const spinValues = [
  { minDegree: 61, maxDegree: 90, value: "zonk" },
  { minDegree: 31, maxDegree: 60, value: 200 },
  { minDegree: 0, maxDegree: 30, value: 300 },
  { minDegree: 331, maxDegree: 360, value: 400 },
  { minDegree: 301, maxDegree: 330, value: "zonk" },
  { minDegree: 271, maxDegree: 300, value: 600 },
  { minDegree: 241, maxDegree: 270, value: 700 },
  { minDegree: 211, maxDegree: 240, value: 800 },
  { minDegree: 181, maxDegree: 210, value: "zonk" },
  { minDegree: 151, maxDegree: 180, value: 1000 },
  { minDegree: 121, maxDegree: 150, value: 1100 },
  { minDegree: 91, maxDegree: 120, value: 1200 },
];

// Ukuran setiap segmen roda
const size = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

// Warna latar belakang untuk setiap segmen roda
const spinColors = [
  "#E74C3C",
  "#0000FF",
  "#2E86C1",
  "#138D75",
  "#F1C40F",
  "#D35400",
  "#138D75",
  "#F1C40F",
  "#b163da",
  "#E74C3C",
  "#7D3C98",
  "#138D75",
];

// Inisialisasi grafik roda
let spinChart = new Chart(spinWheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: ["zonk", 200, 300, 400, "zonk", 600, 700, 800, "zonk", 1000, 1100, 1200],
    datasets: [
      {
        backgroundColor: spinColors,
        data: size,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: {
        display: false,
      },
      datalabels: {
        rotation: 90,
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

// Fungsi untuk menampilkan nilai berdasarkan sudut roda
const generateValue = (angleValue) => {
  for (let i of spinValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      if (i.value === "zonk") {
        text.innerHTML = "<p>Oops! You got zonk. Try again!</p>";
      } else {
        text.innerHTML = `<p>Congratulations, You Have ${i.value} ! </p>`;
      }
      spinBtn.disabled = false;
    }
  }
};

// Variabel untuk mengatur rotasi roda
let count = 0;
let resultValue = 101;
let rotationInterval;

// Event listener untuk tombol spin
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  text.innerHTML = "<p>Best Of Luck!</p>";
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  let rotationSpeed = 30; // Kecepatan awal putaran

  rotationInterval = window.setInterval(() => {
    spinChart.options.rotation = spinChart.options.rotation + resultValue;
    spinChart.update();
    if (spinChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      spinChart.options.rotation = 0;
    } else if (count > 15 && spinChart.options.rotation == randomDegree) {
      generateValue(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }

    // Perlahan-lahan kurangi kecepatan rotasi saat mendekati sudut yang ditentukan
    if (rotationSpeed > 0.0) {
      rotationSpeed -= 0.0; // Mengurangi kecepatan rotasi
    } else {
      clearInterval(rotationInterval);
      spinBtn.disabled = false;
    }
  }, rotationSpeed);
});

// Fungsi untuk mencari nilai pemenang berdasarkan sudut putaran roda
function findWinnerValue(angleValue) {
  for (let i of spinValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      return i.value.toString(); // Mengembalikan nilai pemenang sebagai string
    }
  }
}

// Get the audio elements
var spinAudio = document.getElementById("spin-sound");
var winAudio = document.getElementById("win-sound");
var backgroundVideo = document.getElementById("background-video");

// Get the button elements
var placeBetButton = document.getElementById("betForm").querySelector("button[type='submit']");
var betAmountInput = document.getElementById("betAmount");
var betChoiceSelect = document.getElementById("betChoice");
var betResult = document.getElementById("betResult");

// Inisialisasi saldo
var balance = 1000; // Saldo awal
updateBalanceDisplay();

// Function to play video and audio together
function playVideoAndAudio() {
    backgroundVideo.play();
    spinAudio.play();
}

// Add event listeners for audio and video
backgroundVideo.addEventListener("canplay", playVideoAndAudio);
spinAudio.addEventListener("canplay", playVideoAndAudio);

// Add event listener to the button to place bet when clicked
placeBetButton.addEventListener("click", function(event) {
    event.preventDefault();
    var betAmount = parseInt(betAmountInput.value);
    var betChoice = betChoiceSelect.value;
    if (betAmount > balance) {
        betResult.innerHTML = "<p style='color:red;'>Saldo tidak cukup!</p>";
    } else {
        betResult.innerHTML = "";
        balance -= betAmount;
        updateBalanceDisplay();
        console.log("pasang:", betAmount, betChoice);
        betResult.innerHTML = `<p>Anda memasang taruhan ${betAmount} on ${betChoice}!</p>`;
    }
});

// Add event listener to the button to play audio when clicked
spinBtn.addEventListener("click", function() {
    if (spinAudio.paused) {
        spinAudio.play();
    }

    spinBtn.disabled = true;
    let randomDegree = Math.floor(Math.random() * 360) + 720;
    let rotationSpeed = 10;
    let currentRotation = 0;

    let spinInterval = setInterval(function() {
        currentRotation += rotationSpeed;
        spinChart.options.rotation = currentRotation % 360;
        spinChart.update();

        if (currentRotation >= randomDegree) {
            clearInterval(spinInterval);
            let stopAngle = currentRotation % 360;
            let result = findWinnerValue(stopAngle);
            text.innerHTML = `<p>Result: ${result}</p>`;

            if (result === betChoiceSelect.value) {
                let winnings = betAmount * 2; // Contoh: Menang 2x taruhan
                balance += winnings;
                winAudio.play();
                alert('Selamat! Anda menang ' + betAmount + '!');
            } else {
                // alert('Anda kalah. Coba lagi!');
            }

            updateBalanceDisplay();
            betResult.innerHTML = ''; // Reset tampilan hasil taruhan
            spinBtn.disabled = false;
        }
    }, 10);
});

// Fungsi untuk memperbarui tampilan saldo
function updateBalanceDisplay() {
    var balanceDisplay = document.getElementById('balanceInput');
    balanceDisplay.value = balance;
}

// Ambil elemen form taruhan
const betForm = document.getElementById("betForm");

// Tambahkan event listener untuk form taruhan
betForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Menghindari pengiriman form

    // Ambil nilai taruhan dan pilihan taruhan dari form
    const betAmount = parseInt(document.getElementById("betAmount").value);
    const betChoice = document.getElementById("betChoice").value;

    // Kurangi saldo berdasarkan taruhan
    decreaseBalanceOnLoss(betAmount, betChoice);
});

// Ambil elemen tombol Spin
const spinButton = document.getElementById("spin_btn");

// Tambahkan event listener untuk tombol Spin
spinButton.addEventListener("click", function() {
    // Ambil nilai taruhan dan pilihan taruhan dari form
    const betAmount = parseInt(document.getElementById("betAmount").value);
    const betChoice = document.getElementById("betChoice").value;

    // Tentukan hasil taruhan secara acak
    const result = getRandomResult();

    // // Tampilkan hasil taruhan
    // document.getElementById("betResult").innerHTML = `<p>Hasil: ${result}</p>`;

    // Bandingkan hasil dengan pilihan taruhan
    if (result === betChoice) {
        // Jika hasil sesuai dengan pilihan taruhan, beri pemberitahuan
        alert('Selamat! Anda menang!');
    } else {
        // Jika hasil tidak sesuai dengan pilihan taruhan, kurangi saldo
        decreaseBalanceOnLoss(betAmount, betChoice);
    }
});

// Function untuk mendapatkan hasil taruhan secara acak
function getRandomResult() {
    const results = ["500", "600", "700", "800", "900", "1000", "11000", "12000", "400", "300", "200", "zonk"];
    const randomIndex = Math.floor(Math.random() * results.length);
    return results[randomIndex];
}

// Function untuk mengurangi saldo ketika taruhan gagal
function decreaseBalanceOnLoss(betAmount, betChoice) {
    // Bandingkan hasil dengan pilihan taruhan
    if (betChoice !== "zonk") {
        // Ambil nilai saldo
        const balanceInput = document.getElementById("balanceInput");
        let currentBalance = parseInt(balanceInput.value);

        // Kurangi saldo
        currentBalance -= betAmount;

        // Perbarui tampilan saldo
        balanceInput.value = currentBalance;
    }
}